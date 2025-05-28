const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment');
const { verify, verifyAdmin, isAuthor } = require('../auth');

router.get('/blogPost/:blogPostId', commentController.getCommentsByBlogPostId);

router.post('/', verify, commentController.createComment);
router.put('/:id', verify, commentController.updateComment);
router.delete('/:id', verify, commentController.deleteComment);

router.delete('/admin/:id', verify, verifyAdmin, commentController.deleteComment);

module.exports = router; 