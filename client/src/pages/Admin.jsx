import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Users, ShieldAlert, Trash2, Ban, CheckCircle } from 'lucide-react';

const Admin = () => {
  const { token } = useContext(AuthContext);
  const [allUsers, setAllUsers] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('Users');

  const fetchData = async () => {
    try {
      const uRes = await axios.get('http://localhost:5000/api/users/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllUsers(uRes.data);

      const pRes = await axios.get('http://localhost:5000/api/posts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllPosts(pRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleDeleteUser = async (id) => {
    if (window.confirm("Delete this user and all their content permanently? This cannot be undone.")) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchData();
      } catch (err) {
        console.error(err);
        alert("Failed to delete user. Check permissions.");
      }
    }
  };

  const handleBlockUser = async (id, isCurrentlyBlocked) => {
    const action = isCurrentlyBlocked ? 'unblock' : 'block';
    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      try {
        await axios.patch(`http://localhost:5000/api/users/${id}/block`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchData();
      } catch (err) {
        console.error(err);
        alert(`Failed to ${action} user.`);
      }
    }
  };

  const handleDeletePost = async (id) => {
    if (window.confirm("Delete this post permanently?")) {
      try {
        await axios.delete(`http://localhost:5000/api/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
           <div className="bg-red-500 p-4 rounded-2xl text-white shadow-lg shadow-red-200 rotate-3">
              <ShieldAlert size={32} />
           </div>
           <div>
              <h1 className="text-4xl font-black tracking-tight text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-500 font-semibold flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                System Operational & Moderation Ready
              </p>
           </div>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center min-w-[120px]">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total Users</span>
            <span className="text-2xl font-black text-facebookBlue">{allUsers.length}</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center min-w-[120px]">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Live Posts</span>
            <span className="text-2xl font-black text-red-500">{allPosts.length}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-8 bg-gray-100/50 p-1.5 rounded-2xl w-fit">
         <button 
           onClick={() => setActiveTab('Users')} 
           className={`px-8 py-3 rounded-xl font-black transition-all text-sm tracking-wide ${activeTab === 'Users' ? 'bg-white text-facebookBlue shadow-md scale-105' : 'text-gray-500 hover:text-gray-800'}`}
         >
           USERS DIRECTORY
         </button>
         <button 
           onClick={() => setActiveTab('Posts')} 
           className={`px-8 py-3 rounded-xl font-black transition-all text-sm tracking-wide ${activeTab === 'Posts' ? 'bg-white text-facebookBlue shadow-md scale-105' : 'text-gray-500 hover:text-gray-800'}`}
         >
           CONTENT FEED
         </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
        {activeTab === 'Users' ? (
           <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-gray-400 uppercase text-[11px] font-black tracking-[0.1em] border-b border-gray-100">
                 <tr>
                    <th className="px-8 py-5">Profile Informtion</th>
                    <th className="px-8 py-5">Contact</th>
                    <th className="px-8 py-5">Role / Status</th>
                    <th className="px-8 py-5">Joined Date</th>
                    <th className="px-8 py-5 text-right font-serif">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                 {allUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50/50 transition-all group">
                       <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <img 
                                src={u.profilePicture ? `http://localhost:5000/assets/${u.profilePicture}` : 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'} 
                                alt="" 
                                className="w-12 h-12 rounded-2xl border-2 border-white shadow-sm object-cover group-hover:scale-110 transition-transform" 
                              />
                              {u.isAdmin && <div className="absolute -top-1 -right-1 bg-purple-500 w-4 h-4 rounded-full border-2 border-white" title="Admin User"></div>}
                            </div>
                            <div>
                              <p className="font-black text-gray-900 text-base">{u.firstName} {u.lastName}</p>
                              <p className="text-xs text-facebookBlue font-bold uppercase tracking-tight">{u.occupation || 'Platform Member'}</p>
                            </div>
                          </div>
                       </td>
                       <td className="px-8 py-5 font-medium text-gray-600 italic underline decoration-gray-200 underline-offset-4">{u.email}</td>
                       <td className="px-8 py-5">
                          <div className="flex flex-col gap-1">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm w-fit ${u.isAdmin ? 'bg-purple-600 text-white' : 'bg-emerald-500 text-white'}`}>
                               {u.isAdmin ? 'System Admin' : 'Active User'}
                            </span>
                            {u.isBlocked && (
                              <span className="px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-red-100 text-red-600 border border-red-200 w-fit">
                                Account Restricted
                              </span>
                            )}
                          </div>
                       </td>
                       <td className="px-8 py-5 text-gray-500 font-mono text-xs">{new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                       <td className="px-8 py-5 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleBlockUser(u._id, u.isBlocked)}
                              className={`p-2.5 rounded-xl transition-all shadow-sm ${u.isBlocked ? 'bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white hover:shadow-amber-100' : 'bg-gray-50 text-gray-500 hover:bg-gray-800 hover:text-white shadow-sm'}`}
                              title={u.isBlocked ? "Unblock User" : "Block User"}
                            >
                               {u.isBlocked ? <CheckCircle size={18} /> : <Ban size={18} />}
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(u._id)}
                              className="bg-red-50 text-red-500 p-2.5 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm hover:shadow-red-100"
                              title="Delete User"
                            >
                               <Trash2 size={18} />
                            </button>
                          </div>
                       </td>
                    </tr>
                 ))}
                 {allUsers.length === 0 && (
                   <tr>
                     <td colSpan="5" className="px-8 py-20 text-center text-gray-400 font-bold italic">No user accounts found in registry.</td>
                   </tr>
                 )}
              </tbody>
           </table>
        ) : (
           <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-gray-400 uppercase text-[11px] font-black tracking-[0.1em] border-b border-gray-100">
                 <tr>
                    <th className="px-8 py-5">Author</th>
                    <th className="px-8 py-5 w-1/3">Content Description</th>
                    <th className="px-8 py-5 text-center">Engagement</th>
                    <th className="px-8 py-5">Post Type</th>
                    <th className="px-8 py-5 text-right">Delete</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                 {allPosts.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50/50 transition-all group">
                       <td className="px-8 py-5 font-black text-gray-800">{p.firstName} {p.lastName}</td>
                       <td className="px-8 py-5">
                          <div className="flex flex-col gap-1">
                            <p className="line-clamp-2 text-gray-600 leading-relaxed font-medium capitalize">
                              {p.description || <span className="text-gray-300 italic">No textual content attached</span>}
                            </p>
                            {(p.picturePath || p.videoPath) && (
                              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 text-facebookBlue rounded font-black text-[9px] uppercase w-fit mt-1">
                                <Users size={10} /> Media Attached
                              </div>
                            )}
                          </div>
                       </td>
                       <td className="px-8 py-5">
                          <div className="flex items-center justify-center gap-4 text-gray-500 font-black">
                             <div className="flex flex-col items-center">
                               <span className="text-pink-500">❤️</span>
                               <span className="text-[10px]">{Object.keys(p.likes || {}).length}</span>
                             </div>
                             <div className="flex flex-col items-center">
                               <span className="text-facebookBlue">💬</span>
                               <span className="text-[10px]">{p.comments?.length || 0}</span>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-5">
                          <div className={`px-3 py-1 rounded text-[10px] font-black uppercase text-center w-fit ${p.isLive ? 'bg-red-100 text-red-600 border border-red-200' : 'bg-blue-100 text-facebookBlue border border-blue-200'}`}>
                             {p.isLive ? 'LIVE CAPTURE' : 'RECOLLECTION'}
                          </div>
                       </td>
                       <td className="px-8 py-5 text-right">
                          <button 
                            onClick={() => handleDeletePost(p._id)} 
                            className="bg-red-50 text-red-500 p-2.5 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm"
                          >
                             <Trash2 size={18} />
                          </button>
                       </td>
                    </tr>
                 ))}
                 {allPosts.length === 0 && (
                   <tr>
                     <td colSpan="5" className="px-8 py-20 text-center text-gray-400 font-bold italic">No posts found in platform feed.</td>
                   </tr>
                 )}
              </tbody>
           </table>
        )}
      </div>
      
      <div className="mt-8 flex justify-end">
        <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">
          Authorized Admin Session · {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};
export default Admin;
