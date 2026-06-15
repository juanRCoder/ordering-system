import { Minus, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useCartStore, type CartItemType } from '@/stores/cart.store';

interface props {
  item: CartItemType;
}

export const CartItem = ({ item }: props) => {
  const { incrementQuantity, decrementQuantity, removeItem, setObservations } =
    useCartStore();

  const handleRemoveItem = (item: CartItemType) => {
    if (item.quantity > 1) decrementQuantity(item.id);
    else removeItem(item.id);
  };

  return (
    <Card className="p-2 w-full rounded-sm">
      <CardContent className="flex flex-wrap items-start gap-4 p-0">
        <div className="shrink-0 w-20 h-20 rounded-sm overflow-hidden">
          <img
            src="./insumo.jpg"
            alt="insumo"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-between gap-2 flex-1 self-stretch">
          <div className="flex flex-col">
            <p className="text-[15px] font-semibold text-card-foreground leading-tight">
              {item.name}
            </p>
            <p className="text-xs text-muted-foreground leading-tight line-clamp-2">
              {item.description || ''}
            </p>
          </div>
          <div className="flex justify-between items-center flex-wrap gap-2">
            <span className="whitespace-nowrap font-bold text-primary text-[15px]">
              S/ {(item.price * item.quantity).toFixed(2)}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleRemoveItem(item)}
                className="w-8 h-8 rounded-full cursor-pointer border border-border font-semibold flex items-center justify-center"
              >
                <Minus className="text-[#151C23] w-5 h-5" />
              </button>
              <span className="text-sm font-medium text-gray-800 w-4 text-center">
                {item.quantity}
              </span>
              <button
                onClick={() => incrementQuantity(item.id)}
                className="w-8 h-8 rounded-full cursor-pointer border border-border bg-[#254875] font-semibold flex items-center justify-center"
              >
                <Plus className="text-card w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        <div className="w-full border-t border-border pt-2">
          <textarea
            onChange={(e) => setObservations(item.id, e.target.value)}
            placeholder="Algun detalle..."
            className="w-full border-none outline-none text-xs text-[#737780]"
          />
        </div>
      </CardContent>
    </Card>
  );
};
