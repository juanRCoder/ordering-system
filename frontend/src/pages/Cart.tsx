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
import type { NewOrderType } from '@/interfaces/orders.interface';
import { defaultNewOrder } from '@/lib/default';

function Cart() {
  const { items, totalPrice } = useCartStore();
  const newOrder = useCreateOrder();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewOrderType>({
    resolver: zodResolver(newOrderSchema),
    defaultValues: defaultNewOrder,
  });

  const onSubmit = (data: NewOrderType) => {
    newOrder.mutate({
      ...data,
      total: totalPrice,
      supplies: items.map((item) => ({
        id: item.id,
        price: item.price,
        quantity: item.quantity,
        observations: item.observations,
      })),
    });
  };

  return (
    <section className="bg-[#F8F9FF] min-h-screen flex flex-col">
      <TopAppBar leftArrowEnable leftPath="/menu" itemHeader={<CartBadget />} />
      <div className="flex-1 flex flex-col p-3 pb-24">
        <h2 className="text-2xl font-bold text-primary tracking-tighter">
          Resumen del Pedido
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
          <div className="flex flex-col gap-4 mt-4">
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-4">
            <InputField
              label="Nombre del cliente"
              icon={User}
              placeholder="Ej: Alejo Diaz"
              {...register('guest_name')}
              error={errors.guest_name?.message}
            />
          </div>
          <div className="flex justify-between flex-wrap gap-2 items-center p-4 rounded-sm bg-[#EFF4FF] mt-6 text-base">
            <p className="text-[#161D17] font-semibold">Total a pagar</p>
            <p className="text-primary font-bold">S/ {totalPrice.toFixed(2)}</p>
          </div>
          <Button
            className="w-full mt-4 h-12 rounded-sm font-semibold text-base cursor-pointer"
            disabled={items.length === 0 || newOrder.isPending}
            type="submit"
          >
            {newOrder.isPending ? 'Creando pedido...' : 'Solicitar Pedido'}
          </Button>
        </form>
      </div>
      <div className="fixed w-full max-w-[330px] mx-auto bottom-0">
        <BottomAppBar />
      </div>
    </section>
  );
}

export default Cart;
