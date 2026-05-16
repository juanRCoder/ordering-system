import { Link, useParams } from 'react-router-dom';
import { useCartStore } from '@/stores/cart.store';

function OrderReceived() {
  const { orderId } = useParams();
  const { clear } = useCartStore();

  const handleNewOrder = () => {
    clear();
  };

  return (
    <section className="bg-[#F8F9FF] min-h-screen flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">¡Pedido Recibido!</h1>
        <p className="text-xl mb-8">
          Tu pedido #{orderId.slice(0, 6)} ha sido agendado para su preparacion
          por nuestro equipo de cocina.
        </p>
        <Link to="/menu" onClick={handleNewOrder}>
          <button className="bg-primary text-white px-6 py-3 rounded-lg font-bold">
            Volver al menú
          </button>
        </Link>
      </div>
    </section>
  );
}

export default OrderReceived;
