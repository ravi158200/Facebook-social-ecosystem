# Facebook Social Ecosystem 🚀

A high-fidelity, production-ready Facebook clone built with the MERN stack. This platform features a robust social graph, real-time-simulated interactions, and a premium modern UI.

## 🌟 Key Features

### 🔐 Authentication & Identity
- **Modern Auth Flow**: Custom Login and Sign-up pages featuring 3D social networking illustrations.
- **Secure Sessions**: JWT-based authentication with persistent user context.
- **Profile Management**: Detailed profile views with tabs for Posts, About, Friends, and Photos.

### 👥 Social Interaction
- **Bilateral Friend System**: Send, accept, reject, or cancel friend requests.
- **Global Directory**: Discover and connect with users across the entire platform.
- **Smart Suggestions**: "People You May Know" algorithm based on platform engagement.
- **Real-time Identity**: Instant navigation to user profiles from anywhere (feed, sidebar, search).

### 🎮 Gaming Hub
- **Play Games**: Integrated mini-games platform.
- **Gaming Video**: Theater-mode video streaming experience.
- **Tournaments**: Join and track competitive gaming events.

### 📱 Premium UI/UX
- **Dynamic Navbar**: Responsive search, localized navigation, and a feature-rich profile dropdown.
- **Rich Aesthetics**: Vibrant colors (#0866FF), smooth gradients, and micro-animations.
- **Responsive Design**: Optimized for all screen sizes from mobile to wide desktops.

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, Lucide React, Axios.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Icons & Graphics**: Lucide-React & Custom 3D Vector Assets.

## 📂 Project Structure

- `/client`: React frontend (Vite).
- `/server`: Node.js/Express backend API.

## 🚀 Getting Started

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   ```
2. **Install Dependencies**:
   ```bash
   # Root
   cd client && npm install
   cd ../server && npm install
   ```
3. **Environment Setup**:
   Create a `.env` file in the `/server` directory:
   ```env
   PORT=5000
   MONGO_URL=<your-mongodb-uri>
   JWT_SECRET=<your-secret>
   ```
4. **Run Application**:
   ```bash
   # Start Server
   cd server && npm run dev
   # Start Client
   cd client && npm run dev
   ```

## 📸 Screenshots

- **Login Page**
![Login](./screenshots/login.png)

- **Home Feed**
![Home Feed](./screenshots/home.png)

- **User Profile**
![Profile](./screenshots/profile.png)

- **Friends Directory**
![Friends Directory](./screenshots/friends.png)

---
Developed with ❤️ by [ravi158200](https://github.com/ravi158200)
