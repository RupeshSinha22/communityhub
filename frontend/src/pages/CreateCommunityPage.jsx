import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { communityAPI } from '../api/endpoints';

const CreateCommunityPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'general'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: communityAPI.create,
    onSuccess: () => {
      // Invalidate both communities and feed queries
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      navigate('/');
    },
    onError: (err) => {
      setError(err.response?.data?.error || 'Failed to create community');
    }
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create New Community</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8">
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Community Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Downtown Neighbors"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Tell us about your community..."
            rows="6"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="general">General</option>
            <option value="sports">Sports</option>
            <option value="events">Events</option>
            <option value="marketplace">Marketplace</option>
            <option value="support">Support</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {mutation.isPending ? 'Creating...' : 'Create Community'}
        </button>
      </form>
    </div>
  );
};

export default CreateCommunityPage;
