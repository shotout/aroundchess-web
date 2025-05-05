import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { productName, price, quantity, description, type } = JSON.parse(
        req.body
      );
      let statusurlSuccess =
        type == "membership"
          ? "status=successSubscribe"
          : "status=cancelSubscribe";
      let statusurlFailed =
        type == "token"
          ? `status=successToken&amount=${quantity}`
          : `status=cancelToken&amount=${quantity}`;
          
      console.log("req.body", req.body);
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: productName,
                description,
              },
              unit_amount: price,
            },
            quantity,
          },
        ],
        metadata: {
          itemType: type,
        },
        success_url: `${req.headers.origin}/profile?${statusurlSuccess}`,
        cancel_url: `${req.headers.origin}/profile?${statusurlFailed}`,
      });

      res.status(200).json({ id: session.id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
