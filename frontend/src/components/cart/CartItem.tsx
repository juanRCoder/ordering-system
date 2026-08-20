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
    <Card className="p-3 w-full rounded-lg border border-[#E2E8F0] bg-white shadow-sm">
      <CardContent className="flex flex-wrap items-start gap-3 p-0">
        <div className="shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-[#F1F5F9]">
          <img
            src={item.image_url || '/no_image.webp'}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-between gap-2 flex-1 self-stretch">
          <div className="flex flex-col">
            <p className="text-[15px] font-semibold text-[#0F2A4A] leading-tight">
              {item.name}
            </p>
          </div>
          <div className="flex justify-between items-center flex-wrap gap-2">
            <span className="whitespace-nowrap font-bold text-[#0F2A4A] text-[15px]">
              S/ {(item.price * item.quantity).toFixed(2)}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleRemoveItem(item)}
                className="w-8 h-8 rounded-full cursor-pointer border border-[#CBD5E1] font-semibold flex items-center justify-center hover:bg-[#F1F5F9] transition-colors"
              >
                <Minus className="text-[#475569] w-4 h-4" />
              </button>
              <span className="text-sm font-semibold text-[#0F2A4A] w-5 text-center">
                {item.quantity}
              </span>
              <button
                onClick={() => incrementQuantity(item.id)}
                className="w-8 h-8 rounded-full cursor-pointer border-none bg-[#0F2A4A] font-semibold flex items-center justify-center hover:bg-[#1E3A5F] transition-colors"
              >
                <Plus className="text-white w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
