import { Link, useParams } from 'react-router-dom';
import { useCartStore } from '@/stores/cart.store';
import { TopAppBar } from '@/components/TopAppBar';
import { Check } from 'lucide-react';

function OrderReceived() {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <section className="bg-[#F8F9FF] min-h-screen flex flex-col">
      <TopAppBar leftArrowEnable leftPath="/menu" />
      <div className="flex flex-col justify-center items-center flex-1 gap-10">
        <div className="relative flex items-center justify-center">
          <div className="relative flex items-center justify-center rounded-full shadow-xl/30 shadow-primary w-32 h-32">
            <div className="flex items-center justify-center rounded-full bg-primary h-16 w-16">
              <Check color="white" size={36} strokeWidth={3} />
            </div>
          </div>
        </div>
        <div className="text-center w-full p-5 flex flex-col gap-4">
          <h1 className="text-xl font-bold text-primary">¡Pedido Recibido!</h1>
          <p className="text-base text-[#42474F]">
            Tu pedido{' '}
            <span className="text-[#0B1C30] font-bold">
              #{orderId?.slice(0, 6) || 'ERROR'}
            </span>{' '}
            ha sido agendado para su preparacion por nuestro equipo de cocina.
          </p>
          <Link to="/menu" onClick={useCartStore.getState().clear}>
            <button className="bg-primary text-white px-6 py-3 rounded-sm w-full mt-6 cursor-pointer">
              Regresar al Menú
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default OrderReceived;
