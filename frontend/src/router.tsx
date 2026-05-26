import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import OrderReceived from './pages/OrderReceived.tsx';

const App = lazy(() => import('./App.tsx'));
const Auth = lazy(() => import('./pages/Auth.tsx'));
const Menu = lazy(() => import('./pages/Menu.tsx'));
const Cart = lazy(() => import('./pages/Cart.tsx'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.tsx'));
const AdminSupplySetup = lazy(
  () => import('./pages/admin/AdminSupplySetup.tsx')
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <App />
      </Suspense>
    ),
  },
  { path: '/auth', element: <Auth /> },
  { path: '/menu', element: <Menu /> },
  { path: '/cart', element: <Cart /> },
  { path: '/order-received/:orderId', element: <OrderReceived /> },
  // Admin routes
  {
    path: '/admin',
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'supply-setup', element: <AdminSupplySetup /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
