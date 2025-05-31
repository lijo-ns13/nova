import { useEffect, useState } from "react";
import { useSubscriptionWithFeatures } from "../hooks/useSubscriptionWithFeatures";
interface SubscriptionWithFeat {
  subscription: {
    _id: string;
    name: string;
    price: number;
    validityDays: number;
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
  };
  features: string[];
}

function SubscriptionUserPage() {
  const { data, loading, error } = useSubscriptionWithFeatures();
  const [sub, setSub] = useState<SubscriptionWithFeat[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      setSub(data.data);
    }
  }, [data]);

  const handleSelectPlan = (planId: string, planName: string) => {
    setSelectedPlan(planId);
    // Here you would typically handle the subscription logic
    console.log(`Selected plan: ${planName}`);
  };

  const getPlanColor = (index: number) => {
    const colors = [
      {
        bg: "from-emerald-500 to-teal-600",
        accent: "emerald",
        ring: "emerald-500",
      },
      {
        bg: "from-violet-500 to-purple-600",
        accent: "violet",
        ring: "violet-500",
      },
      { bg: "from-rose-500 to-pink-600", accent: "rose", ring: "rose-500" },
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-l-indigo-400 rounded-full animate-spin animate-reverse"></div>
          </div>
          <p className="text-lg font-medium text-slate-600 animate-pulse">
            Loading subscription plans...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4 border border-red-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-red-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-red-900">
              Error Loading Plans
            </h2>
          </div>
          <p className="text-red-700 mb-6">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-10"></div>
        <div className="relative container mx-auto px-4 py-16 sm:py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 bg-clip-text text-transparent mb-6">
              Choose Your Perfect Plan
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Unlock premium features and take your productivity to the next
              level with our carefully crafted subscription plans.
            </p>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {sub.map((item, index) => {
            const colors = getPlanColor(index);
            const isPopular = index === 1; // Make middle plan popular

            return (
              <div
                key={item.subscription._id}
                className={`relative group transform transition-all duration-300 hover:scale-105 ${
                  isPopular ? "-mt-4 lg:-mt-6" : ""
                }`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                      🔥 Most Popular
                    </div>
                  </div>
                )}

                <div
                  className={`relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden ${
                    isPopular ? "ring-2 ring-violet-500 ring-opacity-50" : ""
                  }`}
                >
                  {/* Gradient Header */}
                  <div className={`h-2 bg-gradient-to-r ${colors.bg}`}></div>

                  <div className="p-6 sm:p-8">
                    {/* Plan Name */}
                    <div className="text-center mb-6">
                      <h2
                        className={`text-2xl sm:text-3xl font-bold text-slate-900 mb-2`}
                      >
                        {item.subscription.name}
                      </h2>
                      <div className="flex items-center justify-center space-x-1 mb-4">
                        <span className="text-4xl sm:text-5xl font-bold text-slate-900">
                          ₹{item.subscription.price}
                        </span>
                        <span className="text-slate-500 font-medium">
                          /{item.subscription.validityDays} days
                        </span>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                        <svg
                          className="w-5 h-5 text-green-500 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        What's included
                      </h3>
                      <ul className="space-y-3">
                        {item.features.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-start space-x-3"
                          >
                            <div
                              className={`w-5 h-5 rounded-full bg-gradient-to-r ${colors.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}
                            >
                              <svg
                                className="w-3 h-3 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <span className="text-slate-700 font-medium">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() =>
                        handleSelectPlan(
                          item.subscription._id,
                          item.subscription.name
                        )
                      }
                      className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${
                        selectedPlan === item.subscription._id
                          ? `bg-gradient-to-r ${colors.bg} text-white shadow-lg`
                          : isPopular
                          ? `bg-gradient-to-r ${colors.bg} text-white shadow-lg hover:shadow-xl`
                          : `bg-gradient-to-r ${colors.bg} text-white shadow-lg hover:shadow-xl`
                      } focus:ring-${colors.ring}`}
                      disabled={selectedPlan === item.subscription._id}
                    >
                      {selectedPlan === item.subscription._id ? (
                        <span className="flex items-center justify-center space-x-2">
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>Selected</span>
                        </span>
                      ) : (
                        `Choose ${item.subscription.name}`
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Why Choose Our Plans?
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">
                  Money Back Guarantee
                </h4>
                <p className="text-slate-600 text-sm">
                  30-day risk-free trial period
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">
                  Cancel Anytime
                </h4>
                <p className="text-slate-600 text-sm">
                  No long-term commitments
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">
                  Instant Access
                </h4>
                <p className="text-slate-600 text-sm">
                  Start using features immediately
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionUserPage;
