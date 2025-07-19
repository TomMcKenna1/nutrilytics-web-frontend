import { Outlet } from 'react-router-dom';
import TopBar from '../common/TopBar';

const MainLayout = () => {
  return (
    <div>
      <TopBar />
      <main style={{ padding: '2rem' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;