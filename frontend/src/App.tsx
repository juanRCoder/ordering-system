import { Link } from 'react-router-dom';

function App() {
  return (
    <div className="bg-white">
      <p className="text-xl font-bold underline">HOLA MUNDO</p>
      <Link to="/auth" className="block">
        Auth
      </Link>
      <Link to="/menu" className="block">
        Menu
      </Link>
      <Link to="/cart" className="block">
        Cart
      </Link>
      <Link to="/order-received" className="block">
        Order Received
      </Link>
      {/* Admin routes */}
      <hr className="my-4 border" />
      <Link to="/admin/dashboard" className="block">
        Admin Dashboard
      </Link>
    </div>
  );
}

export default App;
