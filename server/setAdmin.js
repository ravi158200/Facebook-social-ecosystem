import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const email = 'raviraj7301325@gmail.com';
    const user = await User.findOneAndUpdate({ email }, { isAdmin: true }, { new: true });
    if (user) {
      console.log(`Success! User ${email} is now an ADMIN.`);
    } else {
      console.log(`Error: User with email ${email} not found.`);
    }
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.disconnect();
  }
};

makeAdmin();
