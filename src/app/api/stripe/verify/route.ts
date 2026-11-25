import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSessionUserId } from "@/lib/session";
import { updateUser } from "@/lib/store";

export async function POST(req: Request) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret) {
    return NextResponse.json({ verified: false, reason: "no_stripe_key" });
  }

  const { sessionId } = (await req.json().catch(() => ({}))) as {
    sessionId?: string;
  };
  if (!sessionId || !sessionId.startsWith("cs_")) {
    return NextResponse.json({ verified: false }, { status: 400 });
  }

  try {
    const stripe = new Stripe(stripeSecret);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid" || session.status === "complete") {
      const { userId } = await getSessionUserId();
      const targetUserId =
        session.metadata?.userId ?? session.client_reference_id ?? userId;

      updateUser(targetUserId, (u) => ({
        ...u,
        plan: "pro",
        stripeCustomerId:
          typeof session.customer === "string"
            ? session.customer
            : u.stripeCustomerId,
        stripeSubscriptionId:
          typeof session.subscription === "string"
            ? session.subscription
            : u.stripeSubscriptionId,
      }));

      return NextResponse.json({ verified: true, plan: "pro" });
    }

    return NextResponse.json({ verified: false });
  } catch (err) {
    console.error("Stripe verify error:", err);
    return NextResponse.json({ verified: false }, { status: 500 });
  }
}
