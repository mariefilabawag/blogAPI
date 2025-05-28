const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog');
const { verify, verifyAdmin, isAuthor } = require('../auth');

router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);

router.post('/', verify, blogController.createBlog);
router.patch('/:id', verify, blogController.updateBlog);
router.delete('/:id', verify, blogController.deleteBlog);

router.delete('/admin/:id', verify, verifyAdmin, blogController.deleteBlog);

module.exports = router; 