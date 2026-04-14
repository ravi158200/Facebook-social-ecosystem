import express from 'express';
import Conversation from '../models/Conversation.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// New conversation
router.post("/", verifyToken, async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    // Check if conversation already exists
    const existing = await Conversation.findOne({
      members: { $all: [req.body.senderId, req.body.receiverId] }
    });
    if (existing) return res.status(200).json(existing);

    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get user's conversations
router.get("/:userId", verifyToken, async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    }).sort({ updatedAt: -1 });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get conversation by two IDs
router.get("/find/:firstUserId/:secondUserId", verifyToken, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
