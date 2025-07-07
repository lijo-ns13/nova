export interface FeatureResponse {
  id: string;
  name: string;
  createdAt: string;
  updatedAt?: string;
}

export interface FeatureInput {
  name: string;
}

export interface UpdateFeatureInput {
  name?: string;
}
