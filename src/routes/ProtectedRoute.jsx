import { Navigate } from 'react-router-dom';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';

const getDefaultPath = (roles = []) => {
  if (roles.includes('admin') || roles.includes('super_admin')) {
    return '/admin';
  }
  if (roles.includes('student')) {
    return '/student';
  }
  return '/';
};

const LoadingScreen = () => (
  <div className="flex h-screen items-center justify-center">
    <Loader size="lg" text="Loading..." />
  </div>
);

const RequireAuth = ({ children, allowedRoles = [], forbiddenRoles = [] }) => {
  const { loading, isAuthenticated, roles } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles.length === 0) {
    return children;
  }

  const hasRole = roles.some(role => allowedRoles.includes(role));
  if (!hasRole) {
    return <Navigate to={getDefaultPath(roles)} replace />;
  }

  const hasForbiddenRole = roles.some(role => forbiddenRoles.includes(role));
  if (hasForbiddenRole) {
    return <Navigate to={getDefaultPath(roles)} replace />;
  }

  return children;
};

export const AdminRoute = ({ children }) => (
  <RequireAuth allowedRoles={['admin', 'super_admin']}>{children}</RequireAuth>
);

export const StudentRoute = ({ children }) => (
  <RequireAuth
    allowedRoles={['student']}
    forbiddenRoles={['admin', 'super_admin']}
  >
    {children}
  </RequireAuth>
);

export const PublicRoute = ({ children, restricted = false }) => {
  const { loading, isAuthenticated, roles } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }
  console.log(restricted, isAuthenticated, roles);
  if (restricted && isAuthenticated) {
    return <Navigate to={getDefaultPath(roles)} replace />;
  }

  return children;
};
