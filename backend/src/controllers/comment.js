import { CommentModel, PostModel } from '../models/index.js';

export const createComment = async (req, res, next) => {
  try {
    const { postId, content, parentCommentId } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Comment content cannot be empty' });
    }

    // Verify post exists
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // If it's a reply, verify parent comment exists
    if (parentCommentId) {
      const parentComment = await CommentModel.findById(parentCommentId);
      if (!parentComment) {
        return res.status(404).json({ error: 'Parent comment not found' });
      }
    }

    const comment = await CommentModel.create({
      content,
      postId,
      authorId: req.userId,
      parentCommentId: parentCommentId || null
    });

    const fullComment = await CommentModel.findById(comment.id);

    res.status(201).json({
      message: 'Comment created successfully',
      comment: fullComment
    });
  } catch (error) {
    next(error);
  }
};

export const getPostComments = async (req, res, next) => {
  try {
    const comments = await CommentModel.findByPost(req.params.postId);
    res.json({ comments });
  } catch (error) {
    next(error);
  }
};

export const getComment = async (req, res, next) => {
  try {
    const comment = await CommentModel.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.json({ comment });
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Comment content cannot be empty' });
    }

    const comment = await CommentModel.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.authorId !== req.userId) {
      return res.status(403).json({ error: 'Can only edit your own comments' });
    }

    await CommentModel.update(req.params.commentId, { content });
    const updated = await CommentModel.findById(req.params.commentId);

    res.json({
      message: 'Comment updated successfully',
      comment: updated
    });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await CommentModel.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.authorId !== req.userId) {
      return res.status(403).json({ error: 'Can only delete your own comments' });
    }

    await CommentModel.delete(req.params.commentId);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const likeComment = async (req, res, next) => {
  try {
    const comment = await CommentModel.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    await CommentModel.addLike(req.params.commentId, req.userId);
    const updated = await CommentModel.findById(req.params.commentId);

    res.json({ message: 'Comment liked successfully', comment: updated });
  } catch (error) {
    next(error);
  }
};

export const unlikeComment = async (req, res, next) => {
  try {
    const comment = await CommentModel.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    await CommentModel.removeLike(req.params.commentId, req.userId);
    const updated = await CommentModel.findById(req.params.commentId);

    res.json({ message: 'Comment unliked successfully', comment: updated });
  } catch (error) {
    next(error);
  }
};
