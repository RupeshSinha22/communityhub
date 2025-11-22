import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { communityAPI } from '../api/endpoints';

const CommunityCard = ({ community }) => {
  const joinMutation = useMutation({
    mutationFn: communityAPI.join
  });

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
      <h3 className="text-xl font-bold mb-2">{community.name}</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{community.description}</p>
      
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-500 text-sm">{community.members?.length || 0} members</span>
        <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded">{community.category}</span>
      </div>

      <button
        onClick={() => joinMutation.mutate(community.id)}
        disabled={joinMutation.isPending}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {joinMutation.isPending ? 'Joining...' : 'Join Community'}
      </button>
    </div>
  );
};

export default CommunityCard;
