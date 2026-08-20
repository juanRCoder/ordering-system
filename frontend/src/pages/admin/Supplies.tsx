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
import { InputSearch } from '@/components/InputSearch';
import { Package, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useParams } from 'react-router-dom';
import { DM_SANS_STYLE } from '@/lib/constants';
import { PaginationBar } from '@/components/PaginationBar';
import { firstLetterUpper } from '@/lib/string';

function Supplies() {
  const { slug } = useParams<{ slug: string }>();
  const isDemo = slug === 'user-restaurant';
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

  const resultCount = suppliesByType.data?.data?.length ?? 0;

  const totalPages =
    suppliesByType?.data?.metadata?.pagination?.totalPages ?? 0;

  return (
    <section className="bg-[#F1F5F9] min-h-screen flex flex-col">
      <TopAppBar subtitle="Panel de Insumos" />
      <div className="flex-1 flex flex-col p-3 pb-24">
        <div className="flex flex-col gap-3">
          <div>
            <h2
              className="text-2xl font-bold tracking-tight text-[#0F2A4A]"
              style={DM_SANS_STYLE}
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
          <Button
            className="group/cta relative h-11 cursor-pointer overflow-hidden rounded-lg border-t border-white/15 bg-[#0F2A4A] px-5 font-semibold text-white shadow-[0_6px_18px_-6px_rgba(15,42,74,0.55)] transition-all duration-300 hover:bg-[#14335C] hover:shadow-[0_10px_26px_-8px_rgba(15,42,74,0.65)] active:translate-y-px active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-[#3B5BDB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F1F5F9]"
            disabled={isDemo}
            title={isDemo ? 'El demo no permite crear insumos' : undefined}
            onClick={() => {
              if (isDemo) return;
              setSelectedMode('create');
              setOpenDialog(true);
            }}
          >
            <span
              aria-hidden
              className="absolute inset-0 -translate-x-full bg-[linear-gradient(105deg,transparent_35%,rgba(255,255,255,0.22)_50%,transparent_65%)] transition-transform duration-700 ease-out group-hover/cta:translate-x-full"
            />
            <span className="relative flex items-center gap-2">
              <Plus
                className="h-5 w-5 transition-transform duration-300 group-hover/cta:rotate-180"
                strokeWidth={2.5}
              />
              Agregar Insumo
            </span>
          </Button>

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
                  style={DM_SANS_STYLE}
                >
                  No hay insumos aquí
                </p>
                <p className="mt-2 text-sm text-[#94A3B8]">
                  Cambia de categoría o intenta otra búsqueda
                </p>
              </div>
            )}
        </div>

        <PaginationBar
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          linkClassName="text-[#475569]"
        />
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
