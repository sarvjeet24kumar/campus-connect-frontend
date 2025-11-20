import { Link, useLocation } from 'react-router-dom';

import LogoutOverlay from './LogoutOverlay.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const navLinkClasses = active =>
  `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    active
      ? 'bg-indigo-600 text-white'
      : 'text-slate-200 hover:bg-indigo-500/80'
  }`;

const SiteHeader = () => {
  const { user, isAuthenticated, isAdmin, isStudent, logout, processing } =
    useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const isRouteAllowed = () => {
    if (!isAuthenticated) {
      return false;
    }
    if (location.pathname.startsWith('/admin')) {
      return isAdmin;
    }
    if (location.pathname.startsWith('/student')) {
      return isStudent && !isAdmin;
    }
    return true;
  };

  const canShowLogout = isAuthenticated && isRouteAllowed();

  const showLogoutOverlay = processing && isAuthenticated;

  const displayName = user?.first_name || 'User';

  return (
    <>
      {showLogoutOverlay && <LogoutOverlay />}
      <header className="bg-indigo-700 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-lg font-semibold">
            Campus Connect
          </Link>
          <nav className="flex items-center gap-2">
            {/* Home button removed - not needed on homepage */}
            {isStudent && !isAdmin && (
              <Link
                to="/student"
                className={navLinkClasses(location.pathname === '/student')}
              >
                Student Dashboard
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className={navLinkClasses(location.pathname === '/admin')}
              >
                Admin Dashboard
              </Link>
            )}
          </nav>
          <div className="flex items-center gap-3 text-sm">
            {canShowLogout ? (
              <>
                <span className="hidden text-slate-200 sm:inline">
                  Hi, {displayName}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={processing}
                  className={`rounded-md px-3 py-1 font-medium text-white transition ${
                    processing
                      ? 'bg-white/10 cursor-not-allowed'
                      : 'bg-white/20 hover:bg-white/30'
                  }`}
                >
                  {processing ? 'Logging out...' : 'Logout'}
                </button>
              </>
            ) : (
              <span className="text-slate-200">Not signed in</span>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default SiteHeader;
