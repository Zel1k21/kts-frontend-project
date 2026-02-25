import { Navbar } from 'components/Navbar';
import { Outlet } from 'react-router';
import './App.scss';

function App() {
  return (
    <div>
      <Navbar />
      <div className="app">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
