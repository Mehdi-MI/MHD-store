import { Outlet } from 'react-router-dom';
import SellerSidebar from '../../components/dashboard/SellerSidebar';
import './SellerPages.css';

const MOCK_SELLER = {
  storeName: 'Maison Élite',
  logo: null,
  status: 'approved',
};

export default function SellerLayout() {
  return (
    <div className="sl-layout">
      <SellerSidebar seller={MOCK_SELLER} />
      <main className="sl-main">
        <Outlet />
      </main>
    </div>
  );
}
