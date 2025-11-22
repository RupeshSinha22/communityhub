import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { postAPI, commentAPI } from '../api/endpoints';
import CommentSection from './CommentSection';

const PostCard = ({ post, onLikeUpdate }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch comments count
  const { data: commentsData } = useQuery({
    queryKey: ['comments', post.id],
    queryFn: () => commentAPI.getByPost(post.id)
  });

  const likeMutation = useMutation({
    mutationFn: (postId) => {
      const isLiked = post.likers?.some(l => l.id === user?.id);
      if (isLiked) {
        return postAPI.unlike(postId);
      }
      return postAPI.like(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['feed']);
      if (onLikeUpdate) {
        onLikeUpdate();
      }
    }
  });

  const isLiked = post.likers?.some(l => l.id === user?.id);
  const likeCount = post.likers?.length || 0;
  const communityName = post.community?.name || 'Unknown Community';
  const communityOwnerId = post.community?.createdBy;
  const commentCount = commentsData?.data?.comments?.length || 0;

  return (
    <div className="bg-white border border-gray-300 rounded-none overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center font-semibold text-sm">
            {post.author?.firstName?.[0]}{post.author?.lastName?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">{post.author?.firstName} {post.author?.lastName}</p>
            <p className="text-xs text-gray-600">{communityName} · {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-2">
        <p className="text-sm text-gray-900 leading-normal">{post.content}</p>
      </div>

      {/* Engagement Stats */}
      <div className="px-4 py-2 text-xs text-gray-600 border-t border-gray-200">
        {likeCount > 0 && <span>{likeCount} like{likeCount !== 1 ? 's' : ''}</span>}
        {likeCount > 0 && commentCount > 0 && <span> · </span>}
        {commentCount > 0 && <span>{commentCount} comment{commentCount !== 1 ? 's' : ''}</span>}
      </div>

      {/* Inline Actions */}
      <div className="px-4 py-2 flex gap-4 border-t border-gray-200">
        <button
          onClick={() => likeMutation.mutate(post.id)}
          disabled={likeMutation.isPending}
          className={`text-sm transition ${
            isLiked ? 'text-red-600 font-medium' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {isLiked ? '❤️' : '🤍'} Like
        </button>
        <button className="text-sm text-gray-600 hover:text-gray-900 transition">
          💬 Comment
        </button>
      </div>

      {/* Comments */}
      <CommentSection postId={post.id} communityOwnerId={communityOwnerId} />
    </div>
  );
};

export default PostCard;
