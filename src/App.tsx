import { Navbar } from 'components/Navbar';
import { Outlet } from 'react-router';

import styles from './App.module.scss';

function App() {
  return (
    <div>
      <Navbar />
      <div className={styles.app}>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
