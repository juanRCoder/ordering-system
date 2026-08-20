import type { SupplyResponse } from '@/interfaces/supplies.interface';
import { useCartStore } from '@/stores/cart.store';
import { Plus, Check } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

export const SupplyCard = ({ data }: { data: SupplyResponse }) => {
  const addItem = useCartStore((s) => s.addItem);
  const [isAdded, setIsAdded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleAdd = useCallback(() => {
    addItem(data);
    setIsAdded(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIsAdded(false), 1000);
  }, [addItem, data]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div
      className="rounded-lg relative w-full overflow-hidden cursor-pointer active:scale-[0.97] transition-transform duration-150 "
      onClick={handleAdd}
    >
      {/* Immersive Image */}
      <div className="relative w-full overflow-hidden aspect-3/4 bg-linear-to-br from-[#E0E7FF] to-[#F1F5F9]">
        <img
          src={data.image_url || '/no_image.webp'}
          alt={data.name || 'img'}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Bottom Gradient Scrim */}
        <div className="h-[70%] absolute inset-x-0 bottom-0 bg-linear-to-t from-[rgba(15,42,74,0.42)] via-[rgba(15,42,74,0.44)] to-transparent" />

        {/* Circular Add Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAdd();
          }}
          className="absolute top-2.5 right-2.5 w-8 h-8 flex items-center justify-center active:scale-90 transition-transform duration-150 cursor-pointer border-none outline-none"
          style={{
            backgroundColor: isAdded
              ? 'rgba(16, 185, 129, 0.95)'
              : 'rgba(255, 255, 255, 0.95)',
            borderRadius: '50%',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
          }}
          aria-label={`Agregar ${data.name} al carrito`}
        >
          {isAdded ? (
            <Check className="w-4 h-4 text-white" strokeWidth={3} />
          ) : (
            <Plus className="w-4 h-4 text-[#0F2A4A]" strokeWidth={3} />
          )}
        </button>

        {/* Overlaid Name + Price */}
        <div className="absolute inset-x-0 bottom-0 p-2.5">
          <h3 className="font-semibold text-sm leading-snug line-clamp-2 text-white drop-shadow-sm">
            {data.name}
          </h3>
          <span className="font-bold text-base text-white mt-0.5 block drop-shadow-sm">
            S/ {data.price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};
