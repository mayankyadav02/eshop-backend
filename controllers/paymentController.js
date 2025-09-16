import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Payment Intent
export const createPaymentIntent = async (req, res) => {
  let { amount, currency = "inr" } = req.body;

  try {
    // Ensure lowercase (Stripe strict hota hai)
    currency = currency.toLowerCase();

    // Minimum validation (Stripe INR ke liye ~₹70 safe h)
    if (currency === "inr" && amount < 7000) {
      return res
        .status(400)
        .json({ message: "Minimum payment amount should be at least ₹70" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ["card"], // optional but good practice
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ message: error.message });
  }
};

