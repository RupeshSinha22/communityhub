import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-300">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-900">
          🏘️ CommunityHub
        </Link>

        <div className="flex gap-6 items-center">
          <Link to="/" className="text-gray-700 hover:text-gray-900 transition font-medium">
            Feed
          </Link>
          <Link to="/communities" className="text-gray-700 hover:text-gray-900 transition font-medium">
            Communities
          </Link>
          {user && (
            <>
              <Link to="/profile" className="text-gray-700 hover:text-gray-900 transition font-medium">
                Profile
              </Link>
              <span className="text-gray-600 text-sm">@{user.username}</span>
              <button
                onClick={handleLogout}
                className="bg-gray-200 text-gray-900 px-4 py-2 rounded hover:bg-gray-300 transition font-medium text-sm"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
