import { SupplyDialog } from '@/components/admin/SupplyDialog';
import { BottomAppBar } from '@/components/BottomAppBar';
import { TopAppBar } from '@/components/TopAppBar';
import { useCategories } from '@/hooks/useCategories';
import { useEffect, useState } from 'react';
import { useSuppliesByAdmin } from '@/hooks/useSupplies';
import { SupplyCardAdminSkeleton } from '@/skeletons/SupplyCardSkeleton';
import type { SupplyResponse } from '@/interfaces/supplies.interface';
import { SupplyCard } from '@/components/admin/SupplyCard';
import type { CategoryResponse } from '@/interfaces/categories.interface';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { InputSearch } from '@/components/InputSearch';
import { Package } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Plus } from 'lucide-react';

function Supplies() {
  const [supplyOrigin, setSupplyOrigin] = useState('PLATFORM');
  const [selectedMode, setSelectedMode] = useState<'create' | 'edit'>('create');
  const [selectedSupplyId, setSelectedSupplyId] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [letters, setLetters] = useState<string>('');
  const [debouncedLetters, setDebouncedLetters] = useState('');
  const [page, setPage] = useState(1);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const categories = useCategories();
  const activeCategoryId = selectedCategoryId ?? categories.data?.[0]?.id ?? '';

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedLetters(letters);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [letters]);

  const suppliesByType = useSuppliesByAdmin(
    activeCategoryId,
    debouncedLetters,
    page
  );

  const selectedCategory = categories.data?.find(
    (category: CategoryResponse) => category.id === activeCategoryId
  );

  const firstLetterUpper = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const resultCount = suppliesByType.data?.data?.length ?? 0;
  return (
    <section className="bg-[#F1F5F9] min-h-screen flex flex-col">
      <TopAppBar
        subtitle={<p className="text-xs truncate max-w-45">Panel de Insumos</p>}
      />
      <div className="flex-1 flex flex-col p-3 pb-24">
        <div className="flex flex-col gap-3">
          <div>
            <h2
              className="text-2xl font-bold tracking-tight text-[#0F2A4A]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Insumos
            </h2>
            <p className="text-xs text-[#64748B]">
              Administra tus insumos y precios
            </p>
          </div>

          <InputSearch
            value={letters}
            onChange={setLetters}
            placeholder="Buscar por nombre de insumo"
          />

          <div
            className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.data?.map((type: CategoryResponse) => (
              <button
                key={type.id}
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
            ))}
          </div>
          {/* <Button
            variant="outline"
            className="cursor-pointer rounded-lg"
            onClick={() => {
              setSelectedMode('create');
              setOpenDialog(true);
            }}
          >
            <Plus className="h-5 w-5" strokeWidth={1.5} />
            Agregar Insumo
          </Button> */}

          <p className="text-sm font-semibold text-[#475569]">
            {resultCount} {resultCount === 1 ? 'insumo' : 'insumos'}
            {selectedCategory?.name
              ? ` · ${firstLetterUpper(selectedCategory.name)}`
              : ''}
          </p>
        </div>

        <div className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
            {categories.isLoading || suppliesByType.isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <SupplyCardAdminSkeleton key={i} />
                ))
              : suppliesByType.data.data?.map(
                  (supply: SupplyResponse, index: number) => (
                    <div
                      key={supply.id}
                      className="animate-fadeIn"
                      style={{ animationDelay: `${index * 40}ms` }}
                    >
                      <SupplyCard
                        data={supply}
                        handlerEvents={() => {
                          setOpenDialog(true);
                          setSelectedMode('edit');
                          setSelectedSupplyId(supply.id);
                          setSupplyOrigin(supply.origin || '');
                        }}
                      />
                    </div>
                  )
                )}
          </div>

          {!categories.isLoading &&
            !suppliesByType.isLoading &&
            resultCount === 0 && (
              <div className="text-center py-16">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[20px] bg-[#E0E7FF]">
                  <Package
                    className="h-10 w-10 text-[#3B5BDB]"
                    strokeWidth={1.5}
                  />
                </div>
                <p
                  className="text-lg font-semibold text-[#0F2A4A]"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  No hay insumos aquí
                </p>
                <p className="mt-2 text-sm text-[#94A3B8]">
                  Cambia de categoría o intenta otra búsqueda
                </p>
              </div>
            )}
        </div>

        <Pagination className={`my-6 ${resultCount === 0 ? 'hidden' : ''}`}>
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
                className="text-[#475569]"
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
                    isActive={page === i + 1}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(i + 1);
                    }}
                    className={`${
                      page === i + 1
                        ? 'bg-[#0F2A4A]! text-white! border-[#0F2A4A]!'
                        : 'text-[#475569]'
                    }`}
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
                className="text-[#475569]"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <div className="fixed w-full mx-auto bottom-0">
        <BottomAppBar />
      </div>
      <SupplyDialog
        externalTrigger={openDialog}
        setExternalTrigger={setOpenDialog}
        mode={selectedMode}
        id={selectedSupplyId}
        origin={supplyOrigin}
      />
    </section>
  );
}

export default Supplies;
