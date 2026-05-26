import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { SupplyResponse } from '@/interfaces/supplies.interface';
import type { TypeSupplyResponse } from '@/interfaces/typesSupplies.interface';
import { useCartStore } from '@/stores/cart.store';
import { Plus } from 'lucide-react';

type props = {
  supplyType: TypeSupplyResponse | null;
  data: SupplyResponse;
};

export const SupplyCard = ({ supplyType, data }: props) => {
  const { addItem } = useCartStore();

  if (!supplyType) return null;
  const onlyDishes = supplyType.layout !== 'HALF';

  return (
    <Card className="relative w-full pt-0 rounded-[12px] gap-0 p-0">
      {data?.imagen_url && (
        <img
          src={data.imagen_url}
          alt="insumo"
          className={`relative z-20 object-cover
          ${
            onlyDishes
              ? 'w-full aspect-video'
              : 'w-32 h-32 mx-auto mt-4 object-contain'
          }`}
        />
      )}
      <CardHeader className="p-4 m-0">
        <CardTitle
          className={`${onlyDishes && 'text-xl'} font-semibold text-card-foreground`}
        >
          {data.name}
        </CardTitle>
        {onlyDishes && <CardDescription>{data.description}</CardDescription>}
      </CardHeader>
      <CardFooter className="px-4 pb-4 flex justify-between">
        <p className="font-bold text-xl text-primary">
          S/ {data.price.toFixed(2)}
        </p>
        {onlyDishes ? (
          <Button
            onClick={() => addItem(data)}
            className="w-32 bg-[#254875] cursor-pointer font-semibold"
          >
            AGREGAR
          </Button>
        ) : (
          <button
            onClick={() => addItem(data)}
            className="w-10 h-10 rounded-full cursor-pointer bg-[#254875] font-semibold flex items-center justify-center"
          >
            <Plus className="text-card w-7 h-7" />
          </button>
        )}
      </CardFooter>
    </Card>
  );
};
