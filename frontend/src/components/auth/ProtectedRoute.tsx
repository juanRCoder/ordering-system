import { Navigate, Outlet } from 'react-router-dom';
import { useBusinessStore } from '@/stores/business.store';

// Solo admin autenticado (negocio en store). Las rutas públicas
// (menu, cart, order-received) quedan fuera de este guard.
export function ProtectedRoute() {
  const slug = useBusinessStore((s) => s.slug);

  if (!slug?.trim()) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
}
