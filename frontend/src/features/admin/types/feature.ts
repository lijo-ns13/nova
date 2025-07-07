export interface FeatureResponse {
  id: string;
  name: string;
  isActive?: boolean;
}

export interface FeatureInput {
  name: string;
}

export interface UpdateFeatureInput {
  name?: string;
  isActive?: boolean;
}

// Alias for FeatureResponse to maintain compatibility
export type Feature = FeatureResponse;
export type FeatureFormData = FeatureInput;
