import { Navbar } from 'components/Navbar';
import { Outlet } from 'react-router';
import { StoreProvider } from 'shared/hooks/StoreContext';

import styles from './App.module.scss';

function App() {
  return (
    <div>
      <StoreProvider>
        <Navbar />
        <div className={styles.app}>
          <Outlet />
        </div>
      </StoreProvider>
    </div>
  );
}

export default App;
