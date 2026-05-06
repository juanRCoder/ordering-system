import { Link } from 'react-router-dom';

function App() {
  return (
    <>
      <p className="text-xl font-bold underline">HOLA MUNDO</p>
      <Link to="/auth">Auth</Link>
    </>
  );
}

export default App;
