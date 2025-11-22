import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { communityAPI, postAPI } from '../api/endpoints';
import PostCard from '../components/PostCard';

const CommunityDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [postContent, setPostContent] = useState('');

  // Fetch community details
  const { data: communityData, isLoading: communityLoading } = useQuery({
    queryKey: ['community', id],
    queryFn: () => communityAPI.getById(id)
  });

  // Fetch posts for this community
  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ['community-posts', id],
    queryFn: () => postAPI.getByCommunity(id)
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: (content) => postAPI.create({ content, communityId: id }),
    onSuccess: () => {
      setPostContent('');
      queryClient.invalidateQueries({ queryKey: ['community-posts', id] });
    }
  });

  // Join community mutation
  const joinMutation = useMutation({
    mutationFn: () => communityAPI.join(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community', id] });
    }
  });

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: postAPI.like,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-posts', id] });
    }
  });

  // Leave community mutation
  const leaveMutation = useMutation({
    mutationFn: () => communityAPI.leave(id),
    onSuccess: () => navigate('/communities')
  });

  if (communityLoading) {
    return <div className="text-center py-12 text-lg">Loading community...</div>;
  }

  const community = communityData?.data?.community;

  if (!community) {
    return <div className="text-center py-12 text-lg">Community not found</div>;
  }

  const isCreator = user?.id === community.createdBy;
  const isMember = community.members?.some(m => String(m) === String(user?.id));
  const posts = postsData?.data?.posts || [];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Community Header */}
      <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg p-8 mb-8 border border-blue-100">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-5xl font-bold mb-3 text-gray-900">{community.name}</h1>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">{community.description}</p>
            <div className="flex flex-wrap gap-3 items-center">
              <span className="bg-linear-to-r from-green-100 to-emerald-100 text-emerald-800 text-xs font-bold px-4 py-2 rounded-full border-2 border-emerald-300 shadow-sm uppercase">
                {community.category}
              </span>
              <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold">
                👥 {community.members?.length || 0} members
              </span>
              {community.isPrivate && (
                <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-2 rounded-lg">🔒 Private</span>
              )}
            </div>
          </div>
          {isCreator && (
            <div className="bg-linear-to-br from-gray-100 to-gray-200 px-4 py-3 rounded-lg border-2 border-gray-300 font-semibold">
              ✓ Creator
            </div>
          )}
        </div>
      </div>

      {/* Join/Leave Section */}
      {!isCreator && !isMember && (
        <div className="mb-8">
          <button
            onClick={() => joinMutation.mutate()}
            disabled={joinMutation.isPending}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold text-lg transition"
          >
            {joinMutation.isPending ? 'Joining...' : '✨ Join Community'}
          </button>
        </div>
      )}

      {/* Create Post Section */}
      {(isMember || isCreator) && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200">
          <h3 className="text-xl font-bold mb-4 text-gray-900">✍️ Share Your Thoughts</h3>
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="What's on your mind? Share something interesting..."
            className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows="4"
          />
          <div className="flex gap-3">
            <button
              onClick={() => createPostMutation.mutate(postContent)}
              disabled={!postContent.trim() || createPostMutation.isPending}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 font-semibold transition"
            >
              {createPostMutation.isPending ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      )}

      {/* Posts Section */}
      <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200 mb-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">💬 Posts</h2>
        
        {postsLoading ? (
          <div className="text-center py-12 text-gray-500">
            <div className="inline-block animate-spin">⏳</div>
            <p className="mt-2">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-xl text-gray-600 mb-2">📝 No posts yet</p>
            {isCreator && (
              <p className="text-gray-500">Be the first to share something! 🚀</p>
            )}
            {isMember && !isCreator && (
              <p className="text-gray-500">Be the first to share something! 🚀</p>
            )}
            {!isMember && !isCreator && (
              <p className="text-gray-500">Join the community to see posts! 👋</p>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* Leave Community Section */}
      {!isCreator && isMember && (
        <div className="mb-8">
          <button
            onClick={() => leaveMutation.mutate()}
            disabled={leaveMutation.isPending}
            className="w-full bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 disabled:bg-gray-400 font-semibold transition"
          >
            {leaveMutation.isPending ? 'Leaving...' : '👋 Leave Community'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CommunityDetailPage;
