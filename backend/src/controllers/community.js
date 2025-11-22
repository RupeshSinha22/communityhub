import { CommunityModel, UserModel } from '../models/index.js';
import { createCommunitySchema } from '../utils/validation.js';

export const createCommunity = async (req, res, next) => {
  try {
    const { error, value } = createCommunitySchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const community = await CommunityModel.create({
      ...value,
      createdBy: req.userId,
      moderators: [req.userId]
    });

    res.status(201).json({
      message: 'Community created successfully',
      community
    });
  } catch (error) {
    next(error);
  }
};

export const getCommunity = async (req, res, next) => {
  try {
    const community = CommunityModel.findById(req.params.communityId);
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    res.json({ community });
  } catch (error) {
    next(error);
  }
};

export const getAllCommunities = async (req, res, next) => {
  try {
    const communities = CommunityModel.findAll();
    res.json({ communities });
  } catch (error) {
    next(error);
  }
};

export const getMyCommunities = async (req, res, next) => {
  try {
    const communities = CommunityModel.findByUserId(req.userId);
    res.json({ communities });
  } catch (error) {
    next(error);
  }
};

export const joinCommunity = async (req, res, next) => {
  try {
    const community = CommunityModel.findById(req.params.communityId);
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    if (community.members.includes(req.userId)) {
      return res.status(400).json({ error: 'Already a member' });
    }

    CommunityModel.addMember(req.params.communityId, req.userId);

    res.json({
      message: 'Joined community successfully',
      community
    });
  } catch (error) {
    next(error);
  }
};

export const leaveCommunity = async (req, res, next) => {
  try {
    const community = CommunityModel.findById(req.params.communityId);
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    CommunityModel.removeMember(req.params.communityId, req.userId);

    res.json({
      message: 'Left community successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const updateCommunity = async (req, res, next) => {
  try {
    const community = CommunityModel.findById(req.params.communityId);
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    if (community.createdBy !== req.userId) {
      return res.status(403).json({ error: 'Only community creator can update' });
    }

    const updated = CommunityModel.update(req.params.communityId, req.body);
    res.json({
      message: 'Community updated successfully',
      community: updated
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCommunity = async (req, res, next) => {
  try {
    const community = CommunityModel.findById(req.params.communityId);
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    if (community.createdBy !== req.userId) {
      return res.status(403).json({ error: 'Only community creator can delete' });
    }

    CommunityModel.delete(req.params.communityId);
    res.json({ message: 'Community deleted successfully' });
  } catch (error) {
    next(error);
  }
};
