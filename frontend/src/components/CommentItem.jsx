import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { commentAPI } from '../api/endpoints';

const CommentItem = ({ comment, postId, onRefresh, isReply = false, communityOwnerId }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showReplies, setShowReplies] = useState(false);

  const isAuthor = comment.author?.id === user?.id;
  const canDelete = isAuthor || (communityOwnerId && communityOwnerId === user?.id);
  const likeCount = comment.likers?.length || 0;
  const isLiked = comment.likers?.some(l => l.id === user?.id);

  const deleteCommentMutation = useMutation({
    mutationFn: () => commentAPI.delete(comment.id),
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', postId]);
    }
  });

  const likeCommentMutation = useMutation({
    mutationFn: () => {
      if (isLiked) {
        return commentAPI.unlike(comment.id);
      }
      return commentAPI.like(comment.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', postId]);
    }
  });

  const replyCommentMutation = useMutation({
    mutationFn: (content) => commentAPI.create({
      postId,
      content,
      parentCommentId: comment.id
    }),
    onSuccess: () => {
      setReplyText('');
      setIsReplying(false);
      queryClient.invalidateQueries(['comments', postId]);
    }
  });

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    replyCommentMutation.mutate(replyText);
  };

  return (
    <div className={`text-xs ${isReply ? 'ml-5' : ''}`}>
      <div className="flex gap-1.5">
        {/* Avatar */}
        <div className="w-5 h-5 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center text-xs font-semibold shrink-0 mt-px">
          {comment.author?.firstName?.[0]}{comment.author?.lastName?.[0]}
        </div>

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          <div>
            <span className="font-semibold text-gray-900">{comment.author?.firstName} {comment.author?.lastName}</span>
            <span className="text-gray-800 ml-1">{comment.content}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-0.5 text-gray-600">
            <button
              onClick={() => likeCommentMutation.mutate()}
              disabled={likeCommentMutation.isPending}
              className={`hover:text-red-600 transition ${isLiked ? 'text-red-600' : ''}`}
            >
              {isLiked ? '❤️' : '🤍'}
            </button>
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="hover:text-gray-900 transition"
            >
              reply
            </button>
            {canDelete && (
              <button
                onClick={() => deleteCommentMutation.mutate()}
                disabled={deleteCommentMutation.isPending}
                className="hover:text-red-600 transition text-gray-500"
              >
                delete
              </button>
            )}
            <span className="text-gray-500">{new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>

          {/* Reply Input */}
          {isReplying && (
            <form onSubmit={handleReplySubmit} className="mt-1 flex gap-1">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="reply..."
                className="flex-1 px-2 py-0.5 bg-gray-100 rounded text-xs focus:outline-none focus:ring-1 focus:ring-gray-300"
                autoFocus
              />
              <button type="submit" disabled={replyCommentMutation.isPending || !replyText.trim()} className="text-gray-600 hover:text-gray-900 disabled:text-gray-300 font-medium transition">
                post
              </button>
            </form>
          )}

          {/* Nested Replies */}
          {comment.replies?.length > 0 && (
            <div className="mt-1">
              <button onClick={() => setShowReplies(!showReplies)} className="text-gray-600 hover:text-gray-900 transition">
                {showReplies ? '▼' : '▶'} {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
              </button>
              {showReplies && (
                <div className="mt-1.5 space-y-1">
                  {comment.replies.map(reply => (
                    <CommentItem key={reply.id} comment={reply} postId={postId} isReply={true} communityOwnerId={communityOwnerId} onRefresh={onRefresh} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
