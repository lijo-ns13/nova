import { loadStripe } from "@stripe/stripe-js";
import { useAppSelector } from "../hooks/useAppSelector";
import { createCheckoutSession } from "../services/stripeapi";
import toast from "react-hot-toast";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

interface Props {
  planName: string;
  price: number;
}

const SubscribeButton: React.FC<Props> = ({ planName, price }) => {
  const { id: userId } = useAppSelector((state) => state.auth);

  const handleCheckout = async () => {
    if (!userId) {
      toast.error("Please login to subscribe.");
      return;
    }

    try {
      const response = await createCheckoutSession(userId, price, planName);
      console.log("reskfjslkfjslkfjsl,bykkjalkj", response);
      if ("error" in response) {
        toast.error(response.error);
        return;
      }

      // ✅ Manually redirect to the URL returned by backend
      if (response.url) {
        window.location.href = response.url;
      } else {
        toast.error("Missing Stripe URL");
      }
    } catch (err) {
      console.error("Stripe error", err);
      toast.error("Something went wrong during checkout");
    }
  };

  return (
    <button
      onClick={handleCheckout}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    >
      Subscribe to {planName}
    </button>
  );
};

export default SubscribeButton;
