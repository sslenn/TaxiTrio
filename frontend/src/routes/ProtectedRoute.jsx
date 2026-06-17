import { Navigate, useLocation } from 'react-router-dom';
import { getToken, getUser } from '../utils/auth';

const ProtectedRoute = ({ children, roles }) => {
  const token = getToken();
  const user = getUser();
  const location = useLocation();

  if (!token || !user) {
    const redirectUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectUrl}`} replace />;
  }

  if (roles && !roles.includes(user.role)) return <Navigate to="/unauthorized" replace />;
  return children;
};

export default ProtectedRoute;
