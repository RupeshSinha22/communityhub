import express from 'express';
import {
  createComment,
  getPostComments,
  getComment,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment
} from '../controllers/comment.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', authenticate, createComment);
router.get('/post/:postId', getPostComments);
router.get('/:commentId', getComment);
router.patch('/:commentId', authenticate, updateComment);
router.delete('/:commentId', authenticate, deleteComment);
router.post('/:commentId/like', authenticate, likeComment);
router.delete('/:commentId/like', authenticate, unlikeComment);

export default router;
