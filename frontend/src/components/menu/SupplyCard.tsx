import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { SupplyResponse } from '@/interfaces/supplies.interface';
import { useCartStore } from '@/stores/cart.store';

type props = {
  data: SupplyResponse;
};

export const SupplyCard = ({ data }: props) => {
  const { addItem } = useCartStore();

  return (
    <Card className="relative w-full pt-0 rounded-[12px] gap-0 p-0">
      {data?.imagen_url && (
        <img
          src={data.imagen_url}
          alt="insumo"
          className="relative z-20 object-cover w-full aspect-video"
        />
      )}
      <CardHeader className="p-4 m-0">
        <CardTitle className="font-semibold text-card-foreground">
          {data.name}
        </CardTitle>
      </CardHeader>
      <CardFooter className="px-4 pb-4 flex justify-between">
        <p className="font-bold text-xl text-primary">
          S/ {data.price.toFixed(2)}
        </p>

        <Button
          onClick={() => addItem(data)}
          className="w-32 bg-[#254875] cursor-pointer font-semibold"
        >
          AGREGAR
        </Button>
      </CardFooter>
    </Card>
  );
};
