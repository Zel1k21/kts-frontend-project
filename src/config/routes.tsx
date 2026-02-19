import { type RouteObject, Navigate } from 'react-router';
import App from '../App';
import { ProductsPage } from '../pages/Product';
// import { Product } from 'pages/Product';

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
    mask: '/product/:id',
    create: (id: string) => `/product/${id}`,
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
      // {
      //   path: routes.product.mask,
      //   element: <Product />,
      // },
    ],
  },
  {
    path: '*',
    element: <Navigate to={routes.main.mask} replace />,
  },
];

export default routes;
