import { NextResponse } from "next/server";
import Stripe from "stripe";
import { findUserByStripeCustomer, updateUser } from "@/lib/store";

export async function POST(req: Request) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecret || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook not configured" },
      { status: 400 }
    );
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await req.text();
  const stripe = new Stripe(stripeSecret);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId =
        session.metadata?.userId ?? session.client_reference_id ?? undefined;
      if (userId) {
        updateUser(userId, (u) => ({
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
      }
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : undefined;
      if (customerId) {
        const user = findUserByStripeCustomer(customerId);
        if (user) {
          updateUser(user.id, (u) => ({
            ...u,
            plan: "free",
          }));
        }
      }
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
