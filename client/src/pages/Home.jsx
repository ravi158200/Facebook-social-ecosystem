import { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import CreatePost from '../components/CreatePost';
import Post from '../components/Post';
import Avatar from '../components/Avatar';
import { Plus, Video, Search, MoreHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [friends, setFriends] = useState([]);
  const [stories, setStories] = useState([]);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(null);
  const { user, token } = useContext(AuthContext);
  const fileInputRef = useRef(null);

  if (!user) return null;

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

  const fetchStories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/stories', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStoryUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("picture", file);
      const uploadRes = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await axios.post('http://localhost:5000/api/stories', {
        userId: user._id,
        picturePath: uploadRes.data.filename
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchStories();
      alert("Story shared successfully!");
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.error || "Failed to share story";
      alert(errorMsg);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchFriends();
    fetchStories();
  }, []);

  return (
    <div className="flex justify-center md:justify-between mx-auto max-w-[1600px] w-full bg-backgroundGray min-h-screen">
      <Sidebar />
      <div className="w-full max-w-[680px] p-4 flex flex-col items-center flex-1 shrink-0 gap-4">
        
        {/* Stories Section */}
        <div className="w-full flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {/* Create Story */}
          <div 
            onClick={() => fileInputRef.current.click()}
            className="min-w-[120px] h-[200px] rounded-xl bg-white shadow-sm border border-gray-100 relative group cursor-pointer overflow-hidden flex-shrink-0"
          >
             <input type="file" hidden ref={fileInputRef} onChange={handleStoryUpload} accept="image/*" />
             <div className="h-[70%] w-full overflow-hidden">
                <Avatar
                  picturePath={user.profilePicture}
                  firstName={user.firstName}
                  lastName={user.lastName}
                  size={120}
                  style={{ width: '100%', height: '100%', borderRadius: 0 }}
                />
             </div>
             <div className="absolute top-[62%] left-1/2 -translate-x-1/2 bg-facebookBlue rounded-full p-1 border-4 border-white">
                <Plus size={24} className="text-white" />
             </div>
             <div className="h-[30%] w-full flex items-end justify-center pb-2">
                <span className="text-xs font-bold text-gray-800">Create story</span>
             </div>
          </div>

          {/* Dynamic Stories */}
          {(() => {
            const myStory = stories.find(s => s.userId === user._id);
            const otherStories = stories.filter(s => s.userId !== user._id);
            const orderedStories = myStory ? [myStory, ...otherStories] : otherStories;

            return orderedStories.map((story, i) => (
              <div 
                key={story._id} 
                onClick={() => setSelectedStoryIndex(i)}
                className="min-w-[120px] h-[200px] rounded-xl bg-gray-900 shadow-sm relative group cursor-pointer overflow-hidden flex-shrink-0"
              >
                 <img 
                   src={`http://localhost:5000/assets/${story.picturePath}`} 
                   className="w-full h-full object-cover brightness-90 group-hover:scale-110 transition-all duration-500" 
                   alt="" 
                 />
                 <div className="absolute top-3 left-3">
                   <Avatar
                     picturePath={story.userPicturePath}
                     firstName={story.firstName}
                     lastName={story.lastName}
                     size={40}
                     ring={true}
                   />
                 </div>
                 <div className="absolute bottom-2 left-2 right-2">
                    <span className="text-white text-[11px] font-bold drop-shadow-md truncate block">
                      {story.userId === user._id ? 'Your story' : `${story.firstName} ${story.lastName}`}
                    </span>
                 </div>
              </div>
            ));
          })()}
        </div>

        <CreatePost onPostCreated={fetchPosts} />
        {posts.map(post => (
          <Post key={post._id} post={post} />
        ))}
      </div>

      {/* Right Sidebar */}
      <div className="hidden xl:block w-[360px] p-4 sticky top-[60px] h-[calc(100vh-60px)] overflow-y-auto no-scrollbar focus:outline-none">
        {/* Sponsord Section */}
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
                  <Avatar
                    picturePath={friend.profilePicture}
                    firstName={friend.firstName}
                    lastName={friend.lastName}
                    size={36}
                  />
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

      {/* Story Viewer Modal */}
      {selectedStoryIndex !== null && (
        <StoryViewer 
          stories={stories} 
          index={selectedStoryIndex} 
          setIndex={setSelectedStoryIndex} 
          onClose={() => setSelectedStoryIndex(null)} 
        />
      )}
    </div>
  );
};

/* Extracted StoryViewer Component for better state management */
const StoryViewer = ({ stories, index, setIndex, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (index < stories.length - 1) {
        setIndex(index + 1);
      } else {
        onClose();
      }
    }, 5000); // 5 seconds per story

    return () => clearTimeout(timer);
  }, [index, stories.length, setIndex, onClose]);

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center">
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:bg-white/20 p-2 rounded-full transition-colors z-[210] shadow-lg"
      >
        <X size={36} />
      </button>

      <div className="relative w-full max-w-[450px] h-full sm:h-[90vh] bg-gray-900 sm:rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center border border-white/10">
        {/* Story Image */}
        <img 
          src={`http://localhost:5000/assets/${stories[index].picturePath}`} 
          className="w-full h-full object-contain select-none"
          alt="Story"
        />

        {/* Top Info Bar */}
        <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/80 to-transparent flex items-center gap-3 z-20">
          <Avatar
            picturePath={stories[index].userPicturePath}
            firstName={stories[index].firstName}
            lastName={stories[index].lastName}
            size={44}
          />
          <div className="text-white drop-shadow-md">
            <p className="font-bold text-[16px]">{stories[index].firstName} {stories[index].lastName}</p>
            <p className="text-[12px] opacity-70 flex items-center gap-1">
              {new Date(stories[index].createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="absolute inset-0 flex items-center justify-between px-4 z-10">
          <button 
            onClick={(e) => { e.stopPropagation(); if (index > 0) setIndex(index - 1); }}
            className={`bg-white/10 hover:bg-white/25 text-white p-3 rounded-full transition-all backdrop-blur-md ${index === 0 ? 'opacity-0 cursor-default' : 'opacity-100'}`}
            disabled={index === 0}
          >
            <ChevronLeft size={28} />
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); if (index < stories.length - 1) setIndex(index + 1); else onClose(); }}
            className="bg-white/10 hover:bg-white/25 text-white p-3 rounded-full transition-all backdrop-blur-md"
          >
            <ChevronRight size={28} />
          </button>
        </div>

        {/* Progress Bars */}
        <div className="absolute top-2 left-4 right-4 flex gap-1.5 h-1 z-30">
          {stories.map((_, i) => (
            <div key={i} className="flex-1 h-full bg-white/20 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-white transition-all ${i < index ? 'w-full' : i === index ? 'animate-story-progress' : 'w-0'}`}
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes story-progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-story-progress {
          animation: story-progress 5s linear forwards;
        }
      `}</style>
    </div>
  );
};

export default Home;
