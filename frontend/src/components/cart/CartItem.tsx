import { Minus, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useCartStore, type CartItemType } from '@/stores/cart.store';

interface props {
  item: CartItemType;
}

export const CartItem = ({ item }: props) => {
  const { incrementQuantity, decrementQuantity, removeItem } = useCartStore();

  const handleRemoveItem = (item: CartItemType) => {
    if (item.quantity > 1) decrementQuantity(item.id);
    else removeItem(item.id);
  };

  return (
    <Card className="py-3 w-full rounded-[12px]">
      <CardContent className="flex flex-wrap items-center gap-4 px-4 py-0">
        {/* <div className="shrink-0 w-20 h-20 rounded-[8px] overflow-hidden">
          <img
            src="./insumo.jpg"
            alt="insumo"
            className="w-full h-full object-cover"
          />
        </div> */}
        <div className="flex flex-col justify-between gap-2 flex-1 self-stretch">
          <div className="flex items-start justify-between gap-1">
            <p className="text-[15px] font-semibold text-card-foreground leading-tight">
              {item.name}
            </p>
            <span className="whitespace-nowrap text-end font-bold text-primary">
              S/ {(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleRemoveItem(item)}
              className="w-8 h-8 rounded-full cursor-pointer bg-[#D8E9FF] font-semibold flex items-center justify-center"
            >
              <Minus className="text-[#151C23] w-5 h-5" />
            </button>
            <span className="text-sm font-medium text-gray-800 w-4 text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => incrementQuantity(item.id)}
              className="w-8 h-8 rounded-full cursor-pointer bg-[#254875] font-semibold flex items-center justify-center"
            >
              <Plus className="text-card w-5 h-5" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
