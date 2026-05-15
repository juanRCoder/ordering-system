import type { SupplyResponse } from './supplies.interface';

export type CartItemType = SupplyResponse & {
  quantity: number;
};

export interface CartStore {
  items: CartItemType[];
  addItem: (item: SupplyResponse) => void;
  removeItem: (id: string) => void;
  incrementQuantity: (id: string) => void;
  decrementQuantity: (id: string) => void;
}
