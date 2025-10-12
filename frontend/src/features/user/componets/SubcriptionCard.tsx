import { useEffect, useState } from "react";
import { format, differenceInDays, isBefore } from "date-fns";

import { useNavigate } from "react-router-dom";

import { Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import Button from "./ui/Button";
import { useAppSelector } from "../../../hooks/useAppSelector";
import apiAxios from "../../../utils/apiAxios";

interface Subscription {
  name: string;
  price: number;
  validityDays: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SubscriptionResponse {
  subscription: Subscription;
  features: string[];
  subStartDate: string;
  subEndDate: string;
}

export default function CurrentSubscriptionCard() {
  const [data, setData] = useState<SubscriptionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id, isSubscriptionActive } = useAppSelector((state) => state.auth);
  useEffect(() => {
    (async () => {
      try {
        const res = await apiAxios.get("/subfeat/usersub");
        console.log("resy sub", res.data);
        if (res.data?.data?.subscription) {
          const { subscription, features, subStartDate, subEndDate } =
            res.data.data;
          setData({ subscription, features, subStartDate, subEndDate });
        } else {
          setData(null); // not active or missing
        }
        console.log("subdaa", data);
      } catch (err) {
        console.error(err);
        // toast.error("Failed to fetch subscription data.");
        setData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-32 bg-gray-100 animate-pulse rounded-lg shadow-sm flex items-center justify-center">
        <p className="text-gray-500">Loading subscription...</p>
      </div>
    );
  }

  if (!data || !isSubscriptionActive) {
    return (
      <div className="w-full border border-dashed border-indigo-300 bg-white p-6 rounded-xl text-center shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          No Active Subscription
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          You currently don’t have a subscription plan.
        </p>
        <Button onClick={() => navigate("/subscription")}>
          Take Subscription
        </Button>
      </div>
    );
  }

  const { subscription, subStartDate, subEndDate, features } = data;
  const now = new Date();
  const end = new Date(subEndDate);
  const daysLeft = differenceInDays(end, now);
  const isExpired = isBefore(end, now);

  return (
    <div className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-md border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Current Subscription
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Plan</p>
          <p className="text-lg font-medium text-gray-900">
            {subscription.name}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Start Date</p>
          <p className="text-lg text-gray-900 flex items-center gap-1">
            <Calendar size={16} />
            {format(new Date(subStartDate), "dd MMM yyyy")}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">End Date</p>
          <p className="text-lg text-gray-900 flex items-center gap-1">
            <Calendar size={16} />
            {format(end, "dd MMM yyyy")}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Days Left</p>
          {isExpired ? (
            <p className="text-red-600 text-lg font-semibold flex items-center gap-2">
              <AlertCircle size={16} /> Expired
            </p>
          ) : (
            <p
              className={`text-lg font-semibold flex items-center gap-2 ${
                daysLeft <= 10 ? "text-orange-600" : "text-green-600"
              }`}
            >
              {daysLeft} day{daysLeft !== 1 && "s"} left
              {daysLeft <= 10 && (
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                  Renew soon
                </span>
              )}
            </p>
          )}
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-500 mb-2">Features</p>
        <ul className="list-disc list-inside space-y-1">
          {features.map((feature, index) => (
            <li key={index} className="text-gray-800 flex items-start gap-2">
              <CheckCircle2 className="text-green-500 mt-1" size={16} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
