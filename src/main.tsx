import { routesConfig } from 'config/routes';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes } from 'react-router-dom';
import { StoreProvider } from 'shared/hooks/StoreContext';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLDivElement);

root.render(
  <BrowserRouter>
    <QueryParamProvider adapter={ReactRouter6Adapter}>
      <StoreProvider>
        <Routes>{routesConfig}</Routes>
      </StoreProvider>
    </QueryParamProvider>
  </BrowserRouter>
);
