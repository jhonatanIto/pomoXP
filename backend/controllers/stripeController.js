import Stripe from "stripe";
import { db } from "../db.js";
import { users } from "../schema.js";
import { eq } from "drizzle-orm";

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

    const mode = "subscription";

    const session = await stripe.checkout.sessions.create({
      mode,

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

export const stripeWebhookController = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!endpointSecret) {
    console.warn("STRIPE_WEBHOOK_SECRET not defined, webhook disabled");
  }

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (error) {
    console.log("webhook signature failed:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  console.log("Stipe Event>:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const userId = session.metadata.userId;
    const plan = session.metadata.plan;

    console.log("Payment confirmed!");
    console.log("User:", userId);
    console.log("Plan:", plan);

    await db
      .update(users)
      .set({ plan: plan })
      .where(eq(users.id, Number(userId)));

    console.log("User upgraded to premium!");
  }
  res.json({ received: true });
};
