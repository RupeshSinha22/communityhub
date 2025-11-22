import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { communityAPI } from '../api/endpoints';

const CommunityCard = ({ community }) => {
  const { user } = useAuth();
  
  const joinMutation = useMutation({
    mutationFn: communityAPI.join
  });

  const leaveMutation = useMutation({
    mutationFn: communityAPI.leave
  });

  // Check if current user is the creator
  const isCreator = user?.id === community.createdBy;
  
  // Check if user is already a member (compare as strings for consistency)
  const isMember = community.members?.some(m => String(m) === String(user?.id));

  return (
    <Link to={`/communities/${community.id}`}>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all duration-200 h-full flex flex-col cursor-pointer hover:scale-105">
        <h3 className="text-2xl font-bold mb-3 text-gray-800 line-clamp-2">{community.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 grow">{community.description}</p>
        
        <div className="flex items-center justify-between mb-4 pt-2 border-t">
          <span className="text-gray-600 text-sm font-medium">{community.members?.length || 0} members</span>
          <span className="bg-linear-to-r from-green-100 to-emerald-100 text-emerald-800 text-xs font-bold px-4 py-2 rounded-full border-2 border-emerald-300 shadow-sm">
            {community.category.toUpperCase()}
          </span>
        </div>

        {/* Stop event propagation when clicking button */}
        <div onClick={(e) => e.preventDefault()}>
          {isCreator ? (
            <button
              disabled
              className="w-full bg-gray-500 text-white py-2 rounded-lg font-semibold hover:bg-gray-600 transition cursor-default"
            >
              ✓ Creator
            </button>
          ) : isMember ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                leaveMutation.mutate(community.id);
              }}
              disabled={leaveMutation.isPending}
              className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition disabled:bg-gray-400"
            >
              {leaveMutation.isPending ? 'Leaving...' : '👋 Leave'}
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                joinMutation.mutate(community.id);
              }}
              disabled={joinMutation.isPending}
              className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition disabled:bg-gray-400"
            >
              {joinMutation.isPending ? 'Joining...' : '✨ Join'}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CommunityCard;
