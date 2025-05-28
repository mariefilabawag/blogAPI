const jwt = require("jsonwebtoken");
require('dotenv').config();

module.exports.createAccessToken = (user) => {
    const data = {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin
    };
    return jwt.sign(data, process.env.JWT_SECRET, {});
};

module.exports.verify = (req, res, next) => {
    let token = req.headers.authorization;
    if (typeof token === "undefined") {
        return res.status(401).send({ auth: "Failed. No Token" });
    } else {
        token = token.slice(7, token.length);
        jwt.verify(token, process.env.JWT_SECRET, function (err, decodedToken) {
            if (err) {
                return res.status(403).send({
                    auth: "Failed",
                    message: err.message
                });
            } else {
                req.user = decodedToken; 
                next();
            }
        });
    }
};

module.exports.verifyAdmin = (req, res, next) => {
    if(req.user.isAdmin){
        next();
    } else {
        return res.status(403).send({
            auth: "Failed",
            message: "Action Forbidden"
        })
    }
}

module.exports.errorHandler = (err, req, res, next) => {
    console.error(err);
    const statusCode = err.status || 500;
    const errorMessage = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        error: {
            message: errorMessage,
            errorCode: err.code || 'SERVER_ERROR',
            details: err.details || null
        }
    });
};

module.exports.isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
};

module.exports.isAuthor = async (req, res, next) => {
    try {
        const Blog = require('../models/Blog');
        const Comment = require('../models/Comment');
        
        const blog = await Blog.findById(req.params.id);
        const comment = await Comment.findById(req.params.id);
        
        if (blog) {
            if (blog.author.toString() === req.user.id || req.user.isAdmin) {
                next();
            } else {
                return res.status(403).json({ message: 'Not authorized to perform this action' });
            }
        } else if (comment) {
            if (comment.author.toString() === req.user.id || req.user.isAdmin) {
                next();
            } else {
                return res.status(403).json({ message: 'Not authorized to perform this action' });
            }
        } else {
            return res.status(404).json({ message: 'Resource not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


