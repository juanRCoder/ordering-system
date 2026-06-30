import { useState } from 'react';
import { SupplyCard } from '@/components/menu/SupplyCard';
import { TopAppBar } from '@/components/TopAppBar';
import { InputSearch } from '@/components/InputSearch';
import { Button } from '@/components/ui/button';
import { BottomAppBar } from '@/components/BottomAppBar';
import { useCategories } from '@/hooks/useCategories';
import type { CategoryResponse } from '@/interfaces/categories.interface';
import { CategorySkeleton } from '@/skeletons/CategorySkeleton';
import { useSuppliesBySlug } from '@/hooks/useSupplies';
import type { SupplyResponse } from '@/interfaces/supplies.interface';
import { SupplyCardSkeleton } from '@/skeletons/SupplyCardSkeleton';
import { CartBadget } from '@/components/cart/CartBadget';
import { useParams } from 'react-router-dom';

function Menu() {
  const { slug } = useParams<{ slug: string }>();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  const categories = useCategories();
  const activeCategoryId = selectedCategoryId ?? categories.data?.[0]?.id ?? '';
  const suppliesByType = useSuppliesBySlug(slug, activeCategoryId);

  const firstLetterUpper = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const selectedCategory = categories.data?.find(
    (category: CategoryResponse) => category.id === activeCategoryId
  );
  return (
    <section className="bg-[#F8F9FF] min-h-screen flex flex-col">
      <TopAppBar itemHeader={<CartBadget />} />
      <div className="flex-1 flex flex-col p-3">
        <div className="flex flex-col gap-3">
          <InputSearch placeholder="Buscar por nombre de insumo" />
          <div className="flex gap-3 overflow-x-auto">
            {categories.isLoading ? (
              <CategorySkeleton />
            ) : (
              categories?.data?.map((type: CategoryResponse) => (
                <Button
                  key={type.id}
                  variant={activeCategoryId === type.id ? 'default' : 'outline'}
                  className="py-5 font-normal min-w-32 rounded-sm cursor-pointer text-base transition-none"
                  onClick={() => setSelectedCategoryId(type.id)}
                >
                  {type.name}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 mt-4">
            {categories.isLoading || suppliesByType.isLoading
              ? Array.from({ length: 2 }).map((_, i) => (
                  <SupplyCardSkeleton key={i} />
                ))
              : suppliesByType?.data
                  ?.filter((s: SupplyResponse) => s.status === 'AVAILABLE')
                  .map((supply: SupplyResponse) => (
                    <SupplyCard key={supply.id} data={supply} />
                  ))}
          </div>
        </div>
        <div className="h-[84px]" />
        <div className="fixed w-full mx-auto bottom-0 left-0 right-0 z-50 flex flex-col gap-4">
          <BottomAppBar />
        </div>
      </div>
    </section>
  );
}

export default Menu;
