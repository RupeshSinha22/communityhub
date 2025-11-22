import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { postAPI } from '../api/endpoints';
import CommentSection from './CommentSection';

const PostCard = ({ post, onLikeUpdate }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: (postId) => {
      const isLiked = post.likers?.some(l => l.id === user?.id);
      if (isLiked) {
        return postAPI.unlike(postId);
      }
      return postAPI.like(postId);
    },
    onSuccess: () => {
      // Refetch feed to update like counts
      queryClient.invalidateQueries(['feed']);
      if (onLikeUpdate) {
        onLikeUpdate();
      }
    }
  });

  const isLiked = post.likers?.some(l => l.id === user?.id);
  const likeCount = post.likers?.length || 0;
  const communityName = post.community?.name || 'Unknown Community';

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center mr-4 font-bold text-lg">
          {post.author?.firstName?.[0]}{post.author?.lastName?.[0]}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">{post.author?.firstName} {post.author?.lastName}</h3>
          <p className="text-gray-500 text-sm">@{post.author?.username}</p>
          <p className="text-gray-400 text-xs mt-1">📍 {communityName}</p>
        </div>
        <span className="text-gray-400 text-xs">{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>

      <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>

      <div className="flex gap-6 text-gray-600 pt-3 border-t">
        <button 
          onClick={() => likeMutation.mutate(post.id)}
          className={`flex items-center gap-2 transition ${
            isLiked ? 'text-red-500 font-semibold' : 'hover:text-red-500'
          }`}
          disabled={likeMutation.isPending}
        >
          <span className="text-lg">{isLiked ? '❤️' : '🤍'}</span>
          <span>{likeCount}</span>
        </button>
      </div>

      {/* Comment Section */}
      <CommentSection postId={post.id} />
    </div>
  );
};

export default PostCard;
