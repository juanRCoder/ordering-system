import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '@/stores/cart.store';

export const CartBadget = () => {
  const { items } = useCartStore();

  return (
    <Link to="/cart">
      <div className="relative cursor-pointer">
        <ShoppingBag className="h-6 w-6 text-primary" />
        {items.length > 0 && (
          <span className="absolute -top-2.5 -right-2.5 text-xs text-white bg-primary rounded-full w-6 h-6 grid place-items-center">
            {items.length}
          </span>
        )}
      </div>
    </Link>
  );
};
