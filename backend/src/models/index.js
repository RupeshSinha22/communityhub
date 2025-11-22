import sequelize from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';
import User from './User.js';
import Community from './Community.js';
import Post from './Post.js';
import Comment from './Comment.js';

// Initialize models
const models = {
  User,
  Community,
  Post,
  Comment,
};

// Define associations
User.hasMany(Community, { foreignKey: 'createdBy', as: 'communities' });
Community.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

User.hasMany(Post, { foreignKey: 'authorId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

Community.hasMany(Post, { foreignKey: 'communityId', as: 'posts' });
Post.belongsTo(Community, { foreignKey: 'communityId', as: 'community' });

// Comments associations
User.hasMany(Comment, { foreignKey: 'authorId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments' });
Comment.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

// Self-referential for comment replies
Comment.hasMany(Comment, { foreignKey: 'parentCommentId', as: 'replies' });
Comment.belongsTo(Comment, { foreignKey: 'parentCommentId', as: 'parentComment' });

// Many-to-many: Users and Communities
User.belongsToMany(Community, { through: 'CommunityMembers', as: 'joinedCommunities' });
Community.belongsToMany(User, { through: 'CommunityMembers', as: 'members' });

// Many-to-many: Posts and Likes
User.belongsToMany(Post, { through: 'PostLikes', as: 'likedPosts' });
Post.belongsToMany(User, { through: 'PostLikes', as: 'likers' });

// Many-to-many: Comments and Likes
User.belongsToMany(Comment, { through: 'CommentLikes', as: 'likedComments' });
Comment.belongsToMany(User, { through: 'CommentLikes', as: 'likers' });

// Sync database
export const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connected');
    await sequelize.sync({ alter: false });
    console.log('✓ Database models synced');
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    throw error;
  }
};

// Mock Community and Post models for backward compatibility
const mockCommunities = new Map();
const mockPosts = new Map();

export const UserModel = {
  create: (data) => User.create(data),
  findById: (id) => User.findByPk(id),
  findByEmail: (email) => User.findOne({ where: { email } }),
  findAll: () => User.findAll(),
  update: (id, data) => User.update(data, { where: { id } }),
  delete: (id) => User.destroy({ where: { id } }),
};

// Helper to format community response
const formatCommunity = (community) => {
  if (!community) return null;
  const data = community.toJSON ? community.toJSON() : community;
  return {
    ...data,
    members: data.members?.map(m => m.id || m) || []
  };
};

export const CommunityModel = {
  create: (data) => Community.create(data),
  findById: (id) => Community.findByPk(id, { include: ['members'] }).then(formatCommunity),
  findAll: () => Community.findAll({ include: ['members'] }).then(communities => Array.isArray(communities) ? communities.map(formatCommunity) : []),
  findByUserId: (userId) => Community.findAll({ where: { createdBy: userId }, include: ['members'] }).then(communities => Array.isArray(communities) ? communities.map(formatCommunity) : []),
  update: (id, data) => Community.update(data, { where: { id }, returning: true }),
  delete: (id) => Community.destroy({ where: { id } }),
  addMember: async (communityId, userId) => {
    const community = await Community.findByPk(communityId);
    if (community) {
      await community.addMember(userId);
    }
    return Community.findByPk(communityId, { include: ['members'] }).then(formatCommunity);
  },
  removeMember: async (communityId, userId) => {
    const community = await Community.findByPk(communityId);
    if (community) {
      await community.removeMember(userId);
    }
    return Community.findByPk(communityId, { include: ['members'] }).then(formatCommunity);
  }
};

export const PostModel = {
  create: (data) => Post.create(data),
  findById: (id) => Post.findByPk(id, { include: ['author', 'likers', 'community'] }),
  findByCommunity: (communityId) => Post.findAll({ 
    where: { communityId }, 
    include: ['author', 'likers', 'community'],
    order: [['createdAt', 'DESC']]
  }),
  findByUser: (userId) => Post.findAll({ 
    where: { authorId: userId },
    include: ['author', 'community']
  }),
  findAll: () => Post.findAll({ 
    include: ['author', 'likers', 'community'],
    order: [['createdAt', 'DESC']]
  }),
  update: (id, data) => Post.update(data, { where: { id }, returning: true }),
  delete: (id) => Post.destroy({ where: { id } }),
  addLike: async (postId, userId) => {
    const post = await Post.findByPk(postId);
    if (post) {
      await post.addLiker(userId);
    }
    return Post.findByPk(postId, { include: ['author', 'likers', 'community'] });
  },
  removeLike: async (postId, userId) => {
    const post = await Post.findByPk(postId);
    if (post) {
      await post.removeLiker(userId);
    }
    return Post.findByPk(postId, { include: ['author', 'likers', 'community'] });
  }
};

export const CommentModel = {
  create: (data) => Comment.create(data),
  findById: (id) => Comment.findByPk(id, { include: ['author', 'likers', 'replies'] }),
  findByPost: (postId) => Comment.findAll({
    where: { postId, parentCommentId: null },
    include: [
      { model: User, as: 'author', attributes: ['id', 'firstName', 'lastName', 'username'] },
      { model: Comment, as: 'replies', include: [{ model: User, as: 'author', attributes: ['id', 'firstName', 'lastName', 'username'] }] },
      { model: User, as: 'likers', attributes: ['id'] }
    ],
    order: [['createdAt', 'DESC'], ['replies', 'createdAt', 'DESC']]
  }),
  update: (id, data) => Comment.update(data, { where: { id }, returning: true }),
  delete: (id) => Comment.destroy({ where: { id } }),
  addLike: async (commentId, userId) => {
    const comment = await Comment.findByPk(commentId);
    if (comment) {
      await comment.addLiker(userId);
    }
    return Comment.findByPk(commentId, { include: ['author', 'likers'] });
  },
  removeLike: async (commentId, userId) => {
    const comment = await Comment.findByPk(commentId);
    if (comment) {
      await comment.removeLiker(userId);
    }
    return Comment.findByPk(commentId, { include: ['author', 'likers'] });
  }
};

export { User, Community, Post, Comment, sequelize };
