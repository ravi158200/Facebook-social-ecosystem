import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Post from '../components/Post';
import { PlayCircle, Tv, Search, Settings } from 'lucide-react';

const Watch = () => {
  const [posts, setPosts] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchVideoPosts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/posts', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Strict filter: Only show posts that have a videoPath
        const videoOnly = res.data.filter(post => post.videoPath && post.videoPath !== "");
        setPosts(videoOnly);
      } catch (err) {
        console.error(err);
      }
    };
    fetchVideoPosts();
  }, [token]);

  return (
    <div className="flex justify-center md:justify-between mx-auto max-w-[1600px] w-full min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 max-w-[900px] px-4 py-8">
        
        {/* Immersive Watch Header */}
        <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 mb-10 border border-white relative overflow-hidden group">
          <div className="flex justify-between items-center relative z-10">
            <div>
               <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-red-50 text-red-500 rounded-xl">
                    <Tv size={24} />
                  </div>
                  <h1 className="text-4xl font-black text-gray-900 tracking-tight">Watch</h1>
               </div>
               <p className="text-gray-500 font-bold ml-1">The best videos from across the platform, curated for you.</p>
            </div>
            <div className="flex gap-3">
               <button className="p-4 bg-gray-50 rounded-2xl text-gray-500 hover:bg-gray-100 transition-all"><Search size={22} /></button>
               <button className="p-4 bg-gray-50 rounded-2xl text-gray-500 hover:bg-gray-100 transition-all"><Settings size={22} /></button>
            </div>
          </div>
          <PlayCircle size={150} className="absolute -right-10 -bottom-10 text-gray-50 opacity-[0.03] group-hover:scale-110 transition-transform duration-700" />
        </div>

        {/* Video Feed */}
        <div className="flex flex-col items-center gap-6">
          {posts.length > 0 ? (
            posts.map(post => (
              <div key={post._id} className="w-full animate-in fade-in slide-in-from-bottom-6 duration-700">
                <Post post={post} />
              </div>
            ))
          ) : (
            <div className="bg-white p-20 rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-50 flex flex-col items-center text-center w-full">
               <div className="w-24 h-24 bg-red-50 rounded-[2rem] flex items-center justify-center text-red-500 mb-6">
                  <Tv size={48} />
               </div>
               <h2 className="text-3xl font-black text-gray-900 mb-3">No Videos Yet</h2>
               <p className="text-gray-500 font-medium max-w-[300px] leading-relaxed">Check back later for new video content or upload your own video to get started!</p>
            </div>
          )}
        </div>
      </div>
      <div className="hidden xl:block w-[300px]"></div>
    </div>
  );
};

export default Watch;
