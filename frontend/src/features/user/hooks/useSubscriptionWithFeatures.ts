import { useEffect, useState } from "react";
import {
  getAllSubscriptionWithFeature,
  HTTPErrorResponse,
  SubscriptionWithFeaturesResponse,
} from "../services/SubWithFeatService";

export const useSubscriptionWithFeatures = () => {
  const [data, setData] = useState<SubscriptionWithFeaturesResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<HTTPErrorResponse | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAllSubscriptionWithFeature();
        setData(result);
      } catch (error) {
        setError(error as HTTPErrorResponse);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return { data, loading, error };
};
