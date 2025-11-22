import { useMutation } from '@tanstack/react-query';
import { postAPI } from '../api/endpoints';

const PostCard = ({ post }) => {
  const likeMutation = useMutation({
    mutationFn: (postId) => {
      if (post.likes.includes(userId)) {
        return postAPI.unlike(postId);
      }
      return postAPI.like(postId);
    }
  });

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center mr-4">
          {post.author?.avatar || post.author?.firstName[0]}
        </div>
        <div>
          <h3 className="font-semibold">{post.author?.firstName} {post.author?.lastName}</h3>
          <p className="text-gray-500 text-sm">@{post.author?.username}</p>
        </div>
      </div>

      <p className="text-gray-700 mb-4">{post.content}</p>

      <div className="flex gap-4 text-gray-600">
        <button className="hover:text-blue-500 flex items-center gap-2">
          💬 {post.comments?.length || 0}
        </button>
        <button 
          onClick={() => likeMutation.mutate(post.id)}
          className="hover:text-red-500 flex items-center gap-2"
        >
          ❤️ {post.likes?.length || 0}
        </button>
      </div>
    </div>
  );
};

export default PostCard;
