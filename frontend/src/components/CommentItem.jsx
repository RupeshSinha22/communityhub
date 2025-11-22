import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { commentAPI } from '../api/endpoints';

const CommentItem = ({ comment, postId, onRefresh }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [showReplies, setShowReplies] = useState(false);

  const isAuthor = comment.author?.id === user?.id;
  const likeCount = comment.likers?.length || 0;
  const isLiked = comment.likers?.some(l => l.id === user?.id);

  const updateCommentMutation = useMutation({
    mutationFn: (content) => commentAPI.update(comment.id, { content }),
    onSuccess: () => {
      setIsEditing(false);
      queryClient.invalidateQueries(['comments', postId]);
    }
  });

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

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editText.trim()) return;
    updateCommentMutation.mutate(editText);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
          {comment.author?.firstName?.[0]}{comment.author?.lastName?.[0]}
        </div>

        {/* Comment Body */}
        <div className="flex-1">
          <div className="bg-gray-100 rounded-lg p-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-sm text-gray-800">
                  {comment.author?.firstName} {comment.author?.lastName}
                </p>
                <p className="text-gray-500 text-xs">@{comment.author?.username}</p>
              </div>
              {isAuthor && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-gray-500 hover:text-blue-500 text-xs"
                    title="Edit"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => deleteCommentMutation.mutate()}
                    className="text-gray-500 hover:text-red-500 text-xs"
                    disabled={deleteCommentMutation.isPending}
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleEditSubmit} className="mt-2">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                  rows="2"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    type="submit"
                    disabled={updateCommentMutation.isPending}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditText(comment.content);
                    }}
                    className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-xs hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-gray-700 text-sm mt-1">{comment.content}</p>
            )}
          </div>

          {/* Comment Actions */}
          <div className="flex gap-4 mt-2 text-xs text-gray-500">
            <button
              onClick={() => likeCommentMutation.mutate()}
              disabled={likeCommentMutation.isPending}
              className={`hover:text-red-500 transition ${isLiked ? 'text-red-500 font-semibold' : ''}`}
            >
              {isLiked ? '❤️' : '🤍'} {likeCount}
            </button>
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="hover:text-blue-500 transition"
            >
              💬 Reply
            </button>
            {comment.replies && comment.replies.length > 0 && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="hover:text-blue-500 transition"
              >
                {showReplies ? '▼' : '▶'} {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
              </button>
            )}
            <span className="text-gray-400">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Reply Input */}
          {isReplying && (
            <form onSubmit={handleReplySubmit} className="mt-3 flex gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-400 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply to ${comment.author?.firstName}...`}
                  className="w-full px-3 py-1 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  autoFocus
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="submit"
                    disabled={replyCommentMutation.isPending || !replyText.trim()}
                    className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs hover:bg-blue-600 disabled:opacity-50"
                  >
                    Reply
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsReplying(false);
                      setReplyText('');
                    }}
                    className="text-gray-500 hover:text-gray-700 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Replies */}
          {showReplies && comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 ml-4 pl-3 border-l-2 border-gray-300 space-y-2">
              {comment.replies.map(reply => (
                <div key={reply.id} className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {reply.author?.firstName?.[0]}{reply.author?.lastName?.[0]}
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded p-2">
                      <p className="font-semibold text-xs text-gray-800">
                        {reply.author?.firstName} {reply.author?.lastName}
                      </p>
                      <p className="text-gray-700 text-xs mt-1">{reply.content}</p>
                    </div>
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(reply.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
