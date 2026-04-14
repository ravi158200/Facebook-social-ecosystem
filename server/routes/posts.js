import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import Post from '../models/Post.js';
import User from '../models/User.js';

const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
  try {
    const { userId, description, picturePath, videoPath, isLive } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.profilePicture,
      picturePath,
      videoPath,
      likes: {},
      isLive: isLive || false,
      comments: []
    });
    
    await newPost.save();
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(201).json(posts);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
});

router.get('/', verifyToken, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

router.get('/:userId/posts', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

router.patch('/:id/like', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

router.patch('/:id/comment', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, comment } = req.body;
    const user = await User.findById(userId);
    const post = await Post.findById(id);

    const newComment = {
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      userPicturePath: user.profilePicture,
      text: comment,
      createdAt: new Date().toISOString()
    };

    post.comments.push(newComment);
    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    
    // Check if user is owner or admin
    if (post.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

export default router;
