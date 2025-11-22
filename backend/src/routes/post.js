import express from 'express';
import {
  createPost,
  getPost,
  getCommunityPosts,
  getFeedPosts,
  updatePost,
  deletePost,
  likePost,
  unlikePost
} from '../controllers/post.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.get('/feed', authenticate, getFeedPosts);
router.post('/', authenticate, createPost);
router.get('/:postId', getPost);
router.patch('/:postId', authenticate, updatePost);
router.delete('/:postId', authenticate, deletePost);
router.post('/:postId/like', authenticate, likePost);
router.delete('/:postId/like', authenticate, unlikePost);
router.get('/community/:communityId', getCommunityPosts);

export default router;
