import express from 'express';
import Story from '../models/Story.js';
import User from '../models/User.js';
import { verifyToken } from '../middleware/auth.js';
import mongoose from 'mongoose';

const router = express.Router();

/* CREATE STORY */
router.post('/', verifyToken, async (req, res) => {
  try {
    const { userId, picturePath } = req.body;
    if (!userId || !picturePath) {
      return res.status(400).json({ error: "Missing userId or picturePath" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const newStory = new Story({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      userPicturePath: user.profilePicture,
      picturePath,
    });
    
    await newStory.save();
    res.status(201).json(newStory);
  } catch (err) {
    console.error("Story creation error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* GET FEED STORIES (User + Friends) */
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    const friendIds = user.friends || [];
    const allIds = [userId, ...friendIds];
    
    // Get latest story from each user in the list
    const stories = await Story.aggregate([
      { 
        $match: { 
          userId: { 
            $in: allIds.filter(id => id).map(id => new mongoose.Types.ObjectId(String(id))) 
          } 
        } 
      },
      { $sort: { createdAt: -1 } },
      { $group: {
          _id: "$userId",
          latestStory: { $first: "$$ROOT" }
      }},
      { $replaceRoot: { newRoot: "$latestStory" } },
      { $sort: { createdAt: -1 } }
    ]);
    
    res.status(200).json(stories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
