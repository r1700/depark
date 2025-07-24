// packages/shared/index.ts
export interface Item {
  id: string;
  name: string;
  type: string;
  amount: number;
}

export interface ItemsResponse {
  success: boolean;
  data: Item[];
}

export interface ItemResponse {
  success: boolean;
  data: Item | null;
  error?: string;
}
