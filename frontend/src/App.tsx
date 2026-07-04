import { Link } from 'react-router-dom';
import { useBusinessStore } from './stores/business.store';

function App() {
  const slugDefault = 'pizzeria-ramirez';
  const { business_name } = useBusinessStore();

  return (
    <div className="bg-white">
      <p className="text-xl font-bold underline">HOLA MUNDO</p>
      <Link to="/auth" className="block">
        Auth
      </Link>
      <Link to={`${slugDefault || business_name}/menu`} className="block">
        Menu
      </Link>
      <Link to={`${slugDefault || business_name}/cart`} className="block">
        Cart
      </Link>
      <Link
        to={`${slugDefault || business_name}/order-received`}
        className="block"
      >
        Order Received
      </Link>
      <Link to={`${slugDefault || business_name}/settings`} className="block">
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
