import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    username: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="bg-white border border-gray-300 p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Join 🏘️ CommunityHub</h1>

        {error && (
          <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-900 font-semibold mb-2">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-900 font-semibold mb-2">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-900 font-semibold mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-900 font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-900 font-semibold mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-800 text-white font-semibold py-2 rounded hover:bg-gray-900 disabled:bg-gray-400 transition"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-gray-900 hover:text-gray-600 transition font-medium">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
