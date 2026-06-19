import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuth, selectRole } from '../store/slices/authSlice';

/**
 * ProtectedRoute
 * Wraps any route that requires authentication and/or a specific role.
 *
 * Usage:
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/profile" element={<Profile />} />
 *   </Route>
 *
 *   <Route element={<ProtectedRoute requiredRole="seller" />}>
 *     <Route path="/seller/dashboard" element={<SellerDashboard />} />
 *   </Route>
 */
import { Outlet } from 'react-router-dom';

export default function ProtectedRoute({ requiredRole = null }) {
  const isAuth   = useSelector(selectIsAuth);
  const role     = useSelector(selectRole);
  const location = useLocation();

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
