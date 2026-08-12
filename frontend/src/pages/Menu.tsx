import { useEffect, useState } from 'react';
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

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

  const firstLetterUpper = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <section className="min-h-screen flex flex-col bg-[#F1F5F9]">
      <TopAppBar
        itemHeader={
          suppliesByType.data?.is_business_open ? null : <CartBadget />
        }
      />
      {/* Business Closed State */}
      <div
        className={`${
          suppliesByType.data?.is_business_open ? 'block' : 'hidden'
        } max-w-md mx-auto mt-20 p-8 text-center`}
      >
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
        <h2
          className="text-2xl font-bold text-[#0F2A4A]"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
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
      {/* Main Menu Content */}
      <div
        className={`${
          suppliesByType.data?.is_business_open ? 'hidden' : 'flex'
        } flex-1 flex-col`}
      >
        {/* Search Section */}
        <div className="py-2 px-4">
          <InputSearch
            value={letters}
            onChange={setLetters}
            placeholder="Buscar platillos..."
          />
        </div>

        {/* Category Pills */}
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
                    color: activeCategoryId === type.id ? '#FFFFFF' : '#475569',
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
              : suppliesByType?.data?.data
                  ?.filter((s: SupplyResponse) => s.status === 'AVAILABLE')
                  .map((supply: SupplyResponse, index: number) => (
                    <div
                      key={supply.id}
                      className="animate-fadeIn"
                      style={{ animationDelay: `${index * 40}ms` }}
                    >
                      <SupplyCard data={supply} />
                    </div>
                  ))}
          </div>

          {/* Empty State */}
          {!categories.isLoading &&
            !suppliesByType.isLoading &&
            suppliesByType?.data?.data?.filter(
              (s: SupplyResponse) => s.status === 'AVAILABLE'
            ).length === 0 && (
              <div className="text-center py-16">
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
                <p className="text-lg font-semibold text-[#0F2A4A]">
                  No encontramos lo que buscas
                </p>
                <p className="mt-2 text-sm text-[#94A3B8]">
                  Intenta con otra búsqueda o categoría
                </p>
              </div>
            )}
        </div>
        {/* Pagination */}
        {!categories.isLoading && !suppliesByType.isLoading && (
          <Pagination
            className={`${suppliesByType.data?.is_business_open ? 'hidden' : ''} mb-6`}
          >
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  text="Anterior"
                  aria-disabled={page === 1}
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) {
                      setPage(page - 1);
                    }
                  }}
                />
              </PaginationItem>

              {Array.from(
                {
                  length:
                    suppliesByType?.data?.metadata?.pagination?.totalPages ?? 0,
                },
                (_, i) => (
                  <PaginationItem key={i + 1}>
                    <PaginationLink
                      href="#"
                      isActive={page === i + 1}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(i + 1);
                      }}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  text="Siguiente"
                  aria-disabled={
                    page ===
                    suppliesByType?.data?.metadata?.pagination?.totalPages
                  }
                  onClick={(e) => {
                    e.preventDefault();

                    if (
                      page <
                      (suppliesByType?.data?.metadata?.pagination?.totalPages ??
                        1)
                    ) {
                      setPage(page + 1);
                    }
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.35s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
}

export default Menu;
