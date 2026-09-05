import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_SLUG } from '@/lib/constants';

interface BusinessState {
  business_name: string | null;
  slug: string | null;
  owner_name: string | null;
  is_business_open: boolean | null;
  phone: string | null;
  table_count: number | null;
  setBusiness: (data: {
    business_name: string;
    slug: string;
    owner_name: string;
    is_business_open: boolean;
    phone: string;
  }) => void;
  setTableCount: (count: number) => void;
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
      phone: null,
      table_count: null,
      setBusiness: (data) =>
        set({
          business_name: data.business_name,
          slug: data.slug,
          owner_name: data.owner_name,
          is_business_open: data.is_business_open,
          phone: data.phone,
        }),
      setOrder: (data) =>
        set({ order_id: data.order_id, guest_name: data.guest_name }),
      setTableCount: (count) => set({ table_count: count }),
      clearBusiness: () =>
        set({
          slug: null,
          business_name: null,
          order_id: null,
          guest_name: null,
          owner_name: null,
          is_business_open: null,
          phone: null,
          table_count: null,
        }),
    }),
    {
      name: 'business-storage',
      version: 2,
      // Sanea sesiones viejas persistidas con slug null/"null"/vacío.
      migrate: (persisted: unknown) => {
        const state = (persisted ?? {}) as Record<string, unknown>;
        const slug = state['slug'];
        if (
          typeof slug !== 'string' ||
          !slug.trim() ||
          slug === 'null' ||
          slug === 'undefined'
        ) {
          state['slug'] = DEFAULT_SLUG;
        }
        return state;
      },
    }
  )
);
