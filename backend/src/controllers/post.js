import { PostModel, CommunityModel, UserModel } from '../models/index.js';
import { createPostSchema } from '../utils/validation.js';

export const createPost = async (req, res, next) => {
  try {
    const { error, value } = createPostSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const community = CommunityModel.findById(value.communityId);
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    if (!community.members.includes(req.userId)) {
      return res.status(403).json({ error: 'Not a member of this community' });
    }

    const post = PostModel.create({
      ...value,
      authorId: req.userId
    });

    res.status(201).json({
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    next(error);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const post = PostModel.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const author = UserModel.findById(post.authorId);
    res.json({
      post: {
        ...post,
        author: {
          id: author.id,
          firstName: author.firstName,
          lastName: author.lastName,
          username: author.username,
          avatar: author.avatar
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getCommunityPosts = async (req, res, next) => {
  try {
    const posts = PostModel.findByCommunity(req.params.communityId);
    
    const enrichedPosts = posts.map(post => {
      const author = UserModel.findById(post.authorId);
      return {
        ...post,
        author: {
          id: author.id,
          firstName: author.firstName,
          lastName: author.lastName,
          username: author.username,
          avatar: author.avatar
        }
      };
    });

    res.json({ posts: enrichedPosts });
  } catch (error) {
    next(error);
  }
};

export const getFeedPosts = async (req, res, next) => {
  try {
    const userCommunities = CommunityModel.findByUserId(req.userId);
    const communityIds = userCommunities.map(c => c.id);

    const posts = PostModel.findAll().filter(post => 
      communityIds.includes(post.communityId)
    );

    const enrichedPosts = posts.map(post => {
      const author = UserModel.findById(post.authorId);
      return {
        ...post,
        author: {
          id: author.id,
          firstName: author.firstName,
          lastName: author.lastName,
          username: author.username,
          avatar: author.avatar
        }
      };
    });

    res.json({ posts: enrichedPosts });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const post = PostModel.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.authorId !== req.userId) {
      return res.status(403).json({ error: 'Can only edit your own posts' });
    }

    const updated = PostModel.update(req.params.postId, {
      content: req.body.content,
      updatedAt: new Date().toISOString()
    });

    res.json({
      message: 'Post updated successfully',
      post: updated
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const post = PostModel.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.authorId !== req.userId) {
      return res.status(403).json({ error: 'Can only delete your own posts' });
    }

    PostModel.delete(req.params.postId);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const likePost = async (req, res, next) => {
  try {
    const post = PostModel.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    PostModel.addLike(req.params.postId, req.userId);
    res.json({ message: 'Post liked successfully' });
  } catch (error) {
    next(error);
  }
};

export const unlikePost = async (req, res, next) => {
  try {
    const post = PostModel.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    PostModel.removeLike(req.params.postId, req.userId);
    res.json({ message: 'Post unliked successfully' });
  } catch (error) {
    next(error);
  }
};
