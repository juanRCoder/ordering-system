import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <section className="max-w-md mx-auto min-h-screen outline bg-white">
      <RouterProvider router={router} />
    </section>
  </StrictMode>
);
