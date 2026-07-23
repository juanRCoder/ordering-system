import { useEffect, useState } from 'react';
import { SupplyCard } from '@/components/menu/SupplyCard';
import { TopAppBar } from '@/components/TopAppBar';
import { InputSearch } from '@/components/InputSearch';
import { Button } from '@/components/ui/button';
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

  const selectedCategory = categories.data?.find(
    (category: CategoryResponse) => category.id === activeCategoryId
  );
  return (
    <section className="bg-[#F8F9FF] min-h-screen flex flex-col">
      <TopAppBar
        itemHeader={
          suppliesByType.data?.is_business_open ? null : <CartBadget />
        }
      />
      <div
        className={`${
          suppliesByType.data?.is_business_open ? 'block' : 'hidden'
        } max-w-sm mx-auto mt-16 p-6 text-center`}
      >
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-6 w-6 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Puesto cerrado</h2>
        <p className="mt-2 text-sm text-gray-500">
          En este momento no estamos recibiendo pedidos. Vuelve a intentarlo más
          tarde.
        </p>
      </div>
      <div
        className={`${
          suppliesByType.data?.is_business_open ? 'hidden' : 'flex'
        } flex-1 flex-col p-3`}
      >
        <div className="flex flex-col gap-3">
          <InputSearch
            value={letters}
            onChange={setLetters}
            placeholder="Buscar por nombre de insumo"
          />
          <div className="flex gap-3 overflow-x-auto">
            {categories.isLoading ? (
              <CategorySkeleton />
            ) : (
              categories?.data?.map((type: CategoryResponse) => (
                <Button
                  key={type.id}
                  disabled={!!letters}
                  variant={activeCategoryId === type.id ? 'default' : 'outline'}
                  className="py-5 font-normal min-w-32 rounded-sm cursor-pointer text-base transition-none"
                  onClick={() => {
                    setSelectedCategoryId(type.id);
                    setPage(1);
                  }}
                >
                  {firstLetterUpper(type.name)}
                </Button>
              ))
            )}
          </div>
        </div>
        <div className="mt-4">
          {categories.isLoading ? (
            <div className="animate-pulse bg-muted-foreground/40 rounded-sm h-8 w-40" />
          ) : (
            <h2 className="text-2xl font-bold text-primary">
              {selectedCategory && firstLetterUpper(selectedCategory.name)}
            </h2>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 mt-4">
          {categories.isLoading || suppliesByType.isLoading
            ? Array.from({ length: 2 }).map((_, i) => (
                <SupplyCardSkeleton key={i} />
              ))
            : suppliesByType?.data?.data
                ?.filter((s: SupplyResponse) => s.status === 'AVAILABLE')
                .map((supply: SupplyResponse) => (
                  <SupplyCard key={supply.id} data={supply} />
                ))}
        </div>
      </div>
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
    </section>
  );
}

export default Menu;
