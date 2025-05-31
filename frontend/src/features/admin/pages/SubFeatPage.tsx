import FeatureManagement from "../components/feature/FeatureManagement";
import SubscriptionManagement from "../components/Subscription/SubscriptionManagement";

function SubFeatPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-8">
          {/* Page Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Manage your features and subscription plans
            </p>
          </div>

          {/* Management Sections */}
          {/* Management Sections */}
          <div className="flex flex-col gap-8">
            <section className="bg-white rounded-lg shadow-sm p-6">
              <SubscriptionManagement />
            </section>
            <section className="bg-white rounded-lg shadow-sm p-6">
              <FeatureManagement />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubFeatPage;
