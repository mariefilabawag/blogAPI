const Comment = require('../models/Comment');

// Get all comments
exports.getCommentsByBlogPostId = async (req, res) => {
    try {
        const comments = await Comment.find({ blogPost: req.params.blogPostId }).populate('author', 'username email');
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new comment
exports.createComment = async (req, res) => {
    try {
        const comment = new Comment({
            content: req.body.content,
            author: req.user.id,
            blogPost: req.body.blogPostId
        });
        const newComment = await comment.save();
        res.status(201).json(newComment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update comment
exports.updateComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check if the authenticated user is the author or an admin
        if (comment.author.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized to perform this action' });
        }
        
        comment.content = req.body.content;
        const updatedComment = await comment.save();
        res.json(updatedComment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete comment
exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check if the authenticated user is the author or an admin
        if (comment.author.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized to perform this action' });
        }

        await comment.deleteOne();
        res.json({ message: 'Comment deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 