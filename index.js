const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const corsOptions = {
    origin: [
        "http://localhost:3000",
        "http://localhost:8000",
        "https://blogapi-4jov.onrender.com",
        "blog-client-seven-omega.vercel.app",
        "blog-client-git-master-mariefils-projects.vercel.app",
        "blog-client-edxz388d2-mariefils-projects.vercel.app"
    ],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas.'));

app.get('/', (req, res) => {
    res.send('Blog API is running!');
});

const userRoutes = require('./routes/user');
const blogRoutes = require('./routes/blog');
const commentRoutes = require('./routes/comment');

app.use('/users', userRoutes);
app.use('/blogs', blogRoutes);
app.use('/comments', commentRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { app, mongoose };