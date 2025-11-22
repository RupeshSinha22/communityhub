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
      <div className="bg-white border border-gray-300 p-4 hover:border-gray-400 transition-all duration-200 h-full flex flex-col cursor-pointer">
        <h3 className="text-lg font-semibold mb-2 text-gray-900 line-clamp-2">{community.name}</h3>
        <p className="text-gray-700 text-sm mb-3 line-clamp-3 grow">{community.description}</p>
        
        <div className="flex items-center justify-between mb-3 pt-2 border-t border-gray-200 text-xs text-gray-600">
          <span>{community.members?.length || 0} members</span>
          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">{community.category}</span>
        </div>

        {/* Stop event propagation when clicking button */}
        <div onClick={(e) => e.preventDefault()}>
          {isCreator ? (
            <button
              disabled
              className="w-full bg-gray-300 text-gray-900 py-2 rounded font-medium hover:bg-gray-400 transition cursor-default text-sm"
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
              className="w-full bg-gray-200 text-gray-900 py-2 rounded font-medium hover:bg-gray-300 transition disabled:bg-gray-100 text-sm"
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
              className="w-full bg-gray-800 text-white py-2 rounded font-medium hover:bg-gray-900 transition disabled:bg-gray-400 text-sm"
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
