import Stripe from "stripe";
import { db } from "../db.js";
import { users } from "../schema.js";
import { eq } from "drizzle-orm";
import { date } from "drizzle-orm/singlestore-core";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const priceMap = {
  monthly: process.env.PRICE_MONTHLY,
  yearly: process.env.PRICE_YEARLY,
  threeYears: process.env.PRICE_3YEARS,
};

export const stripeController = async (req, res) => {
  try {
    const userId = req.userId;
    const { plan } = req.body;

    const priceId = priceMap[plan];
    if (!priceId) return res.status(400).json({ error: "Invalid plan" });

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: {
        userId: String(userId),
        plan,
      },

      success_url: "https://pomoxp.com/payment/success",
      cancel_url: "https://pomoxp.com/payment/cancel",
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error(
      "Stripe error:",
      error.raw ? error.raw.message : error.message,
      error,
    );
    res.status(500).json({ error: "Stripe session failed" });
  }
};

const handleCheckoutCompleted = async (session) => {
  if (session.payment_status !== "paid") return;

  const userId = session.metadata.userId;
  if (!userId) return;

  const plan = session.metadata.plan;
  const customerId = session.customer;
  const subscriptionId = session.subscription;

  await db
    .update(users)
    .set({
      plan,
      payment_status: "active",
      subscriptionId,
      ...(customerId && { stripeCustomerId: customerId }),
    })
    .where(eq(users.id, Number(userId)));

  console.log("User upgraded to premium");
};

const handleInvoicePaymentSucceeded = async (invoice) => {
  const customerId = invoice.customer;

  await db
    .update(users)
    .set({ payment_status: "active" })
    .where(eq(users.stripeCustomerId, customerId));

  console.log("Subscription renewed");
};

const handleInvoicePaymentFailed = async (invoice) => {
  const customerId = invoice.customer;

  await db
    .update(users)
    .set({ payment_status: "failed" })
    .where(eq(users.stripeCustomerId, customerId));

  console.log("Payment failed");
};

const handleSubscriptionDeleted = async (subscription) => {
  const customerId = subscription.customer;

  await db
    .update(users)
    .set({ plan: "free", payment_status: "canceled" })
    .where(eq(users.stripeCustomerId, customerId));

  console.log("Subscription canceled");
};

export const stripeWebhookController = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.log("webhook signature failed:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  console.log("Stipe Event>:", event.type);

  const handler = stripeEventHandlers[event.type];

  if (handler) {
    await handler(event.data.object);
  } else {
    console.log("Unhandled event:", event.type);
  }

  res.json({ received: true });
};

const stripeEventHandlers = {
  "checkout.session.completed": handleCheckoutCompleted,
  "invoice.payment_succeeded": handleInvoicePaymentSucceeded,
  "invoice.payment_failed": handleInvoicePaymentFailed,
  "customer.subscription.deleted": handleSubscriptionDeleted,
};

export const cancelSubscription = async (req, res) => {
  try {
    const userId = req.userId;

    const [user] = await db.select().from(users).where(eq(users.id, userId));

    if (!user || !user.subscriptionId) {
      return res.status(400).json({ error: "No active subscription" });
    }

    const subscription = await stripe.subscriptions.update(
      user.subscriptionId,
      {
        cancel_at_period_end: true,
      },
    );

    const periodEnd = subscription.current_period_end;

    if (!periodEnd) {
      console.error(
        "Stripe subscription missing current_period_end",
        subscription,
      );
      return res
        .status(500)
        .json({ error: "Unable to determine subscription end date" });
    }

    const endDate = new Date(periodEnd * 1000);

    await db
      .update(users)
      .set({
        cancel_at_period_end: true,
        subscription_end_date: endDate,
      })
      .where(eq(users.id, userId));

    return res.json({
      success: true,
      subscriptionEndDate: endDate,
    });
  } catch (error) {
    console.error("Cancel subscription error:", error);
    res.status(500).json({ error: "Failed to cancel subscription" });
  }
};
