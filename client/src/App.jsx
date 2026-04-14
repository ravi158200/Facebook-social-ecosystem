import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Friends from './pages/Friends';
import Watch from './pages/Watch';
import Store from './pages/Store';
import Admin from './pages/Admin';
import Notifications from './pages/Notifications';
import Messages from './pages/Messages';
import SettingsPage from './pages/SettingsPage';
import Gaming from './pages/Gaming';
import Navbar from './components/Navbar';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <div className="min-h-screen bg-backgroundGray">
        {user && <Navbar />}
        <Routes>
          <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="/profile/:userId" element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/friends" element={user ? <Friends /> : <Navigate to="/login" />} />
          <Route path="/watch" element={user ? <Watch /> : <Navigate to="/login" />} />
          <Route path="/store" element={user ? <Store /> : <Navigate to="/login" />} />
          <Route path="/notifications" element={user ? <Notifications /> : <Navigate to="/login" />} />
          <Route path="/messages" element={user ? <Messages /> : <Navigate to="/login" />} />
          <Route path="/settings" element={user ? <SettingsPage /> : <Navigate to="/login" />} />
          <Route path="/gaming" element={user ? <Gaming /> : <Navigate to="/login" />} />
          <Route path="/admin" element={user?.isAdmin ? <Admin /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
