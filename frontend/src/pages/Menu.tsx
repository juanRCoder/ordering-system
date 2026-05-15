import { ChevronRight, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SupplyCard } from '@/components/SupplyCard';
import { TopAppBar } from '@/components/TopAppBar';
import { InputSearch } from '@/components/InputSearch';
import { Button } from '@/components/ui/button';
import { BottomAppBar } from '@/components/BottomAppBar';
import { useTypesSupplies } from '@/hooks/useTypesSupplies';
import type { TypeSupplyResponse } from '@/interfaces/typesSupplies.interface';
import { CategorySkeleton } from '@/skeletons/CategorySkeleton';
import { useSuppliesByTypeId } from '@/hooks/useSupplies';
import type { SupplyResponse } from '@/interfaces/supplies.interface';
import { SupplyCardSkeleton } from '@/skeletons/SupplyCardSkeleton';
import { CartBadget } from '@/components/cart/CartBadget';

function Menu() {
  const [changeCategory, setChangeCategory] =
    useState<TypeSupplyResponse | null>(null);
  const typesSupplies = useTypesSupplies();
  const allSupplies = useSuppliesByTypeId(changeCategory?.id || '');

  useEffect(() => {
    if (typesSupplies.data) setChangeCategory(typesSupplies.data.data[0]);
  }, [typesSupplies.data]);

  const firstLetterUpper = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <section className="bg-[#F8F9FF] min-h-screen flex flex-col">
      <TopAppBar itemHeader={<CartBadget />} />
      <div className="flex-1 flex flex-col p-5">
        <div className="flex flex-col gap-3">
          <InputSearch />
          <div className="flex gap-3 overflow-x-auto">
            {typesSupplies.isLoading ? (
              <CategorySkeleton />
            ) : (
              typesSupplies.data?.data?.map((type: TypeSupplyResponse) => (
                <Button
                  key={type.id}
                  variant={
                    changeCategory?.id === type.id ? 'secondary' : 'outline'
                  }
                  className="h-11.5 w-32 rounded-[12px] cursor-pointer text-[17px]"
                  onClick={() => setChangeCategory(type)}
                >
                  {type.name}
                </Button>
              ))
            )}
          </div>
        </div>
        <div className="mt-4">
          {typesSupplies.isLoading ? (
            <div className="animate-pulse bg-muted-foreground/40 rounded-md h-8 w-40" />
          ) : (
            <h2 className="text-2xl font-bold text-primary">
              {changeCategory &&
                firstLetterUpper(changeCategory.name) + ' del dia'}
            </h2>
          )}
          <div
            className={`grid ${changeCategory?.layout === 'HALF' ? 'grid-cols-2' : 'grid-cols-1'} gap-4 mt-4`}
          >
            {typesSupplies.isLoading || allSupplies.isLoading
              ? Array.from({
                  length: changeCategory?.layout === 'HALF' ? 4 : 2,
                }).map((_, i) => (
                  <SupplyCardSkeleton
                    key={i}
                    layout={changeCategory?.layout || 'FULL'}
                  />
                ))
              : allSupplies.data?.data?.map((supply: SupplyResponse) => (
                  <SupplyCard
                    key={supply.id}
                    supplyType={changeCategory}
                    data={supply}
                  />
                ))}
          </div>
        </div>
        {/*  */}
        {/* <div className="h-[80px]" /> */}
        <div className="h-[170px]" />
        {/*  */}
        <div className="fixed w-full max-w-md mx-auto bottom-0 left-0 right-0 z-50 flex flex-col gap-4">
          <div className="flex items-center justify-between bg-primary h-[77px] px-6 rounded-md mx-2 cursor-pointer shadow-md">
            <div className="flex items-end justify-center gap-2">
              <ShoppingBag className="w-7 h-7 text-card shrink-0" />
              <p className="text-card text-[17px]">2 artículos añadidos</p>
            </div>
            <div className="flex items-center justify-center gap-2">
              <p className="text-card text-xl">S/ 40.00</p>
              <ChevronRight className="w-6 h-6 text-card" />
            </div>
          </div>
          <BottomAppBar />
        </div>
      </div>
    </section>
  );
}

export default Menu;
