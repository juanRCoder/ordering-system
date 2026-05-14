import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { TopAppBar } from '@/components/TopAppBar';
import { CartItem } from '@/components/cart/CartItem';
import { Card } from '@/components/ui/card';
import { InputField } from '@/components/InputField';
import { Button } from '@/components/ui/button';
import { BottomAppBar } from '@/components/BottomAppBar';

function Cart() {
  return (
    <section className="bg-[#F8F9FF] min-h-screen flex flex-col">
      <TopAppBar
        leftArrowEnable
        leftPath="/menu"
        itemHeader={
          <Link to="/cart">
            <div className="relative cursor-pointer">
              <ShoppingBag className="h-6 w-6 text-primary" />
              <span className="absolute -top-2.5 -right-2.5 text-xs text-white bg-primary rounded-full w-6 h-6 grid place-items-center">
                0
              </span>
            </div>
          </Link>
        }
      />
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
            2 insumos
          </span>
        </div>
        <div className="flex flex-col gap-4 mt-4">
          <CartItem />
          <CartItem />
        </div>
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
            <p className="text-primary text-2xl font-bold">$40.00</p>
          </div>
          <Button className="w-full mt-6 h-16 rounded-xl font-semibold text-lg cursor-pointer">
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
