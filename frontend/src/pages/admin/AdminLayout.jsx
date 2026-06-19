import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/dashboard/AdminSidebar';
import './AdminPages.css';

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
