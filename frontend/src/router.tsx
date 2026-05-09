import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const App = lazy(() => import('./App.tsx'));
const Auth = lazy(() => import('./pages/Auth.tsx'));
const Menu = lazy(() => import('./pages/Menu.tsx'));

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
]);
