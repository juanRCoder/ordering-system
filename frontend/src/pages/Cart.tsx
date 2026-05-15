import { TopAppBar } from '@/components/TopAppBar';
import { CartItem } from '@/components/cart/CartItem';
import { Card } from '@/components/ui/card';
import { InputField } from '@/components/InputField';
import { Button } from '@/components/ui/button';
import { BottomAppBar } from '@/components/BottomAppBar';
import { useCartStore } from '@/stores/cart.store';
import { CartBadget } from '@/components/cart/CartBadget';
import { ShoppingBag } from 'lucide-react';

function Cart() {
  const { items } = useCartStore();

  const total = items
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <section className="bg-[#F8F9FF] min-h-screen flex flex-col">
      <TopAppBar leftArrowEnable leftPath="/menu" itemHeader={<CartBadget />} />
      <div className="flex-1 flex flex-col p-5 pb-24">
        <h2 className="text-[32px] font-bold text-primary tracking-tighter">
          Resumen del Pedido
        </h2>
        <p className="text-muted-foreground">
          Revisa los detalles antes de continuar
        </p>
        <div className="flex flex-wrap gap-2 items-center justify-between mt-8">
          <p className="text-[#161D17] font-semibold text-xl tracking-tight">
            Tus Insumos
          </p>
          <span className="text-xs tracking-wide font-semibold text-muted-foreground bg-[#D8E9FF] px-4 py-2 rounded-lg">
            {totalQuantity} cantidades
          </span>
        </div>
        {items.length > 1 ? (
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
        <form>
          <Card className="px-0 pb-0 pt-4 flex flex-col gap-2 mt-6">
            <h2 className="text-xl font-semibold text-[#161D17] pl-4">
              Observaciones
            </h2>
            <textarea
              placeholder="Escribe aquí tus observaciones"
              className="text-sm w-full h-24 rounded-bl-lg rounded-br-lg p-4 outline-none resize-none border-none bg-[#F8F9FA] text-[#6B7280]"
            />
          </Card>
          <Card className="px-0 pb-0 pt-4 flex flex-col gap-2 mt-6 p-4">
            <h2 className="text-xl font-semibold text-[#161D17] pb-1">
              Detalles del Cliente
            </h2>
            <InputField
              label="Nombre y Apellido"
              placeholder="Ingrese su nombre y apellido"
            />
          </Card>
          <div className="flex justify-between items-center p-6 rounded-2xl bg-[#E8F0E5] mt-6">
            <p className="text-[#161D17] font-semibold text-xl">Total</p>
            <p className="text-primary text-2xl font-bold">$ {total}</p>
          </div>
          <Button
            className="w-full mt-6 h-16 rounded-xl font-semibold text-lg cursor-pointer"
            disabled={items.length === 0}
          >
            Realizar Pedido
          </Button>
        </form>
      </div>
      <div className="fixed w-full max-w-md mx-auto bottom-0">
        <BottomAppBar />
      </div>
    </section>
  );
}

export default Cart;
