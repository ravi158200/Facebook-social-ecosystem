import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Users, Bookmark, MonitorPlay, Calendar, Clock, ShieldCheck, Store } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="p-4 w-[300px] hidden xl:block overflow-y-auto h-[calc(100vh-60px)] sticky top-[60px]">
      <div 
        onClick={() => navigate(`/profile/${user._id}`)}
        className={`flex items-center gap-3 p-2 hover:bg-gray-200 rounded-xl cursor-pointer transition-all ${isActive(`/profile/${user._id}`) ? 'bg-gray-200 shadow-sm' : ''}`}
      >
        <img src={user.profilePicture ? `http://localhost:5000/assets/${user.profilePicture}` : 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'} alt="" className="w-9 h-9 rounded-full object-cover border border-gray-100 shadow-sm" />
        <span className="font-bold text-[15px] text-gray-800">{user.firstName} {user.lastName}</span>
      </div>

      <div 
        onClick={() => navigate('/friends')}
        className={`flex items-center gap-3 p-3 hover:bg-gray-200 rounded-xl cursor-pointer transition-all ${isActive('/friends') ? 'bg-gray-200' : ''}`}
      >
        <div className="bg-blue-500/10 p-1.5 rounded-full"><Users className="text-blue-500 w-6 h-6" /></div>
        <span className="font-bold text-[15px] text-gray-800">Friends</span>
      </div>

      <div 
        onClick={() => navigate('/watch')}
        className={`flex items-center gap-3 p-3 hover:bg-gray-200 rounded-xl cursor-pointer transition-all ${isActive('/watch') ? 'bg-gray-200' : ''}`}
      >
        <div className="bg-blue-400/10 p-1.5 rounded-full"><MonitorPlay className="text-blue-500 w-6 h-6" /></div>
        <span className="font-bold text-[15px] text-gray-800">Watch</span>
      </div>

      <div 
        onClick={() => navigate('/store')}
        className={`flex items-center gap-3 p-3 hover:bg-gray-200 rounded-xl cursor-pointer transition-all ${isActive('/store') ? 'bg-gray-200' : ''}`}
      >
        <div className="bg-blue-600/10 p-1.5 rounded-full"><Store className="text-blue-600 w-6 h-6" /></div>
        <span className="font-bold text-[15px] text-gray-800">Marketplace</span>
      </div>

      <div className="flex items-center gap-3 p-3 hover:bg-gray-200 rounded-xl cursor-pointer group">
         <div className="bg-purple-500/10 p-1.5 rounded-full"><Bookmark className="text-purple-500 w-6 h-6" /></div>
         <span className="font-bold text-[15px] text-gray-800">Saved</span>
      </div>

      <div className="flex items-center gap-3 p-3 hover:bg-gray-200 rounded-xl cursor-pointer group">
         <div className="bg-red-500/10 p-1.5 rounded-full"><Calendar className="text-red-500 w-6 h-6" /></div>
         <span className="font-bold text-[15px] text-gray-800">Events</span>
      </div>

      <div className="flex items-center gap-3 p-3 hover:bg-gray-200 rounded-xl cursor-pointer group">
         <div className="bg-blue-400/10 p-1.5 rounded-full"><Clock className="text-blue-400 w-6 h-6" /></div>
         <span className="font-bold text-[15px] text-gray-800">Memories</span>
      </div>

      {user?.isAdmin && (
        <div 
          onClick={() => navigate('/admin')}
          className={`flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl cursor-pointer border border-blue-100 mt-2 ${isActive('/admin') ? 'bg-blue-100' : ''}`}
        >
          <ShieldCheck className="text-facebookBlue w-8 h-8" />
          <span className="font-bold text-[15px] text-facebookBlue">Admin Dashboard</span>
        </div>
      )}
      
      <hr className="my-4 border-gray-300" />
      <h3 className="text-gray-500 font-semibold mb-2 px-3">Your shortcuts</h3>
      
      <div className="flex items-center gap-3 p-3 hover:bg-gray-200 rounded-xl cursor-pointer group">
         <div className="w-8 h-8 bg-facebookBlue rounded-md flex items-center justify-center text-white text-xs font-bold">FB</div>
         <span className="font-semibold text-[15px]">Facebook Reality</span>
      </div>
    </div>
  );
};
export default Sidebar;
