import { Link } from 'react-router-dom';

function App() {
  const slug = 'pizzeria-ramirez';

  return (
    <div className="bg-white">
      <p className="text-xl font-bold underline">HOLA MUNDO</p>
      <Link to="/auth" className="block">
        Auth
      </Link>
      <Link to={`${slug}/menu`} className="block">
        Menu
      </Link>
      <Link to={`${slug}/cart`} className="block">
        Cart
      </Link>
      <Link to={`${slug}/order-received`} className="block">
        Order Received
      </Link>
      <Link to={`${slug}/settings`} className="block">
        Settings
      </Link>
      {/* Admin routes */}
      <hr className="my-4 border" />
      <Link to="/admin/orders" className="block">
        Admin Orders
      </Link>
      <Link to="/admin/supplies" className="block">
        Admin Supplies
      </Link>
    </div>
  );
}

export default App;
