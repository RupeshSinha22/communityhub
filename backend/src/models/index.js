import sequelize from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';
import User from './User.js';
import Community from './Community.js';
import Post from './Post.js';

// Initialize models
const models = {
  User,
  Community,
  Post,
};

// Define associations
User.hasMany(Community, { foreignKey: 'createdBy', as: 'communities' });
Community.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

User.hasMany(Post, { foreignKey: 'authorId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

Community.hasMany(Post, { foreignKey: 'communityId', as: 'posts' });
Post.belongsTo(Community, { foreignKey: 'communityId', as: 'community' });

// Many-to-many: Users and Communities
User.belongsToMany(Community, { through: 'CommunityMembers', as: 'joinedCommunities' });
Community.belongsToMany(User, { through: 'CommunityMembers', as: 'members' });

// Many-to-many: Posts and Likes
User.belongsToMany(Post, { through: 'PostLikes', as: 'likedPosts' });
Post.belongsToMany(User, { through: 'PostLikes', as: 'likers' });

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

export const CommunityModel = {
  create: (data) => {
    const community = {
      id: uuidv4(),
      ...data,
      members: [data.createdBy],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockCommunities.set(community.id, community);
    return community;
  },

  findById: (id) => mockCommunities.get(id) || null,

  findAll: () => Array.from(mockCommunities.values()),

  findByUserId: (userId) => {
    const communities = [];
    for (const community of mockCommunities.values()) {
      if (community.members.includes(userId)) {
        communities.push(community);
      }
    }
    return communities;
  },

  update: (id, data) => {
    const community = mockCommunities.get(id);
    if (!community) return null;
    const updated = { ...community, ...data, updatedAt: new Date().toISOString() };
    mockCommunities.set(id, updated);
    return updated;
  },

  delete: (id) => mockCommunities.delete(id),

  addMember: (communityId, userId) => {
    const community = mockCommunities.get(communityId);
    if (community && !community.members.includes(userId)) {
      community.members.push(userId);
      community.updatedAt = new Date().toISOString();
    }
    return community;
  },

  removeMember: (communityId, userId) => {
    const community = mockCommunities.get(communityId);
    if (community) {
      community.members = community.members.filter(id => id !== userId);
      community.updatedAt = new Date().toISOString();
    }
    return community;
  }
};

export const PostModel = {
  create: (data) => {
    const post = {
      id: uuidv4(),
      ...data,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockPosts.set(post.id, post);
    return post;
  },

  findById: (id) => mockPosts.get(id) || null,

  findByCommunity: (communityId) => {
    const posts = [];
    for (const post of mockPosts.values()) {
      if (post.communityId === communityId) {
        posts.push(post);
      }
    }
    return posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  findByUser: (userId) => {
    const posts = [];
    for (const post of mockPosts.values()) {
      if (post.authorId === userId) {
        posts.push(post);
      }
    }
    return posts;
  },

  findAll: () => Array.from(mockPosts.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),

  update: (id, data) => {
    const post = mockPosts.get(id);
    if (!post) return null;
    const updated = { ...post, ...data, updatedAt: new Date().toISOString() };
    mockPosts.set(id, updated);
    return updated;
  },

  delete: (id) => mockPosts.delete(id),

  addLike: (postId, userId) => {
    const post = mockPosts.get(postId);
    if (post && !post.likes.includes(userId)) {
      post.likes.push(userId);
      post.updatedAt = new Date().toISOString();
    }
    return post;
  },

  removeLike: (postId, userId) => {
    const post = mockPosts.get(postId);
    if (post) {
      post.likes = post.likes.filter(id => id !== userId);
      post.updatedAt = new Date().toISOString();
    }
    return post;
  }
};

export { User, Community, Post, sequelize };
