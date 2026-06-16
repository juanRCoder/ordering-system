import { useEffect, useState } from 'react';
import { SupplyCard } from '@/components/menu/SupplyCard';
import { TopAppBar } from '@/components/TopAppBar';
import { InputSearch } from '@/components/InputSearch';
import { Button } from '@/components/ui/button';
import { BottomAppBar } from '@/components/BottomAppBar';
import { useCategories } from '@/hooks/useCategories';
import type { CategoryResponse } from '@/interfaces/categories.interface';
import { CategorySkeleton } from '@/skeletons/CategorySkeleton';
import { useSuppliesByTypeId } from '@/hooks/useSupplies';
import type { SupplyResponse } from '@/interfaces/supplies.interface';
import { SupplyCardSkeleton } from '@/skeletons/SupplyCardSkeleton';
import { CartBadget } from '@/components/cart/CartBadget';

function Menu() {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryResponse | null>(null);

  const categories = useCategories();
  const suppliesByType = useSuppliesByTypeId(selectedCategory?.id || '');

  useEffect(() => {
    if (categories.data) setSelectedCategory(categories.data[0]);
  }, [categories.data]);

  const firstLetterUpper = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

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
                  variant={
                    selectedCategory?.id === type.id ? 'default' : 'outline'
                  }
                  className="py-5 font-normal min-w-32 rounded-sm cursor-pointer text-base"
                  onClick={() => setSelectedCategory(type)}
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
          <div className="grid grid-cols-1 gap-4 mt-4">
            {categories.isLoading || suppliesByType.isLoading
              ? Array.from({ length: 2 }).map((_, i) => (
                  <SupplyCardSkeleton key={i} />
                ))
              : suppliesByType?.data
                  ?.filter(
                    (supply: SupplyResponse) => supply.status === 'AVAILABLE'
                  )
                  .map((supply: SupplyResponse) => (
                    <SupplyCard key={supply.id} data={supply} />
                  ))}
          </div>
        </div>
        <div className="h-[84px]" />
        <div className="fixed w-full max-w-md mx-auto bottom-0 left-0 right-0 z-50 flex flex-col gap-4">
          <BottomAppBar />
        </div>
      </div>
    </section>
  );
}

export default Menu;
