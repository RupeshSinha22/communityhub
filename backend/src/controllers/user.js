import { UserModel } from '../models/index.js';
import { updateUserSchema } from '../utils/validation.js';
import { uploadProfilePic as minioUpload, deleteProfilePic } from '../config/minio.js';

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.params.userId === 'me' ? req.userId : req.params.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = user.toJSON ? user.toJSON() : user;

    res.json({
      data: {
        user: {
          id: userData.id,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          username: userData.username,
          avatar: userData.avatar,
          bio: userData.bio,
          profilePic: userData.profilePic,
          createdAt: userData.createdAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { error, value } = updateUserSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    await UserModel.update(req.userId, value);
    const user = await UserModel.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = user.toJSON ? user.toJSON() : user;

    res.json({
      data: {
        message: 'Profile updated successfully',
        user: {
          id: userData.id,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          username: userData.username,
          avatar: userData.avatar,
          bio: userData.bio,
          profilePic: userData.profilePic
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const uploadProfilePic = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete old profile picture if exists
    if (user.profilePic) {
      try {
        // Extract object name from URL: https://play.min.io/bucket/profile-pics/userId-timestamp
        const urlParts = user.profilePic.split('/');
        const objectName = urlParts.slice(-2).join('/'); // "profile-pics/userId-timestamp"
        await deleteProfilePic(objectName);
      } catch (err) {
        console.error('Error deleting old profile pic:', err);
        // Continue anyway
      }
    }

    // Upload new profile picture
    const fileUrl = await minioUpload(req.file.buffer, req.userId, req.file.mimetype);

    // Update user with new profile pic URL
    user.profilePic = fileUrl;
    await user.save();

    const userData = user.toJSON ? user.toJSON() : user;

    res.json({
      data: {
        message: 'Profile picture uploaded successfully',
        user: {
          id: userData.id,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          username: userData.username,
          avatar: userData.avatar,
          bio: userData.bio,
          profilePic: userData.profilePic
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await UserModel.findAll();
    res.json({
      data: {
        users: users.map(u => {
          const userData = u.toJSON ? u.toJSON() : u;
          return {
            id: userData.id,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            username: userData.username,
            avatar: userData.avatar,
            profilePic: userData.profilePic
          };
        })
      }
    });
  } catch (error) {
    next(error);
  }
};
