import { Link } from 'react-router-dom';

function OrderReceived() {
  return (
    <section className="bg-[#F8F9FF] min-h-screen flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Pedido Confirmado</h1>
        <p className="text-xl mb-8">
          ¡Gracias por tu pedido! Te notificaremos cuando esté listo.
        </p>
        <Link to="/">
          <button className="bg-primary text-white px-6 py-3 rounded-lg font-bold">
            Volver al menú
          </button>
        </Link>
      </div>
    </section>
  );
}

export default OrderReceived;
