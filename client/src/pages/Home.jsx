import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import CreatePost from '../components/CreatePost';
import Post from '../components/Post';
import { Plus, Video, Search, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [friends, setFriends] = useState([]);
  const { user, token } = useContext(AuthContext);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/posts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFriends = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/${user._id}/friends`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFriends(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchFriends();
  }, []);

  return (
    <div className="flex justify-center md:justify-between mx-auto max-w-[1600px] w-full bg-backgroundGray min-h-screen">
      <Sidebar />
      <div className="w-full max-w-[680px] p-4 flex flex-col items-center flex-1 shrink-0 gap-4">
        
        {/* Stories Section */}
        <div className="w-full flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {/* Create Story */}
          <div className="min-w-[120px] h-[200px] rounded-xl bg-white shadow-sm border border-gray-100 relative group cursor-pointer overflow-hidden flex-shrink-0">
             <div className="h-[70%] w-full overflow-hidden">
                <img src={user.profilePicture ? `http://localhost:5000/assets/${user.profilePicture}` : 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="" />
             </div>
             <div className="absolute top-[62%] left-1/2 -translate-x-1/2 bg-facebookBlue rounded-full p-1 border-4 border-white">
                <Plus size={24} className="text-white" />
             </div>
             <div className="h-[30%] w-full flex items-end justify-center pb-2">
                <span className="text-xs font-bold text-gray-800">Create story</span>
             </div>
          </div>

          {/* Friend Stories */}
          {friends.map((friend, i) => (
             <div key={i} className="min-w-[120px] h-[200px] rounded-xl bg-gray-200 shadow-sm relative group cursor-pointer overflow-hidden flex-shrink-0">
                <img src={friend.profilePicture ? `http://localhost:5000/assets/${friend.profilePicture}` : 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'} className="w-full h-full object-cover brightness-90 group-hover:scale-110 transition-all duration-500" alt="" />
                <div className="absolute top-3 left-3 w-10 h-10 rounded-full border-4 border-facebookBlue overflow-hidden">
                   <img src={friend.profilePicture ? `http://localhost:5000/assets/${friend.profilePicture}` : 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                   <span className="text-white text-[11px] font-bold drop-shadow-md truncate block">{friend.firstName} {friend.lastName}</span>
                </div>
             </div>
          ))}
        </div>

        <CreatePost onPostCreated={fetchPosts} />
        {posts.map(post => (
          <Post key={post._id} post={post} />
        ))}
      </div>
      <div className="hidden xl:block w-[360px] p-4 sticky top-[60px] h-[calc(100vh-60px)] overflow-y-auto no-scrollbar">
        {/* Sponsored Section */}
        <div className="mb-6 border-b border-gray-200 pb-4">
           <h3 className="text-gray-500 font-bold text-[17px] mb-4">Sponsored</h3>
           <div className="flex items-center gap-4 hover:bg-gray-200/50 p-2 rounded-xl cursor-pointer transition-all mb-4 group">
              <img src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=500&auto=format&fit=crop&q=60" className="w-[120px] h-[68px] rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
              <div>
                 <p className="font-black text-sm text-gray-900 leading-tight">Master Social Marketing</p>
                 <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-1">MarketingPro.com</p>
              </div>
           </div>
           <div className="flex items-center gap-4 hover:bg-gray-200/50 p-2 rounded-xl cursor-pointer transition-all group">
              <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=60" className="w-[120px] h-[68px] rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
              <div>
                 <p className="font-black text-sm text-gray-900 leading-tight">Join the Meta Quest</p>
                 <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-1">VRWorld.io</p>
              </div>
           </div>
        </div>

        {/* Birthdays Section */}
        <div className="mb-6 border-b border-gray-200 pb-4">
           <h3 className="text-gray-500 font-bold text-[17px] mb-4">Birthdays</h3>
           <div className="flex items-center gap-4 p-2 hover:bg-gray-200/50 rounded-xl cursor-pointer group">
              <div className="text-2xl">🎁</div>
              <p className="text-sm text-gray-900 leading-tight">
                <span className="font-black">{friends[0]?.firstName || 'Alex'}</span> and <span className="font-black">2 others</span> have birthdays today.
              </p>
           </div>
        </div>

        <div className="flex justify-between items-center mb-4">
           <h3 className="text-gray-500 font-bold text-[17px]">Contacts</h3>
           <div className="flex gap-2">
              <button className="hover:bg-gray-200 p-2 rounded-full transition-colors text-gray-600"><Video size={16} /></button>
              <button className="hover:bg-gray-200 p-2 rounded-full transition-colors text-gray-600"><Search size={16} /></button>
              <button className="hover:bg-gray-200 p-2 rounded-full transition-colors text-gray-600"><MoreHorizontal size={16} /></button>
           </div>
        </div>
        
        {friends.length > 0 ? (
          <ul className="space-y-0.5">
            {friends.map((friend) => (
              <li 
                key={friend._id} 
                onClick={() => navigate(`/profile/${friend._id}`)}
                className="flex items-center gap-3 p-2 hover:bg-gray-200 rounded-xl cursor-pointer transition-all group"
              >
                <div className="relative shrink-0">
                  <img src={friend.profilePicture ? `http://localhost:5000/assets/${friend.profilePicture}` : 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'} alt="" className="w-9 h-9 rounded-full object-cover shadow-sm border border-white" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <span className="font-black text-sm text-gray-800 tracking-tight group-hover:text-facebookBlue transition-colors">{friend.firstName} {friend.lastName}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="bg-white/50 p-4 rounded-2xl border border-dashed border-gray-300 text-center">
            <p className="text-gray-400 text-[13px] font-bold italic">Add friends to see them active here.</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default Home;
