import { useEffect, useMemo, useState } from 'react';
import { SupplyCard } from '@/components/menu/SupplyCard';
import { TopAppBar } from '@/components/TopAppBar';
import { InputSearch } from '@/components/InputSearch';
import { useCategories } from '@/hooks/useCategories';
import type { CategoryResponse } from '@/interfaces/categories.interface';
import { CategorySkeleton } from '@/skeletons/CategorySkeleton';
import {
  useSuppliesBySlug,
  useSuppliesStream,
  useUpdateSupplyPriceStream,
} from '@/hooks/useSupplies';
import type { SupplyResponse } from '@/interfaces/supplies.interface';
import { SupplyCardSkeleton } from '@/skeletons/SupplyCardSkeleton';
import { CartBadget } from '@/components/cart/CartBadget';
import { useParams } from 'react-router-dom';
import { useBusinessStatusStream } from '@/hooks/useAuth';
import { BottomAppBar } from '@/components/BottomAppBar';
import { PaginationBar } from '@/components/PaginationBar';
import { DM_SANS_STYLE } from '@/lib/constants';

function firstLetterUpper(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

const BusinessClosedSVG = () => (
  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-[#E0E7FF]">
    <svg
      className="h-12 w-12 text-[#3B5BDB]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
      />
    </svg>
  </div>
);

const EmptySearchSVG = () => (
  <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center bg-[#E0E7FF] rounded-[20px]">
    <svg
      className="h-10 w-10 text-[#3B5BDB]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  </div>
);

function Menu() {
  const { slug } = useParams<{ slug: string }>();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [letters, setLetters] = useState<string>('');
  const [debouncedLetters, setDebouncedLetters] = useState('');
  const [page, setPage] = useState(1);

  const categories = useCategories();

  const activeCategoryId = selectedCategoryId ?? categories.data?.[0]?.id ?? '';

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedLetters(letters);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [letters]);

  const suppliesByType = useSuppliesBySlug(
    slug || '',
    activeCategoryId,
    debouncedLetters,
    page
  );

  useBusinessStatusStream(slug || '');
  useSuppliesStream(slug || '');
  useUpdateSupplyPriceStream(slug || '');

  const isBusinessOpen = suppliesByType.data?.is_business_open;

  const availableSupplies = useMemo(() => {
    return (
      suppliesByType?.data?.data?.filter(
        (s: SupplyResponse) => s.status === 'AVAILABLE'
      ) ?? []
    );
  }, [suppliesByType?.data?.data]);

  const totalPages =
    suppliesByType?.data?.metadata?.pagination?.totalPages ?? 0;

  return (
    <section className="min-h-screen flex flex-col bg-[#F1F5F9]">
      <TopAppBar
        subtitle="Panel de Menu"
        itemHeader={isBusinessOpen ? null : <CartBadget />}
      />

      {isBusinessOpen ? (
        <div className="max-w-md mx-auto mt-20 p-8 text-center">
          <BusinessClosedSVG />
          <h2
            className="text-2xl font-bold text-[#0F2A4A]"
            style={DM_SANS_STYLE}
          >
            Estamos descansando
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[#64748B]">
            Nuestro puesto está cerrado por ahora. Vuelve pronto para descubrir
            nuestros sabores.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-[#1E40AF] bg-[#DBEAFE]">
            <span className="w-2.5 h-2.5 rounded-full animate-pulse bg-[#3B82F6]" />
            Abierto pronto
          </div>
        </div>
      ) : (
        <div className="flex-1 flex-col mb-20">
          <div className="py-2 px-4">
            <InputSearch
              value={letters}
              onChange={setLetters}
              placeholder="Buscar platillos..."
            />
          </div>

          <div className="py-2 px-4">
            <div
              className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {categories.isLoading ? (
                <CategorySkeleton />
              ) : (
                categories?.data?.map((type: CategoryResponse) => (
                  <button
                    key={type.id}
                    disabled={!!letters}
                    className="shrink-0 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer border-none outline-none"
                    style={{
                      backgroundColor:
                        activeCategoryId === type.id ? '#0F2A4A' : '#FFFFFF',
                      color:
                        activeCategoryId === type.id ? '#FFFFFF' : '#475569',
                    }}
                    onClick={() => {
                      setSelectedCategoryId(type.id);
                      setPage(1);
                    }}
                  >
                    {firstLetterUpper(type.name)}
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="px-4 pb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {categories.isLoading || suppliesByType.isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <SupplyCardSkeleton key={i} />
                  ))
                : availableSupplies.map(
                    (supply: SupplyResponse, index: number) => (
                      <div
                        key={supply.id}
                        className="animate-fadeIn"
                        style={{ animationDelay: `${index * 40}ms` }}
                      >
                        <SupplyCard data={supply} />
                      </div>
                    )
                  )}
            </div>

            {!categories.isLoading &&
              !suppliesByType.isLoading &&
              availableSupplies.length === 0 && (
                <div className="text-center py-16">
                  <EmptySearchSVG />
                  <p className="text-lg font-semibold text-[#0F2A4A]">
                    No encontramos lo que buscas
                  </p>
                  <p className="mt-2 text-sm text-[#94A3B8]">
                    Intenta con otra búsqueda o categoría
                  </p>
                </div>
              )}
          </div>

          {!categories.isLoading && !suppliesByType.isLoading && (
            <PaginationBar
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              className={`mb-6 ${isBusinessOpen || totalPages <= 1 ? 'hidden' : ''}`}
            />
          )}
        </div>
      )}

      <div className="fixed w-full mx-auto bottom-0">
        <BottomAppBar />
      </div>
    </section>
  );
}

export default Menu;
