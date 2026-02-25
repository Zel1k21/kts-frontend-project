import ProductPage from 'pages/Product/ProductPage';
import { ProductsPage } from 'pages/Product/ProductsPage';
import { type RouteObject, Navigate } from 'react-router';

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

export const routesConfig: RouteObject[] = [
  {
    path: routes.main.mask,
    element: <App />,
    children: [
      {
        path: routes.products.mask,
        element: <ProductsPage />,
      },
      {
        path: routes.product.mask,
        element: <ProductPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to={routes.main.mask} replace />,
  },
];

export default routes;
