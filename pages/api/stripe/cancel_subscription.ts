import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});
export default async function handlerCancel(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { subscriptionId } = JSON.parse(req.body);

      const session = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true, // or false to cancel immediately
      });

      res.status(200).json({ id: session.id, url: "" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
