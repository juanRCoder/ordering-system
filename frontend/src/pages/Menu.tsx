import { ChevronRight, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { SupplyCard } from '@/components/SupplyCard';
import { TopAppBar } from '@/components/TopAppBar';
import { InputSearch } from '@/components/InputSearch';
import { Button } from '@/components/ui/button';
import { BottomAppBar } from '@/components/BottomAppBar';
import { Link } from 'react-router-dom';

function Menu() {
  const [changeCategory, setChangeCategory] = useState<'platos' | 'bebidas'>(
    'platos'
  );

  return (
    <section className="bg-[#F8F9FF] min-h-screen flex flex-col">
      <TopAppBar
        itemHeader={
          <Link to="/cart">
            <div className="relative cursor-pointer">
              <ShoppingBag className="h-6 w-6 text-primary" />
              <span className="absolute -top-2.5 -right-2.5 text-xs text-white bg-primary rounded-full w-6 h-6 grid place-items-center">
                0
              </span>
            </div>
          </Link>
        }
      />
      <div className="flex-1 flex flex-col p-5">
        <div className="flex flex-col gap-3">
          <InputSearch />
          <div className="flex gap-3 overflow-x-auto">
            <Button
              variant={changeCategory === 'platos' ? 'secondary' : 'outline'}
              className="h-11.5 w-32 rounded-[12px] cursor-pointer"
              onClick={() => setChangeCategory('platos')}
            >
              Platos
            </Button>
            <Button
              variant={changeCategory === 'bebidas' ? 'secondary' : 'outline'}
              className="h-11.5 w-32 rounded-[12px] cursor-pointer"
              onClick={() => setChangeCategory('bebidas')}
            >
              Bebidas
            </Button>
          </div>
        </div>
        <div className="mt-4">
          <h2 className="text-2xl font-bold text-primary">
            {changeCategory === 'bebidas' ? 'Bebidas' : 'Platos del dia'}
          </h2>
          <div
            className={`grid ${changeCategory === 'bebidas' ? 'grid-cols-2' : 'grid-cols-1'} gap-4 mt-4 mb-44`}
          >
            <SupplyCard supplyType={changeCategory} />
            <SupplyCard supplyType={changeCategory} />
          </div>
        </div>
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
