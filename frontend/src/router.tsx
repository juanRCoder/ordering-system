import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const App = lazy(() => import('./App.tsx'));
const Auth = lazy(() => import('./pages/Auth.tsx'));
const Menu = lazy(() => import('./pages/Menu.tsx'));
const Cart = lazy(() => import('./pages/Cart.tsx'));
const Setting = lazy(() => import('./pages/Settings.tsx'));
const Orders = lazy(() => import('./pages/admin/Orders.tsx'));
const Supplies = lazy(() => import('./pages/admin/Supplies.tsx'));
const OrderReceived = lazy(() => import('./pages/OrderReceived.tsx'));

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
  {
    path: ':slug',
    children: [
      { index: true, element: <Navigate to="menu" replace /> },
      { path: 'menu', element: <Menu /> },
      { path: 'cart', element: <Cart /> },
      { path: 'order-received/:orderId', element: <OrderReceived /> },
      { path: 'settings', element: <Setting /> },
    ],
  },
  {
    path: '/admin',
    children: [
      { index: true, element: <Navigate to="orders" replace /> },
      { path: 'orders', element: <Orders /> },
      { path: 'supplies', element: <Supplies /> },
      { path: 'settings', element: <Setting isAdmin /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
