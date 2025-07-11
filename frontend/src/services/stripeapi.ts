import userAxios from "../utils/userAxios";

export const createCheckoutSession = async (
  userId: string,
  price: number,
  planName: string
): Promise<{ url?: string; error?: string }> => {
  try {
    const response = await userAxios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/stripe/create-checkout-session`,
      {
        userId,
        price,
        metadata: {
          userId,
          planName,
        },
      }
    );
    return { url: response.data.url };
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      return { error: error.response.data.message };
    }
    return { error: "Something went wrong while creating checkout session." };
  }
};
