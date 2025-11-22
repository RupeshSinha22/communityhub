import { PostModel, CommunityModel, UserModel } from '../models/index.js';
import { createPostSchema } from '../utils/validation.js';

export const createPost = async (req, res, next) => {
  try {
    const { error, value } = createPostSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const community = await CommunityModel.findById(value.communityId);
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    const userIdStr = String(req.userId);
    const isMember = community.members?.some(m => String(m) === userIdStr);
    const isCreator = String(community.createdBy) === userIdStr;
    
    if (!isMember && !isCreator) {
      return res.status(403).json({ error: 'Not a member of this community' });
    }

    const post = await PostModel.create({
      ...value,
      authorId: req.userId
    });

    // Fetch the created post with all associations
    const fullPost = await PostModel.findById(post.id);

    res.status(201).json({
      message: 'Post created successfully',
      post: fullPost
    });
  } catch (error) {
    next(error);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const post = await PostModel.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({ post });
  } catch (error) {
    next(error);
  }
};

export const getCommunityPosts = async (req, res, next) => {
  try {
    const posts = await PostModel.findByCommunity(req.params.communityId);
    res.json({ posts });
  } catch (error) {
    next(error);
  }
};

export const getFeedPosts = async (req, res, next) => {
  try {
    // Get the user
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get communities the user is a member of (via many-to-many junction table)
    const joinedCommunities = await user.getJoinedCommunities();
    const joinedCommunityIds = joinedCommunities.map(c => c.id);

    // Get communities the user created
    const createdCommunities = await CommunityModel.findByUserId(req.userId);
    const createdCommunityIds = createdCommunities.map(c => c.id);

    // Combine both lists (remove duplicates)
    const communityIds = [...new Set([...joinedCommunityIds, ...createdCommunityIds])];

    if (communityIds.length === 0) {
      return res.json({ posts: [] });
    }

    const allPosts = await PostModel.findAll();
    const posts = allPosts.filter(post => 
      communityIds.includes(post.communityId)
    );

    res.json({ posts });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const post = await PostModel.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.authorId !== req.userId) {
      return res.status(403).json({ error: 'Can only edit your own posts' });
    }

    await PostModel.update(req.params.postId, {
      content: req.body.content,
      updatedAt: new Date().toISOString()
    });

    const updated = await PostModel.findById(req.params.postId);
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
    const post = await PostModel.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.authorId !== req.userId) {
      return res.status(403).json({ error: 'Can only delete your own posts' });
    }

    await PostModel.delete(req.params.postId);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const likePost = async (req, res, next) => {
  try {
    const post = await PostModel.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await PostModel.addLike(req.params.postId, req.userId);
    const updated = await PostModel.findById(req.params.postId);
    res.json({ message: 'Post liked successfully', post: updated });
  } catch (error) {
    next(error);
  }
};

export const unlikePost = async (req, res, next) => {
  try {
    const post = await PostModel.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await PostModel.removeLike(req.params.postId, req.userId);
    const updated = await PostModel.findById(req.params.postId);
    res.json({ message: 'Post unliked successfully', post: updated });
  } catch (error) {
    next(error);
  }
};
