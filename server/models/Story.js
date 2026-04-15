import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  userPicturePath: String,
  picturePath: String,
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 24*60*60*1000), // 24 hours from now
    index: { expires: 0 }, // Auto-delete after 24 hours
  }
}, { timestamps: true });

const Story = mongoose.model('Story', storySchema);
export default Story;
