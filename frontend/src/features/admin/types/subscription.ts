export interface SubscriptionPlanResponse {
  id: string;
  name: "BASIC" | "PRO" | "PREMIUM";
  price: number;
  validityDays: number;
  isActive: boolean;
}

export interface CreatePlanInput {
  name: "BASIC" | "PRO" | "PREMIUM";
  price: number;
  validityDays: number;
  isActive?: boolean;
}

export type UpdatePlanInput = Partial<
  Omit<SubscriptionPlanResponse, "id" | "name">
>;
