import type { CartStore } from '@/interfaces/cart.interface';
import type { SupplyResponse } from '@/interfaces/supplies.interface';
import { create } from 'zustand';

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  incrementQuantity: (id: string) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity + 1 } : i
      ),
    })),
  decrementQuantity: (id: string) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity - 1 } : i
      ),
    })),
  addItem: (item: SupplyResponse) =>
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id);
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      } else {
        return { items: [...state.items, { ...item, quantity: 1 }] };
      }
    }),
  removeItem: (id: string) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),
}));
