import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { userAPI } from '../api/endpoints';

const ProfilePage = () => {
  const { userId } = useParams();
  const { data: profileData, isLoading } = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => userAPI.getProfile(userId || 'me'),
    enabled: !!userId
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  const user = profileData?.data?.user;

  if (!user) {
    return <div className="text-center py-8">User not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow p-8">
        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-full bg-blue-500 text-white flex items-center justify-center text-4xl mx-auto mb-4">
            {user.avatar || '👤'}
          </div>
          <h1 className="text-3xl font-bold">{user.firstName} {user.lastName}</h1>
          <p className="text-gray-600">@{user.username}</p>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-700">Email</h3>
            <p className="text-gray-600">{user.email}</p>
          </div>
          {user.bio && (
            <div>
              <h3 className="font-semibold text-gray-700">Bio</h3>
              <p className="text-gray-600">{user.bio}</p>
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-700">Member Since</h3>
            <p className="text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
