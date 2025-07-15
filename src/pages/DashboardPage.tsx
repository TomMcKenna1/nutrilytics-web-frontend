import { useAuth } from '../providers/AuthProvider';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1>Nutrilytics Dashboard</h1>
      <p>Welcome, {user?.email}! This page is protected.</p>
      {/* Placeholder */}
    </div>
  );
};

export default DashboardPage;