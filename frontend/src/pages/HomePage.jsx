import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { postAPI } from '../api/endpoints';
import { useAuth } from '../hooks/useAuth';
import PostCard from '../components/PostCard';

const HomePage = () => {
  const { user } = useAuth();
  const { data: feedData, isLoading } = useQuery({
    queryKey: ['feed'],
    queryFn: postAPI.getFeed
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading feed...</div>;
  }

  const posts = feedData?.data?.posts || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Welcome, {user?.firstName}! 👋</h2>
          <p className="text-gray-600">Join or create communities to get started sharing and connecting with your neighbors.</p>
        </div>

        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600 mb-4">No posts yet. Join a community to start seeing content!</p>
              <a href="/communities" className="text-blue-500 hover:underline font-semibold">
                Explore Communities →
              </a>
            </div>
          ) : (
            posts.map(post => <PostCard key={post.id} post={post} />)
          )}
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="bg-white rounded-lg shadow p-6 sticky top-4">
          <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a href="/communities" className="block w-full bg-blue-500 text-white py-2 rounded text-center hover:bg-blue-600">
              Browse Communities
            </a>
            <a href="/communities/create" className="block w-full bg-green-500 text-white py-2 rounded text-center hover:bg-green-600">
              Create Community
            </a>
            <a href="/profile" className="block w-full bg-purple-500 text-white py-2 rounded text-center hover:bg-purple-600">
              View Profile
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
