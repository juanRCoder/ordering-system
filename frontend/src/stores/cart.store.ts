import type { SupplyResponse } from '@/interfaces/supplies.interface';
import { create } from 'zustand';

export type CartItemType = {
  id: string;
  name: string;
  imagen_url?: string;
  description?: string;
  price: number;
  quantity: number;
  observations?: string;
};

export interface CartStore {
  items: CartItemType[];
  addItem: (item: SupplyResponse) => void;
  removeItem: (id: string) => void;
  incrementQuantity: (id: string) => void;
  decrementQuantity: (id: string) => void;
  clear: () => void;
  totalSupplies: number;
  totalPrice: number;
  setObservations: (id: string, observation: string) => void;
}

export const calculateTotals = (items: CartItemType[]) => ({
  totalSupplies: items.reduce((acc, item) => acc + item.quantity, 0),
  totalPrice: items.reduce((acc, item) => acc + item.price * item.quantity, 0),
});

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  totalSupplies: 0,
  totalPrice: 0,
  incrementQuantity: (id: string) =>
    set((state) => {
      const updatedItems = state.items.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity + 1 } : i
      );
      return {
        items: updatedItems,
        ...calculateTotals(updatedItems),
      };
    }),
  decrementQuantity: (id: string) =>
    set((state) => {
      const updatedItems = state.items.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity - 1 } : i
      );
      return {
        items: updatedItems,
        ...calculateTotals(updatedItems),
      };
    }),
  addItem: (item: SupplyResponse) =>
    set((state) => {
      let updatedItems: CartItemType[];

      const existingItem = state.items.find((i) => i.id === item.id);
      if (existingItem) {
        updatedItems = state.items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        updatedItems = [
          ...state.items,
          {
            id: item.id,
            name: item.name,
            price: 0,
            imagen_url: item.image_url,
            description: '',
            quantity: 1,
            observations: '',
          },
        ];
      }

      return {
        items: updatedItems,
        ...calculateTotals(updatedItems),
      };
    }),
  removeItem: (id: string) =>
    set((state) => {
      const updatedItems = state.items.filter((i) => i.id !== id);
      return {
        items: updatedItems,
        ...calculateTotals(updatedItems),
      };
    }),
  setObservations: (id: string, observations: string) =>
    set((state) => {
      const updatedItems = state.items.map((i) =>
        i.id === id ? { ...i, observations } : i
      );
      return {
        items: updatedItems,
      };
    }),
  clear: () =>
    set({
      items: [],
      totalSupplies: 0,
      totalPrice: 0,
    }),
}));
