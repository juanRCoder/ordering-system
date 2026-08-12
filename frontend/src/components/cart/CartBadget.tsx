import { ShoppingBag } from 'lucide-react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useCartStore } from '@/stores/cart.store';

export const CartBadget = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const whatsappNumber = searchParams.get('wa');
  const { totalSupplies } = useCartStore();

  return (
    <Link
      to={`/${slug}/cart?${whatsappNumber ? `wa=${whatsappNumber}` : ''}`}
      className="relative flex items-center justify-center w-10 h-10 rounded-xl active:scale-90 transition-transform duration-100"
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.12)' }}
    >
      <ShoppingBag className="w-5 h-5 text-white" />
      {totalSupplies > 0 && (
        <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 flex items-center justify-center text-[10px] font-bold text-white rounded-full px-1 bg-[#FF6B35] shadow-[0_2px_6px_rgba(255,107,53,0.4)]">
          {totalSupplies}
        </span>
      )}
    </Link>
  );
};
