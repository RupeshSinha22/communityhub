import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().min(2).required(),
  lastName: Joi.string().min(2).required(),
  username: Joi.string().min(3).max(20).required()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const createCommunitySchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  description: Joi.string().min(10).max(500).required(),
  category: Joi.string().required(),
  isPrivate: Joi.boolean().default(false)
});

export const createPostSchema = Joi.object({
  content: Joi.string().min(1).max(5000).required(),
  communityId: Joi.string().uuid().required(),
  attachments: Joi.array().items(Joi.string()).optional()
});

export const updateUserSchema = Joi.object({
  firstName: Joi.string().min(2).optional(),
  lastName: Joi.string().min(2).optional(),
  bio: Joi.string().max(500).optional(),
  avatar: Joi.string().uri().optional()
});
