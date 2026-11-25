import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSessionUserId } from "@/lib/session";
import { getOrCreateUser, updateUser } from "@/lib/store";

export async function POST(req: Request) {
  const { userId } = await getSessionUserId();
  const user = getOrCreateUser(userId);

  const origin =
    req.headers.get("origin") ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";

  const stripeSecret = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecret) {
    // Local Demo Checkout fallback when Stripe keys are not configured
    updateUser(userId, (u) => ({
      ...u,
      plan: "pro",
    }));
    return NextResponse.json({
      url: `${origin}/billing/success?demo=true`,
      demo: true,
    });
  }

  try {
    const stripe = new Stripe(stripeSecret);
    const priceId = process.env.STRIPE_PRO_PRICE_ID;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      client_reference_id: user.id,
      customer_email: user.email,
      metadata: {
        userId: user.id,
      },
      line_items: priceId
        ? [{ price: priceId, quantity: 1 }]
        : [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: "VibeCode AI Tutor — PRO",
                  description:
                    "1–2+ hours/day practice, Cursor/Claude Code/Replit, Context Rules, Testing & Deployment",
                },
                unit_amount: 1900,
                recurring: { interval: "month" },
              },
              quantity: 1,
            },
          ],
      success_url: `${origin}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/billing/cancel`,
    });

    return NextResponse.json({ url: session.url, demo: false });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create Stripe checkout session" },
      { status: 500 }
    );
  }
}
