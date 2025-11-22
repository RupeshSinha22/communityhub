import { useQuery } from '@tanstack/react-query';
import { communityAPI } from '../api/endpoints';
import CommunityCard from '../components/CommunityCard';

const CommunityPage = () => {
  const { data: communitiesData, isLoading } = useQuery({
    queryKey: ['communities'],
    queryFn: communityAPI.getAll
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading communities...</div>;
  }

  const communities = communitiesData?.data?.communities || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Communities</h1>
        <a href="/communities/create" className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-900 transition font-medium">
          Create Community
        </a>
      </div>

      {communities.length === 0 ? (
        <div className="bg-white border border-gray-300 p-8 text-center">
          <p className="text-gray-700 mb-4">No communities found yet.</p>
          <a href="/communities/create" className="text-gray-900 hover:text-gray-600 transition font-semibold">
            Be the first to create one! →
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map(community => (
            <CommunityCard key={community.id} community={community} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityPage;
