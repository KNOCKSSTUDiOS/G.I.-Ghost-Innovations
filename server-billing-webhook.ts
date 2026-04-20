import express from "express";
import Stripe from "stripe";
import { handleStripeWebhook } from "./gi-billing/stripe";

export function attachBillingWebhook(app: express.Express) {
  app.post(
    "/billing/webhook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
      const sig = req.headers["stripe-signature"] as string;

      try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
        const event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          process.env.STRIPE_WEBHOOK_SECRET as string
        );

        const result = await handleStripeWebhook(event);
        res.json(result);
      } catch (err) {
        res.status(400).send("Webhook Error");
      }
    }
  );
}

