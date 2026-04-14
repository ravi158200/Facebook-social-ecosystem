import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import User from '../models/User.js';
import Post from '../models/Post.js';

const router = express.Router();

router.get('/all', verifyToken, async (req, res) => {
  try {
    const users = await User.find().select('firstName lastName profilePicture occupation location createdAt');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/search', verifyToken, async (req, res) => {
  try {
    const { q } = req.query;
    const users = await User.find({
      $or: [
        { firstName: { $regex: q, $options: 'i' } },
        { lastName: { $regex: q, $options: 'i' } }
      ]
    }).select('-password').limit(10);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

router.get('/:id/friends', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, profilePicture }) => {
        return { _id, firstName, lastName, occupation, location, profilePicture };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

router.patch('/:id/update', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    // Basic protection: only self or admin
    if (req.user.id !== id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized to update this profile" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    ).select('-password');
    
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id/requests', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const requests = await Promise.all(
      user.friendRequests.map((rid) => User.findById(rid))
    );
    const formattedRequests = requests.map(
      ({ _id, firstName, lastName, occupation, location, profilePicture }) => {
        return { _id, firstName, lastName, occupation, location, profilePicture };
      }
    );
    res.status(200).json(formattedRequests);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

router.patch('/:id/request/:friendId', verifyToken, async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);
    
    // Initialize arrays if they don't exist
    if (!friend.friendRequests) friend.friendRequests = [];
    if (!user.sentRequests) user.sentRequests = [];
    if (!friend.friends) friend.friends = [];
    if (!user.friends) user.friends = [];
    
    // Add to friend's incoming and user's outgoing
    if (!friend.friendRequests.includes(id) && !friend.friends.includes(id)) {
       friend.friendRequests.push(id);
       user.sentRequests.push(friendId);
       await friend.save();
       await user.save();
    }
    res.status(200).json({ message: "Friend request sent" });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

router.patch('/:id/cancel/:friendId', verifyToken, async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);
    
    if (!user.sentRequests) user.sentRequests = [];
    if (!friend.friendRequests) friend.friendRequests = [];

    user.sentRequests = user.sentRequests.filter(rid => rid !== friendId);
    friend.friendRequests = friend.friendRequests.filter(rid => rid !== id);
    
    await user.save();
    await friend.save();
    res.status(200).json({ message: "Friend request cancelled" });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

router.patch('/:id/accept/:friendId', verifyToken, async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (!user.friendRequests) user.friendRequests = [];
    if (!friend.sentRequests) friend.sentRequests = [];
    if (!user.friends) user.friends = [];
    if (!friend.friends) friend.friends = [];

    if (user.friendRequests.includes(friendId)) {
        user.friendRequests = user.friendRequests.filter(rid => rid !== friendId);
        friend.sentRequests = friend.sentRequests.filter(rid => rid !== id);
        
        user.friends.push(friendId);
        friend.friends.push(id);
        
        await user.save();
        await friend.save();
    }
    res.status(200).json({ message: "Friend request accepted" });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

router.patch('/:id/reject/:friendId', verifyToken, async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);
    
    if (!user.friendRequests) user.friendRequests = [];
    if (!friend.sentRequests) friend.sentRequests = [];

    user.friendRequests = user.friendRequests.filter(rid => rid !== friendId);
    friend.sentRequests = friend.sentRequests.filter(rid => rid !== id);
    
    await user.save();
    await friend.save();
    res.status(200).json({ message: "Friend request rejected" });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

router.patch('/:id/friend/:friendId', verifyToken, async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    // This now only handles UNFRIENDING
    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((fid) => fid !== friendId);
      friend.friends = friend.friends.filter((fid) => fid !== id);
      await user.save();
      await friend.save();
    }
    
    res.status(200).json(user.friends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

router.patch('/:id/block', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.status(200).json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`, isBlocked: user.isBlocked });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    await Post.deleteMany({ userId: id });
    res.status(200).json({ message: "User and their posts deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
