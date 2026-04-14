import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Camera, ChevronRight, Briefcase, MapPin, Mail, Users, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import CreatePost from '../components/CreatePost';
import Post from '../components/Post';

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const { user: authUser, token, login } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState(null);
  const [processingIds, setProcessingIds] = useState(new Set());

  const fetchUserAndPosts = async () => {
    if (!authUser || !authUser._id) return;
    try {
      const uRes = await axios.get(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfileUser(uRes.data);

      const pRes = await axios.get(`http://localhost:5000/api/posts/${userId}/posts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserPosts(pRes.data);

      const fRes = await axios.get(`http://localhost:5000/api/users/${userId}/friends`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFriendsList(fRes.data);

      // Fetch current logged in user to check friend status
      const curRes = await axios.get(`http://localhost:5000/api/users/${authUser._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentUser(curRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAction = async (id, actionFn) => {
    setProcessingIds(prev => new Set(prev).add(id));
    try {
      await actionFn(id);
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  useEffect(() => {
    fetchUserAndPosts();
  }, [userId, token, authUser]);

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("picture", file);
      const res = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const updatedData = { [type]: res.data.filename };
      const updateRes = await axios.patch(`http://localhost:5000/api/users/${authUser._id}/update`, updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local storage and context
      if (userId === authUser._id) {
        login(updateRes.data, token);
        alert(`Success! Your ${type === 'profilePicture' ? 'profile picture' : 'cover photo'} has been updated.`);
      }
      setProfileUser(updateRes.data);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || err.message;
      alert(`Upload failed: ${msg}`);
    }
  };

  const sendRequest = async (friendId) => {
    try {
      await axios.patch(`http://localhost:5000/api/users/${authUser._id}/request/${friendId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchUserAndPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const withdrawRequest = async (friendId) => {
    try {
      await axios.patch(`http://localhost:5000/api/users/${authUser._id}/cancel/${friendId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchUserAndPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const acceptRequest = async (friendId) => {
    try {
      await axios.patch(`http://localhost:5000/api/users/${authUser._id}/accept/${friendId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchUserAndPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const rejectRequest = async (friendId) => {
    try {
      await axios.patch(`http://localhost:5000/api/users/${authUser._id}/reject/${friendId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchUserAndPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const unfriend = async (friendId) => {
    if (window.confirm("Remove this friend?")) {
      try {
        await axios.patch(`http://localhost:5000/api/users/${authUser._id}/friend/${friendId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        await fetchUserAndPosts();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const [activeTab, setActiveTab] = useState('Posts');

  if (!profileUser) return <div className="text-center mt-10">Loading...</div>;

  const userPhotos = userPosts.filter(p => p.picturePath).map(p => p.picturePath);

  const isFriend = (currentUser?.friends || []).includes(profileUser._id);
  const isSent = (currentUser?.sentRequests || []).includes(profileUser._id);
  const isPending = (currentUser?.friendRequests || []).includes(profileUser._id);
  const isProcessing = processingIds.has(profileUser._id);

  return (
    <div className="bg-backgroundGray min-h-screen">
      <div className="bg-white shadow">
        <div className="max-w-[1095px] mx-auto relative group">
          <div className="h-[350px] w-full rounded-b-lg bg-gray-300 relative overflow-hidden">
            {profileUser.coverPicture ? (
              <img src={`http://localhost:5000/assets/${profileUser.coverPicture}?${profileUser.updatedAt}`} className="w-full h-full object-cover" alt="" />
            ) : (
              <div className="w-full h-full bg-gradient-to-b from-gray-200 to-gray-400"></div>
            )}
            {authUser._id === profileUser._id && (
              <label className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-md font-semibold cursor-pointer flex items-center gap-2 hover:bg-gray-100 transition-colors">
                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'coverPicture')} />
                Add Cover Photo
              </label>
            )}
          </div>
          <div className="px-8 pb-4 flex flex-col md:flex-row items-center md:items-end justify-between relative mb-4">
            <div className="flex flex-col md:flex-row items-center gap-6 z-10 w-full">
              <div className="relative w-[168px] h-[168px] rounded-full ring-4 ring-white bg-white shadow-lg overflow-hidden shrink-0 -mt-20 group/avatar">
                <img src={profileUser.profilePicture ? `http://localhost:5000/assets/${profileUser.profilePicture}?${profileUser.updatedAt}` : 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'} alt="" className="w-full h-full object-cover" />
                {authUser._id === profileUser._id && (
                   <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 cursor-pointer transition-opacity">
                      <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'profilePicture')} />
                      <Camera size={24} className="text-white" />
                   </label>
                )}
              </div>
              <div className="text-center md:text-left pt-2 md:pt-4">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">{profileUser.firstName} {profileUser.lastName}</h1>
                <p className="text-gray-500 font-bold flex items-center gap-2 justify-center md:justify-start mt-1">
                   <Users size={16} className="text-facebookBlue" />
                   {friendsList.length} Friends
                </p>
              </div>
            </div>

            {authUser._id !== profileUser._id && (
              <div className="flex gap-2 mt-4 md:mt-0 z-10">
                {isFriend ? (
                  <button onClick={() => handleAction(profileUser._id, unfriend)} disabled={isProcessing} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-xl font-bold hover:bg-gray-300 transition-all flex items-center gap-2">
                     <Users size={18} /> {isProcessing ? 'Updating...' : 'Friends'}
                  </button>
                ) : isSent ? (
                  <button onClick={() => handleAction(profileUser._id, withdrawRequest)} disabled={isProcessing} className="bg-gray-100 text-gray-600 px-6 py-2 rounded-xl font-bold hover:bg-gray-200 transition-all">
                     {isProcessing ? 'Cancelling...' : 'Cancel Request'}
                  </button>
                ) : isPending ? (
                  <div className="flex gap-2">
                     <button onClick={() => handleAction(profileUser._id, acceptRequest)} disabled={isProcessing} className="bg-facebookBlue text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-600 transition-all">
                        {isProcessing ? 'Accepting...' : 'Confirm'}
                     </button>
                     <button onClick={() => handleAction(profileUser._id, rejectRequest)} disabled={isProcessing} className="bg-gray-100 text-gray-700 px-6 py-2 rounded-xl font-bold hover:bg-gray-200 transition-all">
                        Delete
                     </button>
                  </div>
                ) : (
                  <button onClick={() => handleAction(profileUser._id, sendRequest)} disabled={isProcessing} className="bg-facebookBlue text-white px-6 py-2 rounded-xl font-bold shadow-md hover:bg-blue-600 transition-all">
                     {isProcessing ? 'Sending...' : 'Add Friend'}
                  </button>
                )}
                <button onClick={() => navigate('/messages')} className="bg-gray-100 text-gray-700 px-6 py-2 rounded-xl font-bold hover:bg-gray-200 transition-all focus:ring-2 ring-gray-200">Message</button>
              </div>
            )}
          </div>
          <div className="flex gap-1 px-4 py-2">
             {['Posts', 'About', 'Friends', 'Photos'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 hover:bg-gray-100 rounded-md font-semibold transition-all duration-200 ${activeTab === tab ? 'text-facebookBlue border-b-4 border-facebookBlue' : 'text-gray-500'}`}
                >
                  {tab}
                </button>
             ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1095px] mx-auto flex flex-col lg:flex-row gap-4 px-4 py-4">
        {activeTab === 'Posts' && (
          <>
            {/* Left column */}
            <div className="w-full lg:w-[40%] flex flex-col gap-4 sticky top-[70px] h-fit">
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h2 className="font-bold text-xl mb-4">Intro</h2>
                <div className="flex flex-col gap-3 text-[15px]">
                  {profileUser.occupation && <div className="text-gray-700 flex items-center gap-2"><span>💼</span> Works as <span className="font-semibold">{profileUser.occupation}</span></div>}
                  {profileUser.location && <div className="text-gray-700 flex items-center gap-2"><span>🏠</span> Lives in <span className="font-semibold">{profileUser.location}</span></div>}
                  <div className="text-gray-700 flex items-center gap-2"><span>📧</span> <span className="font-semibold">{profileUser.email}</span></div>
                </div>
                {authUser._id === profileUser._id && (
                  <button className="w-full bg-gray-200 mt-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition">Edit Details</button>
                )}
              </div>
            </div>

            {/* Right column */}
            <div className="w-full lg:w-[60%] flex flex-col">
              {authUser._id === profileUser._id && (
                <CreatePost onPostCreated={fetchUserAndPosts} /> 
              )}
              {userPosts.length > 0 ? userPosts.map(post => (
                <Post key={post._id} post={post} />
              )) : (
                <div className="bg-white p-10 rounded-xl text-center shadow-sm">
                   <p className="text-gray-500 italic">No posts yet.</p>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'About' && (
           <div className="w-full bg-white rounded-xl shadow-sm p-8 h-fit">
              <h2 className="text-xl font-bold mb-6">About</h2>
              <div className="space-y-6">
                 <div>
                    <h3 className="text-lg font-semibold border-b pb-2 mb-4">Contact and Basic Info</h3>
                    <div className="space-y-4">
                       <p className="text-gray-600 font-bold">Email: <span className="text-facebookBlue font-normal">{profileUser.email}</span></p>
                       <p className="text-gray-600 font-bold">Location: <span className="font-normal">{profileUser.location || 'Not specified'}</span></p>
                    </div>
                 </div>
                 <div>
                    <h3 className="text-lg font-semibold border-b pb-2 mb-4">Work and Education</h3>
                    <p className="text-gray-600 font-bold">Current: <span className="font-normal">{profileUser.occupation || 'Not specified'}</span></p>
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'Friends' && (
           <div className="w-full bg-white rounded-xl shadow-sm p-6 h-fit">
              <h2 className="text-xl font-bold mb-6">Friends ({friendsList.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                 {friendsList.length > 0 ? friendsList.map((friend) => (
                    <div 
                      key={friend._id} 
                      onClick={() => navigate(`/profile/${friend._id}`)}
                      className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group"
                    >
                        <div className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden shrink-0 shadow-sm border border-gray-100">
                           <img src={friend.profilePicture ? `http://localhost:5000/assets/${friend.profilePicture}` : 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                           <p className="font-bold text-gray-900 truncate">{friend.firstName} {friend.lastName}</p>
                           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{friend.occupation || 'Friend'}</p>
                        </div>
                    </div>
                 )) : (
                    <p className="col-span-full text-center text-gray-500 py-10">No friends to show.</p>
                 )}
              </div>
           </div>
        )}

        {activeTab === 'Photos' && (
           <div className="w-full bg-white rounded-xl shadow-sm p-6 h-fit">
              <h2 className="text-xl font-bold mb-6">Photos</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                 {userPhotos.length > 0 ? userPhotos.map((photo, i) => (
                    <img key={i} src={`http://localhost:5000/assets/${photo}`} alt="" className="w-full aspect-square object-cover rounded-lg hover:brightness-90 cursor-pointer transition-all" />
                 )) : (
                    <p className="col-span-full text-center text-gray-500 py-10">No photos to show yet.</p>
                 )}
              </div>
           </div>
        )}
      </div>
    </div>
  );
};
export default Profile;