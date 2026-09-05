import { TopAppBar } from '@/components/TopAppBar';
import { CartItem } from '@/components/cart/CartItem';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cart.store';
import { CartBadget } from '@/components/cart/CartBadget';
import { GuestSelector } from '@/components/cart/GuestSelector';
import { ShoppingBag } from 'lucide-react';
import { useCreateOrder } from '@/hooks/useOrders';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { newOrderSchema } from '@/schemas/orders.schema';
import type {
  CreateOrderPayload,
  NewOrderType,
} from '@/interfaces/orders.interface';
import { defaultNewOrder } from '@/lib/default';
import { useNavigate, useParams } from 'react-router-dom';
import { useBusinessStore } from '@/stores/business.store';
import { DM_SANS_STYLE, DEFAULT_SLUG } from '@/lib/constants';
import { useEffect, useState } from 'react';

function Cart() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const resolvedSlug =
    slug?.trim() && slug !== 'null' && slug !== 'undefined'
      ? slug
      : DEFAULT_SLUG;
  const { items, totalPrice, ensureSlug } = useCartStore();
  const order_id = useBusinessStore((s) => s.order_id);
  const guest_name = useBusinessStore((s) => s.guest_name);
  const createOrder = useCreateOrder(resolvedSlug);
  const [isTakeaway, setIsTakeaway] = useState(false);
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<NewOrderType>({
    resolver: zodResolver(newOrderSchema),
    defaultValues: defaultNewOrder,
  });

  const guestNameValue = watch('guest_name');

  useEffect(() => {
    ensureSlug(resolvedSlug);
  }, [resolvedSlug, ensureSlug]);

  useEffect(() => {
    if (!order_id || !guest_name) return;

    setValue('order_id', order_id);
    setValue('guest_name', guest_name);
  }, [order_id, guest_name, setValue]);

  const onSubmit = (data: NewOrderType) => {
    const payload: CreateOrderPayload = {
      guest_name: data.guest_name,
      total: totalPrice,
      supplies: items.map((item) => ({
        id: item.id,
        price: item.price,
        quantity: item.quantity,
      })),
      order_id: data.order_id ?? null,
      order_type: isTakeaway ? 'TAKEAWAY' : 'LOCAL',
    };

    createOrder.mutate(payload, {
      onSuccess: (response) => {
        if (order_id) return;
        useCartStore.getState().clear();
        navigate(`/${resolvedSlug}/order-received/${response.data.order_id}`);
      },
    });
  };

  const buttonText = () => {
    if (order_id) {
      return createOrder.isPending ? 'Agregando...' : 'Agregar al pedido';
    }
    return createOrder.isPending ? 'Creando pedido...' : 'Solicitar Pedido';
  };

  return (
    <section className="bg-[#F1F5F9] min-h-screen flex flex-col">
      <TopAppBar
        leftArrowEnable
        leftPath={`/${resolvedSlug}/menu`}
        itemHeader={<CartBadget />}
      />
      <div className="flex-1 flex flex-col p-3">
        <h2
          className="text-2xl font-bold text-[#0F2A4A] tracking-tighter"
          style={DM_SANS_STYLE}
        >
          {order_id ? 'Agregar al pedido' : 'Resumen del Pedido'}
        </h2>
        <p className="text-sm text-[#64748B]">
          Revisa los detalles antes de continuar
        </p>
        <div className="flex flex-wrap gap-2 items-center justify-between mt-4">
          <p className="text-[#0F2A4A] font-semibold text-xl tracking-tight">
            Tus Insumos
          </p>
        </div>
        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 mt-4">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <CartItem item={item} />
              </div>
            ))}
          </div>
        ) : (
          <div className="h-50 w-full flex flex-col items-center justify-center gap-3">
            <div className="flex h-20 w-20 items-center justify-center bg-[#E0E7FF] rounded-[20px]">
              <ShoppingBag className="h-10 w-10 text-[#3B5BDB]" />
            </div>
            <p className="text-sm font-semibold text-[#94A3B8]">
              No hay insumos
            </p>
          </div>
        )}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-lg w-full mx-auto"
        >
          <div className="mt-4">
            {order_id ? (
              <div>
                <label className="block text-[#43474F] font-semibold text-sm">
                  Nombre del cliente o Mesa
                </label>
                <span className="text-[#0F2A4A]">{guest_name}</span>
              </div>
            ) : (
              <GuestSelector
                value={guestNameValue ?? ''}
                onChange={(v) => setValue('guest_name', v)}
                onTakeawayChange={setIsTakeaway}
                error={errors.guest_name?.message}
              />
            )}
          </div>
          <div className="flex justify-between flex-wrap gap-2 items-center p-4 rounded-sm bg-[#E0E7FF] mt-6 text-base">
            <p className="text-[#0F2A4A] font-semibold">
              {order_id ? 'Monto adicional' : 'Monto Total'}
            </p>
            <p className="text-[#0F2A4A] font-bold">
              S/ {totalPrice.toFixed(2)}
            </p>
          </div>
          <Button
            className="w-full mt-4 h-12 rounded-sm font-semibold text-base cursor-pointer bg-[#0F2A4A] hover:bg-[#1E3A5F] text-white"
            disabled={
              items.length === 0 ||
              createOrder.isPending ||
              !guestNameValue?.trim()
            }
            type="submit"
          >
            {buttonText()}
          </Button>
        </form>
      </div>
    </section>
  );
}

export default Cart;
