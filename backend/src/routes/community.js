import express from 'express';
import {
  createCommunity,
  getCommunity,
  getAllCommunities,
  getMyCommunities,
  joinCommunity,
  leaveCommunity,
  updateCommunity,
  deleteCommunity
} from '../controllers/community.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getAllCommunities);
router.post('/', authenticate, createCommunity);
router.get('/my', authenticate, getMyCommunities);
router.get('/:communityId', getCommunity);
router.patch('/:communityId', authenticate, updateCommunity);
router.delete('/:communityId', authenticate, deleteCommunity);
router.post('/:communityId/join', authenticate, joinCommunity);
router.post('/:communityId/leave', authenticate, leaveCommunity);

export default router;
