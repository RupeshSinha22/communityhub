import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { commentAPI } from '../api/endpoints';
import CommentItem from './CommentItem';

const CommentSection = ({ postId }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const { data: commentsData, isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => commentAPI.getByPost(postId),
    enabled: isOpen
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
    <div className="mt-4 border-t pt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-blue-500 hover:text-blue-600 font-semibold text-sm"
      >
        {isOpen ? '▼ Hide' : '▶ Show'} Comments ({comments.length})
      </button>

      {isOpen && (
        <div className="mt-4 space-y-4">
          {/* Comment Input */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-400 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="flex-1">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                rows="2"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={createCommentMutation.isPending || !commentText.trim()}
                  className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm hover:bg-blue-600 disabled:opacity-50"
                >
                  {createCommentMutation.isPending ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-3 mt-4">
            {isLoading ? (
              <p className="text-gray-500 text-sm">Loading comments...</p>
            ) : comments.length === 0 ? (
              <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map(comment => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  postId={postId}
                  onRefresh={() => queryClient.invalidateQueries(['comments', postId])}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
