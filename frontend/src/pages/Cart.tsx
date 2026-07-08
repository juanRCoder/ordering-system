import { TopAppBar } from '@/components/TopAppBar';
import { CartItem } from '@/components/cart/CartItem';
import { InputField } from '@/components/InputField';
import { Button } from '@/components/ui/button';
import { BottomAppBar } from '@/components/BottomAppBar';
import { useCartStore } from '@/stores/cart.store';
import { CartBadget } from '@/components/cart/CartBadget';
import { ShoppingBag, User } from 'lucide-react';
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
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toastStyles } from '@/lib/toast';
import { toast } from 'sonner';

function Cart() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const whatsappNumber = searchParams.get('wa');
  const { items, totalPrice } = useCartStore();
  const { order_id, guest_name } = useBusinessStore();
  const createOrder = useCreateOrder(slug!);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<NewOrderType>({
    resolver: zodResolver(newOrderSchema),
    defaultValues: defaultNewOrder,
  });

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
        observations: item.observations,
      })),
      order_id: data.order_id ?? null,
    };

    createOrder.mutate(payload, {
      onSuccess: (response) => {
        console.log({
          whatsappNumber,
          order_id,
        });

        if (whatsappNumber) {
          window.location.href = `https://wa.me/${whatsappNumber}?text=Hola%2C%20quisiera%20hacer%20un%20pedido`;
        } else {
          toast.success('Pedido creado con éxito', toastStyles.success);
          navigate(`/${slug}/order-received/${response.data.order_id}`);
        }
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
    <section className="bg-[#F8F9FF] min-h-screen flex flex-col">
      <TopAppBar
        leftArrowEnable
        leftPath={`/${slug}/menu`}
        itemHeader={<CartBadget />}
      />
      <div className="flex-1 flex flex-col p-3 pb-24">
        <h2 className="text-2xl font-bold text-primary tracking-tighter">
          {order_id ? 'Agregar al pedido' : 'Resumen del Pedido'}
        </h2>
        <p className="text-sm text-muted-foreground">
          Revisa los detalles antes de continuar
        </p>
        <div className="flex flex-wrap gap-2 items-center justify-between mt-4">
          <p className="text-[#161D17] font-semibold text-xl tracking-tight">
            Tus Insumos
          </p>
        </div>
        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 mt-4">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="h-[200px] w-full flex flex-col items-center justify-center gap-2">
            <ShoppingBag className="w-12 h-12 text-primary/70" />
            <p className="text-border">No hay items</p>
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
                  Nombre del cliente o Nr de mesa
                </label>
                <span className="text-[#161D17]">{guest_name}</span>
              </div>
            ) : (
              <InputField
                label="Nombre del cliente o Nr de mesa"
                icon={User}
                placeholder="Ej: Alejo Diaz o Mesa 5"
                {...register('guest_name')}
                error={errors.guest_name?.message}
              />
            )}
          </div>
          <div className="flex justify-between flex-wrap gap-2 items-center p-4 rounded-sm bg-[#EFF4FF] mt-6 text-base">
            <p className="text-[#161D17] font-semibold">
              {order_id ? 'Monto adicional' : 'Monto Total'}
            </p>
            <p className="text-primary font-bold">S/ {totalPrice.toFixed(2)}</p>
          </div>
          <Button
            className="w-full mt-4 h-12 rounded-sm font-semibold text-base cursor-pointer"
            disabled={items.length === 0 || createOrder.isPending}
            type="submit"
          >
            {buttonText()}
          </Button>
        </form>
      </div>
      <div className="fixed w-full mx-auto bottom-0">
        <BottomAppBar />
      </div>
    </section>
  );
}

export default Cart;
