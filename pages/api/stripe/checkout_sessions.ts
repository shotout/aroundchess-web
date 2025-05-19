import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});
 
const SPECIAL_OFFER_COUPON_ID = "ru2iS7A4";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const {
        productName,
        price,
        quantity,
        description,
        type,
        idUser,
        membershipId,
        stripeProductId
      } = JSON.parse(req.body);
      let isMembership = productName.includes("Premium");

      let metadataToken = {
        itemType: type,
        userId: idUser,
        quantity,
      };

      let metadataMember = {
        itemType: type,
        userId: idUser,
        membershipId,
      };
      let statusurlSuccess =
        type == "membership"
          ? "status=successSubscribe"
          : `status=successToken&amount=${quantity}`;
      let statusurlFailed =
        type == "token"
          ? `status=successToken&amount=${quantity}`
          : `status=cancelSubscribe`;

      console.log("req.body", req.body);

      let sessionConfig: Stripe.Checkout.SessionCreateParams;

      if (isMembership) {
        // Untuk keanggotaan, gunakan mode subscription dengan price ID dan diskon
        sessionConfig = {
          payment_method_types: ["card"] as Stripe.Checkout.SessionCreateParams.PaymentMethodType[],
          mode: "subscription",
          line_items: [
            {
              price: stripeProductId,
              quantity: 1,
            },
          ],
          discounts: [{ coupon: SPECIAL_OFFER_COUPON_ID }], // Selalu gunakan diskon
          subscription_data: {
            metadata: {
              userId: idUser,
              itemType: "membership",
            },
          },
          metadata: metadataMember,
          success_url: `${req.headers.origin}/profile?${statusurlSuccess}`,
          cancel_url: `${req.headers.origin}/profile?${statusurlFailed}`,
        };

        console.log("Creating subscription checkout with discount");
      } else {
        // Untuk token, tetap gunakan mode payment dengan price_data
        sessionConfig = {
          payment_method_types: ["card"] as Stripe.Checkout.SessionCreateParams.PaymentMethodType[],
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
          metadata: metadataToken,
          success_url: `${req.headers.origin}/profile?${statusurlSuccess}`,
          cancel_url: `${req.headers.origin}/profile?${statusurlFailed}`,
        };

        console.log("Creating payment checkout for tokens");
      }
      console.log("Session config:", JSON.stringify(sessionConfig, null, 2));
      const session = await stripe.checkout.sessions.create(sessionConfig);

      res.status(200).json({ id: session.id, url: session.url });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
