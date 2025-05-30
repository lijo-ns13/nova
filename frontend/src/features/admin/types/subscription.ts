export interface Subscription {
  _id: string;
  name: "BASIC" | "PRO" | "PREMIUM";
  price: number;
  validityDays: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface SubscriptionFormData {
  name: string;
  price: number;
  validityDays: number;
}
