import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { userAPI } from '../api/endpoints';
import { useState } from 'react';

const ProfilePage = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // If viewing own profile without userId param, use context user
  const displayUser = !userId ? currentUser : null;

  const { data: profileData, isLoading, error } = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => userAPI.getProfile(userId),
    enabled: !!userId,
    retry: false
  });

  const uploadProfilePicMutation = useMutation({
    mutationFn: (file) => userAPI.uploadProfilePic(file),
    onSuccess: (response) => {
      // Invalidate both profile queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      // Also invalidate the current user data if it exists
      queryClient.setQueryData(['currentUser'], (oldData) => {
        if (oldData?.data?.user) {
          return {
            ...oldData,
            data: {
              ...oldData.data,
              user: {
                ...oldData.data.user,
                profilePic: response?.data?.data?.user?.profilePic
              }
            }
          };
        }
        return oldData;
      });
      setUploadError('');
    },
    onError: (error) => {
      setUploadError(error.response?.data?.error || 'Failed to upload image');
    }
  });

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    uploadProfilePicMutation.mutate(file);
    setIsUploading(false);
  };

  // Loading state
  if (userId && isLoading) {
    return <div className="max-w-2xl mx-auto text-center py-8">Loading profile...</div>;
  }

  // Error state for userId lookup
  if (userId && error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-8">
        <p className="text-red-600 mb-4">User not found</p>
        <button onClick={() => navigate('/')} className="text-gray-600 hover:text-gray-900">
          ← Go back
        </button>
      </div>
    );
  }

  // Get user data - either from context (own profile) or API (other user)
  const user = displayUser || profileData?.data?.data?.user;

  if (!user) {
    return <div className="max-w-2xl mx-auto text-center py-8">User not found</div>;
  }

  const isOwnProfile = !userId || user.id === currentUser?.id;
  const memberSinceDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border border-gray-300 p-8">
        <div className="text-center mb-8">
          {/* Profile Picture Section */}
          <div className="relative inline-block mb-4">
            {user.profilePic ? (
              <img
                src={user.profilePic}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center text-4xl font-bold border-2 border-gray-300">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
            )}

            {isOwnProfile && (
              <label className="absolute bottom-0 right-0 bg-gray-800 text-white p-2 rounded-full cursor-pointer hover:bg-gray-900 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicUpload}
                  disabled={isUploading || uploadProfilePicMutation.isPending}
                  className="hidden"
                  aria-label="Upload profile picture"
                />
                <span className="text-lg">📷</span>
              </label>
            )}
          </div>

          {uploadError && (
            <p className="text-red-600 text-sm mb-2">{uploadError}</p>
          )}

          <h1 className="text-3xl font-bold text-gray-900">{user.firstName} {user.lastName}</h1>
          <p className="text-gray-600">@{user.username}</p>
          {isOwnProfile && <p className="text-gray-500 text-sm mt-2">Your profile</p>}
        </div>

        <div className="space-y-4 border-t border-gray-200 pt-6">
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">EMAIL</h3>
            <p className="text-gray-700">{user.email}</p>
          </div>
          {user.bio && (
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">BIO</h3>
              <p className="text-gray-700">{user.bio}</p>
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">MEMBER SINCE</h3>
            <p className="text-gray-700">{memberSinceDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
