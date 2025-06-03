// src/pages/SubscriptionPlans.tsx

import SubscribeButton from "../../../components/SubscribeButton";

const SubscriptionPlans = () => {
  return (
    <div className="p-8 space-y-6">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold">Basic Plan</h2>
        <p>₹100 for 30 days</p>
        <SubscribeButton
          planName="Basic"
          price={100}
          subscriptionType="BASIC"
        />
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold">Pro Plan</h2>
        <p>₹200 for 60 days</p>
        <SubscribeButton planName="Pro" price={200} subscriptionType="PRO" />
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold">Premium Plan</h2>
        <p>₹300 for 90 days</p>
        <SubscribeButton
          planName="Premium"
          price={300}
          subscriptionType="PREMIUM"
        />
      </div>
    </div>
  );
};

export default SubscriptionPlans;
