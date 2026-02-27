import ProductPage from 'pages/ProductPage/ProductPage';
import { ProductsPage } from 'pages/ProductsPage/ProductsPage';
import { Route, Navigate } from 'react-router-dom';

import App from '../App';

export const routes = {
  main: {
    mask: '/',
    create: () => '/',
  },
  products: {
    mask: '/products',
    create: () => '/products',
  },
  product: {
    mask: '/products/:id',
    create: (id: string) => `/products/${id}`,
  },
};

export const routesConfig = (
  <>
    <Route path={routes.main.mask} element={<App />}>
      <Route index element={<Navigate to={routes.products.mask} replace />} />

      <Route path={routes.products.mask} element={<ProductsPage />} />

      <Route path={routes.product.mask} element={<ProductPage />} />
    </Route>

    <Route path="*" element={<Navigate to={routes.main.mask} replace />} />
  </>
);

export default routes;
