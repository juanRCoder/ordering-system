import { Card } from '@/components/ui/card';
import type { SupplyResponse } from '@/interfaces/supplies.interface';
import { useCartStore } from '@/stores/cart.store';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

type props = {
  data: SupplyResponse;
};

export const SupplyCard = ({ data }: props) => {
  const { addItem } = useCartStore();

  return (
    <Card className="relative w-full rounded-sm overflow-hidden p-0 gap-0 shadow-sm border border-border">
      <div className="relative w-full">
        <img
          src={data.imagen_url || '/no_image.webp'}
          alt={data.name || 'img'}
          className="object-cover w-full aspect-video"
        />
        <Button
          onClick={() => addItem(data)}
          className="absolute bottom-2 right-2 w-11 h-11 rounded-sm cursor-pointer border border-border"
          aria-label={`Agregar ${data.name} al carrito`}
        >
          <Plus className="text-white w-7! h-7!" strokeWidth={2} />
        </Button>
      </div>
      <div className="p-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-[18px] text-foreground leading-snug">
            {data.name}
          </h3>
          <span className="font-normal text-[18px] text-foreground whitespace-nowrap">
            S/ {data.price.toFixed(2)}
          </span>
        </div>

        {data.description && (
          <p className="mt-1 text-xs text-muted-foreground leading-snug">
            {data.description}
          </p>
        )}
      </div>
    </Card>
  );
};
