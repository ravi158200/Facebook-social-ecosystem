import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import uploadRoutes from './routes/upload.js';
import conversationRoutes from './routes/conversations.js';
import messageRoutes from './routes/messages.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cors());

// Serve static files for images
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);

// Mongoose Setup
const PORT = process.env.PORT || 5000;
import User from './models/User.js';

mongoose.connect(process.env.MONGO_URI).then(async () => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT} and DB is connected!`));
    
    // Auto-promote requested user to Admin
    try {
      await User.findOneAndUpdate({ email: 'raviraj7301325@gmail.com' }, { isAdmin: true });
      console.log("Admin privileges synced for raviraj7301325@gmail.com");
    } catch (err) {
      console.log("Admin sync failed", err.message);
    }
}).catch((error) => {
    console.log("Database connection error details:");
    console.error(error);
});
