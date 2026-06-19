import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar   from './components/layouts/Navbar';
import Footer   from './components/layouts/Footer';
import Home     from './pages/public/Home';
import Products       from './pages/public/Products';
import ProductDetails from './pages/public/ProductDetails';
import Categories    from './pages/public/Categories';
import Search        from './pages/public/Search';
import Login         from './pages/public/Login';
import Register        from './pages/public/Register';
import SellerRegister  from './pages/public/SellerRegister';
import Cart           from './pages/public/Cart';
import Checkout       from './pages/public/Checkout';
import OrderSuccess   from './pages/public/OrderSuccess';
import About              from './pages/public/About';
import CustomerLayout     from './pages/customer/CustomerLayout';
import Profile            from './pages/customer/Profile';
import Orders             from './pages/customer/Orders';
import OrderDetails       from './pages/customer/OrderDetails';
import Wishlist           from './pages/customer/Wishlist';
import Addresses          from './pages/customer/Addresses';
import Settings           from './pages/customer/Settings';
import Contact       from './pages/public/Contact';
import SellerLayout    from './pages/seller/SellerLayout';
import AdminLayout     from './pages/admin/AdminLayout';
import AdminDashboard  from './pages/admin/AdminDashboard';
import Users           from './pages/admin/Users';
import Sellers         from './pages/admin/Sellers';
import AdminProducts   from './pages/admin/AdminProducts';
import AdminOrders     from './pages/admin/AdminOrders';
import AdminCategories from './pages/admin/Categories';
import Reviews         from './pages/admin/Reviews';
import AdminAnalytics  from './pages/admin/AdminAnalytics';
import AdminSettings   from './pages/admin/AdminSettings';
import SellerDashboard from './pages/seller/SellerDashboard';
import MyProducts      from './pages/seller/MyProducts';
import AddProduct      from './pages/seller/AddProduct';
import SellerOrders    from './pages/seller/SellerOrders';
import Analytics       from './pages/seller/Analytics';
import Inventory       from './pages/seller/Inventory';
import SellerProfile   from './pages/seller/SellerProfile';
import './styles/globals.css';

const Placeholder = ({ title }) => (
  <div style={{
    minHeight:'100vh', display:'flex', flexDirection:'column',
    alignItems:'center', justifyContent:'center',
    color:'var(--text-muted)', fontFamily:'var(--font-display)',
    fontSize:'2rem', fontStyle:'italic', gap:'1rem', paddingTop:'72px'
  }}>
    <span style={{ color:'var(--gold)', fontSize:'3rem' }}>✦</span>
    {title}
    <span style={{ fontSize:'0.8rem', fontFamily:'var(--font-body)',
      letterSpacing:'0.14em', textTransform:'uppercase' }}>Coming soon</span>
  </div>
);
const pg = (title) => <Placeholder title={title} />;

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* ── Public ─────────────────────────────── */}
        <Route path="/"                  element={<Home />} />
        <Route path="/products"          element={<Products />} />
        <Route path="/products/:id"      element={<ProductDetails />} />
        <Route path="/categories"        element={<Categories />} />
        <Route path="/categories/:slug"  element={pg('Category')} />
        <Route path="/search"            element={<Search />} />
        <Route path="/login"             element={<Login />} />
        <Route path="/register"          element={<Register />} />
        <Route path="/cart"              element={<Cart />} />
        <Route path="/checkout"          element={<Checkout />} />
        <Route path="/order/success"     element={<OrderSuccess />} />
        <Route path="/about"             element={<About />} />
        <Route path="/contact"           element={<Contact />} />

        {/* ── Customer ────────────────────────────── */}
        <Route element={<CustomerLayout />}>
          <Route path="/profile"              element={<Profile />} />
          <Route path="/profile/orders"       element={<Orders />} />
          <Route path="/profile/orders/:id"   element={<OrderDetails />} />
          <Route path="/profile/wishlist"     element={<Wishlist />} />
          <Route path="/profile/addresses"    element={<Addresses />} />
          <Route path="/profile/settings"     element={<Settings />} />
        </Route>

        {/* ── Seller ──────────────────────────────── */}
        <Route element={<SellerLayout />}>
          <Route path="/seller/dashboard"         element={<SellerDashboard />} />
          <Route path="/seller/products"          element={<MyProducts />} />
          <Route path="/seller/products/new"      element={<AddProduct />} />
          <Route path="/seller/products/:id/edit" element={<AddProduct />} />
          <Route path="/seller/orders"            element={<SellerOrders />} />
          <Route path="/seller/analytics"         element={<Analytics />} />
          <Route path="/seller/inventory"         element={<Inventory />} />
          <Route path="/seller/profile"           element={<SellerProfile />} />
        </Route>
        {/* ── Admin ───────────────────────────────── */}
        <Route element={<AdminLayout />}>
          <Route path="/admin"                element={<AdminDashboard />} />
          <Route path="/admin/users"          element={<Users />} />
          <Route path="/admin/sellers"        element={<Sellers />} />
          <Route path="/admin/products"       element={<AdminProducts />} />
          <Route path="/admin/orders"         element={<AdminOrders />} />
          <Route path="/admin/categories"     element={<AdminCategories />} />
          <Route path="/admin/reviews"        element={<Reviews />} />
          <Route path="/admin/analytics"      element={<AdminAnalytics />} />
          <Route path="/admin/settings"       element={<AdminSettings />} />
        </Route>
        {/* ── 404 ─────────────────────────────────── */}
        <Route path="*" element={pg('404 — Page Not Found')} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
