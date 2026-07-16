import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BusinessState {
  business_name: string | null;
  slug: string | null;
  owner_name: string | null;
  is_business_open: boolean | null;
  setBusiness: (data: {
    business_name: string;
    slug: string;
    owner_name: string;
    is_business_open: boolean;
  }) => void;
  order_id: string | null;
  guest_name: string | null;
  setOrder: (data: { order_id: string; guest_name: string }) => void;
  clearBusiness: () => void;
}

export const useBusinessStore = create<BusinessState>()(
  persist(
    (set) => ({
      business_name: null,
      slug: null,
      order_id: null,
      guest_name: null,
      owner_name: null,
      is_business_open: null,
      setBusiness: (data) =>
        set({
          business_name: data.business_name,
          slug: data.slug,
          owner_name: data.owner_name,
          is_business_open: data.is_business_open,
        }),
      setOrder: (data) =>
        set({ order_id: data.order_id, guest_name: data.guest_name }),
      clearBusiness: () =>
        set({
          slug: null,
          business_name: null,
          order_id: null,
          guest_name: null,
          owner_name: null,
          is_business_open: null,
        }),
    }),
    {
      name: 'business-storage',
    }
  )
);
