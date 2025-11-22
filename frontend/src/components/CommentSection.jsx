import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { commentAPI } from '../api/endpoints';
import CommentItem from './CommentItem';

const CommentSection = ({ postId, communityOwnerId }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState('');

  // Load comments by default
  const { data: commentsData, isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => commentAPI.getByPost(postId)
  });

  const createCommentMutation = useMutation({
    mutationFn: (data) => commentAPI.create(data),
    onSuccess: () => {
      setCommentText('');
      queryClient.invalidateQueries(['comments', postId]);
    }
  });

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    createCommentMutation.mutate({
      postId,
      content: commentText,
      parentCommentId: null
    });
  };

  const comments = commentsData?.data?.comments || [];

  return (
    <div className="px-4 py-3 border-t border-gray-200">
      {/* Comments List */}
      <div className="space-y-2 mb-3 max-h-96 overflow-y-auto">
        {isLoading ? (
          <p className="text-gray-400 text-xs">Loading...</p>
        ) : comments.length === 0 ? (
          <p className="text-gray-400 text-xs italic">No comments</p>
        ) : (
          comments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              communityOwnerId={communityOwnerId}
              onRefresh={() => queryClient.invalidateQueries(['comments', postId])}
            />
          ))
        )}
      </div>

      {/* Comment Input */}
      <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 border-t border-gray-200 pt-2">
        <div className="w-6 h-6 rounded-full bg-gray-400 text-white flex items-center justify-center text-xs font-semibold shrink-0">
          {user?.firstName?.[0]}{user?.lastName?.[0]}
        </div>
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 text-sm bg-transparent focus:outline-none placeholder-gray-400 py-1"
        />
        <button
          type="submit"
          disabled={createCommentMutation.isPending || !commentText.trim()}
          className="text-gray-600 hover:text-gray-900 disabled:text-gray-300 text-sm font-medium transition"
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default CommentSection;
