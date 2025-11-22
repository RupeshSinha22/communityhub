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
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary">
          🏘️ CommunityHub
        </Link>

        <div className="flex gap-6 items-center">
          <Link to="/" className="text-gray-700 hover:text-primary">
            Feed
          </Link>
          <Link to="/communities" className="text-gray-700 hover:text-primary">
            Communities
          </Link>
          {user && (
            <>
              <Link to="/profile" className="text-gray-700 hover:text-primary">
                Profile
              </Link>
              <span className="text-gray-600">{user.username}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
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
