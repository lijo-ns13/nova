import { loadStripe } from "@stripe/stripe-js";
import { useAppSelector } from "../hooks/useAppSelector";
import { createCheckoutSession } from "../services/stripeapi";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

interface Props {
  planName: string;
  price: number;
}

const SubscribeButton: React.FC<Props> = ({ planName, price }) => {
  const { id } = useAppSelector((state) => state.auth);

  const handleCheckout = async () => {
    console.log("Button clicked");
    console.log("User ID:", id);

    if (!id) {
      alert("Please log in");
      return;
    }

    try {
      console.log("Creating checkout session...");
      const { url, error } = await createCheckoutSession(id, price, planName);

      if (error) {
        alert(error); // Show error message from backend
        return;
      }

      if (!url) {
        alert("Something went wrong. No URL returned.");
        return;
      }

      const stripe = await stripePromise;
      if (stripe) {
        window.location.href = url;
      } else {
        alert("Stripe initialization failed.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Payment failed. Try again.");
    }
  };

  return (
    <button
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      onClick={handleCheckout}
    >
      Subscribe to {planName}
    </button>
  );
};

export default SubscribeButton;
