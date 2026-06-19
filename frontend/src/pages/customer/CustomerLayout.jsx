import { Outlet } from 'react-router-dom';
import CustomerSidebar from '../../components/dashboard/CustomerSidebar';
import './CustomerLayout.css';

/* Mock user — replace with useSelector(selectCurrentUser) */
const MOCK_USER = {
  fullName: 'Sophie Laurent',
  email: 'sophie@example.com',
  avatar: null,
};

export default function CustomerLayout() {
  return (
    <div className="customer-layout">
      <CustomerSidebar user={MOCK_USER} />
      <main className="customer-main">
        <Outlet />
      </main>
    </div>
  );
}
