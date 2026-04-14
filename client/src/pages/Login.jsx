import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 items-center justify-center">
      <div className="flex w-full max-w-[980px] justify-between p-4 flex-col md:flex-row gap-8 items-center">
        {/* Left Side */}
        <div className="flex-1 w-full text-center md:text-left mb-8 md:mb-0">
          <h1 className="text-facebookBlue text-5xl md:text-6xl font-bold mb-4">facebook</h1>
          <p className="text-2xl md:text-3xl text-gray-800 leading-tight">
            Connect with friends and the world around you on Facebook.
          </p>
          <img src="https://static.vecteezy.com/system/resources/previews/009/342/688/original/3d-social-media-platform-with-like-and-chat-icon-png.png" alt="Social Connections" className="w-[80%] max-w-[450px] mt-8 mx-auto md:mx-0 drop-shadow-2xl hover:scale-105 transition-transform duration-500 animate-in fade-in zoom-in delay-150" />
        </div>
        
        {/* Right Side */}
        <div className="flex-1 w-full max-w-[400px]">
          <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-100 border-solid">
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <input 
                type="email" 
                placeholder="Email or phone number" 
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:border-facebookBlue focus:ring-1 focus:ring-facebookBlue"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input 
                type="password" 
                placeholder="Password" 
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:border-facebookBlue focus:ring-1 focus:ring-facebookBlue"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit" className="bg-facebookBlue text-white font-bold text-xl py-3 rounded-md hover:bg-blue-600 transition-colors">
                Log In
              </button>
              <div className="text-center text-facebookBlue text-sm cursor-pointer hover:underline py-2">
                Forgot password?
              </div>
              <hr className="my-2" />
              <div className="text-center mt-2">
                <button type="button" onClick={() => navigate('/register')} className="bg-[#42b72a] text-white font-bold text-lg py-2 px-4 rounded-md hover:bg-[#36a420] transition-colors w-fit mx-auto">
                  Create new account
                </button>
              </div>
            </form>
          </div>
          <div className="text-center text-sm mt-6">
            <p><span className="font-bold cursor-pointer hover:underline">Create a Page</span> for a celebrity, brand or business.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
