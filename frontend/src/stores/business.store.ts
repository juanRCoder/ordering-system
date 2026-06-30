import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BusinessState {
  business_name: string | null;
  slug: string | null;
  setBusiness: (data: { business_name: string; slug: string }) => void;
  clearBusiness: () => void;
}

export const useBusinessStore = create<BusinessState>()(
  persist(
    (set) => ({
      business_name: null,
      slug: null,
      setBusiness: (data) =>
        set({ business_name: data.business_name, slug: data.slug }),
      clearBusiness: () => set({ business_name: null, slug: null }),
    }),
    {
      name: 'business-storage',
    }
  )
);
