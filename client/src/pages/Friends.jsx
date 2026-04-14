import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { UserPlus, UserMinus, Users, Search as SearchIcon, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Friends = () => {
  const { user, token } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [allPlatformUsers, setAllPlatformUsers] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [processingIds, setProcessingIds] = useState(new Set());
  const navigate = useNavigate();

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

  const handleSearch = async (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.length > 2) {
      setIsSearching(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/users/search?q=${q}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSearchResults(res.data.filter(u => u._id !== user._id));
      } catch (err) {
        console.error(err);
      }
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  };

  const handleStartChat = async (friendId) => {
    try {
      await axios.post(`http://localhost:5000/api/conversations`, {
        senderId: user._id,
        receiverId: friendId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/messages');
    } catch (err) {
      console.error(err);
    }
  };

  const fetchData = async () => {
    try {
      // Fetch latest user data to get sentRequests
      const userRes = await axios.get(`http://localhost:5000/api/users/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSentRequests(userRes.data.sentRequests || []);

      // 1. Fetch current friends
      const fRes = await axios.get(`http://localhost:5000/api/users/${user._id}/friends`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFriends(fRes.data);

      // 2. Fetch friend requests
      const rRes = await axios.get(`http://localhost:5000/api/users/${user._id}/requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(rRes.data);

      // 3. Fetch suggestions
      const allRes = await axios.get(`http://localhost:5000/api/users/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const otherUsers = allRes.data.filter(u => u._id !== user._id);
      const friendIds = fRes.data.map(f => f._id);
      const requestIds = rRes.data.map(r => r._id);
      
      const nonFriends = otherUsers.filter(u => !friendIds.includes(u._id) && !requestIds.includes(u._id));
      setSuggestions(nonFriends);
      setAllPlatformUsers(otherUsers);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user._id, token]);

  const displayedSuggestions = isExpanded ? suggestions : suggestions.slice(0, 4);

  const sendRequest = async (friendId) => {
    try {
      await axios.patch(`http://localhost:5000/api/users/${user._id}/request/${friendId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const withdrawRequest = async (friendId) => {
    try {
      await axios.patch(`http://localhost:5000/api/users/${user._id}/cancel/${friendId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const acceptRequest = async (friendId) => {
    try {
      await axios.patch(`http://localhost:5000/api/users/${user._id}/accept/${friendId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const rejectRequest = async (friendId) => {
    try {
      await axios.patch(`http://localhost:5000/api/users/${user._id}/reject/${friendId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const unfriend = async (friendId) => {
    if (window.confirm("Remove this friend?")) {
      try {
        await axios.patch(`http://localhost:5000/api/users/${user._id}/friend/${friendId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="flex justify-center md:justify-between mx-auto max-w-[1600px] w-full min-h-screen">
      <Sidebar />
      <div className="w-full max-w-[1100px] p-6 lg:p-10 flex-1 bg-white">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <h1 className="text-4xl font-black tracking-tight text-gray-900">Friends</h1>
          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-facebookBlue transition-colors">
              <SearchIcon size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Search for people..." 
              value={searchQuery}
              onChange={handleSearch}
              className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-[1.5rem] focus:ring-4 focus:ring-blue-50 focus:border-facebookBlue/50 transition-all outline-none font-bold text-gray-700 placeholder:text-gray-400" 
            />
          </div>
        </div>

        {/* Search Results Section */}
        {isSearching && (
          <section className="mb-16 animate-in fade-in slide-in-from-top-4 duration-500">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-facebookBlue rounded-full"></div>
                <h2 className="text-2xl font-black text-gray-900">Search Results for "{searchQuery}"</h2>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchResults.map((person) => {
                  const isProcessing = processingIds.has(person._id);
                  const isSent = sentRequests.includes(person._id);
                  return (
                    <div key={`search-${person._id}`} className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-50 flex flex-col group hover:-translate-y-1 transition-all duration-300">
                       <img src={person.profilePicture ? `http://localhost:5000/assets/${person.profilePicture}` : 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'} alt="" className="w-full h-40 object-cover" />
                       <div className="p-5 flex flex-col gap-4">
                          <div>
                             <p className="font-black text-lg text-gray-900 leading-tight truncate">{person.firstName} {person.lastName}</p>
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{person.occupation || 'Platform Explorer'}</p>
                          </div>
                          <div className="flex flex-col gap-2">
                             {isSent ? (
                               <button 
                                 disabled={isProcessing}
                                 onClick={() => handleAction(person._id, withdrawRequest)} 
                                 className="bg-gray-200 text-gray-700 font-black py-2.5 rounded-xl hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
                               >
                                 <UserMinus size={16} /> {isProcessing ? 'Cancelling...' : 'Cancel Request'}
                               </button>
                             ) : (
                               <button 
                                  disabled={isProcessing}
                                  onClick={() => handleAction(person._id, sendRequest)} 
                                  className={`bg-facebookBlue text-white font-black py-2.5 rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                               >
                                  <UserPlus size={16} /> {isProcessing ? 'Adding...' : 'Add Friend'}
                               </button>
                             )}
                          </div>
                       </div>
                    </div>
                  );
                })}
               {searchResults.length === 0 && (
                 <div className="col-span-full py-10 text-center">
                    <p className="text-gray-400 font-bold italic">No people found matching your search.</p>
                 </div>
               )}
             </div>
             <div className="h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent mt-12 w-full"></div>
          </section>
        )}

        {/* Friend Requests Section */}
        {requests.length > 0 && (
          <section className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-black text-red-500">Pending Requests ({requests.length})</h2>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
               {requests.map((req) => {
                 const isProcessing = processingIds.has(req._id);
                 return (
                  <div key={req._id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 flex flex-col">
                     <img src={req.profilePicture ? `http://localhost:5000/assets/${req.profilePicture}` : 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'} alt="" className="w-full h-40 object-cover" />
                     <div className="p-4 flex flex-col gap-3">
                        <p className="font-bold text-base leading-tight truncate">{req.firstName} {req.lastName}</p>
                        <div className="flex flex-col gap-2">
                           <button 
                             disabled={isProcessing}
                             onClick={() => handleAction(req._id, acceptRequest)} 
                             className={`bg-facebookBlue text-white font-bold py-2 rounded-lg hover:bg-blue-600 transition-colors ${isProcessing ? 'opacity-50' : ''}`}
                           >
                             {isProcessing ? 'Updating...' : 'Confirm'}
                           </button>
                           <button 
                             disabled={isProcessing}
                             onClick={() => handleAction(req._id, rejectRequest)} 
                             className="bg-gray-100 text-gray-800 font-bold py-2 rounded-lg hover:bg-gray-200 transition-colors"
                           >
                             Delete
                           </button>
                        </div>
                     </div>
                  </div>
                );
               })}
             </div>
             <hr className="mt-10 border-gray-200" />
          </section>
        )}

        {/* Current Friends Section */}
        <section className="mb-10">
          <h2 className="text-xl font-black mb-4">Your Friends ({friends.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <div key={friend._id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 group">
                <div className="relative overflow-hidden">
                  <img src={friend.profilePicture ? `http://localhost:5000/assets/${friend.profilePicture}` : 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'} alt="" className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <p className="font-bold text-lg leading-tight mb-4 truncate">{friend.firstName} {friend.lastName}</p>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => handleStartChat(friend._id)} className="bg-blue-50 text-facebookBlue font-bold py-2 rounded-lg hover:bg-blue-100 transition-colors">Message</button>
                    <button onClick={() => unfriend(friend._id)} className="bg-gray-50 text-gray-500 font-bold py-2 rounded-lg hover:bg-gray-100 transition-colors hover:text-red-500">Unfriend</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {friends.length === 0 && !isLoading && (
            <div className="py-20 bg-white rounded-2xl text-center border-2 border-dashed border-gray-100">
               <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Users className="text-gray-300" size={32} />
               </div>
               <p className="text-gray-400 font-bold">Start growing your network!</p>
            </div>
          )}
        </section>

        {/* Suggestions Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black">People You May Know</h2>
            {suggestions.length > 4 && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-facebookBlue font-bold hover:underline text-sm uppercase tracking-wider"
              >
                {isExpanded ? 'Show Less' : 'Expand All'}
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedSuggestions.map((person) => {
              const isProcessing = processingIds.has(person._id);
              const isSent = sentRequests.includes(person._id);
              return (
                <div key={person._id} className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100 group hover:shadow-xl transition-all duration-300 animate-in fade-in zoom-in-95 duration-300">
                  <div className="relative h-48 cursor-pointer overflow-hidden" onClick={() => navigate(`/profile/${person._id}`)}>
                    <img src={person.profilePicture ? `http://localhost:5000/assets/${person.profilePicture}` : 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                  <div className="p-5">
                    <p onClick={() => navigate(`/profile/${person._id}`)} className="font-black text-lg text-gray-900 leading-tight mb-1 truncate cursor-pointer hover:text-facebookBlue transition-colors">{person.firstName} {person.lastName}</p>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">{person.location || 'Social Explorer'}</p>
                    <div className="flex flex-col gap-2">
                      {isSent ? (
                        <button 
                          disabled={isProcessing}
                          onClick={() => handleAction(person._id, withdrawRequest)} 
                          className="bg-gray-200 text-gray-700 font-bold py-3 rounded-2xl hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
                        >
                           <UserMinus size={18} /> {isProcessing ? 'Cancelling...' : 'Cancel Request'}
                        </button>
                      ) : (
                        <button 
                           disabled={isProcessing}
                           onClick={() => handleAction(person._id, sendRequest)} 
                           className={`bg-facebookBlue text-white font-black py-3 rounded-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100 hover:scale-[1.02] active:scale-95 ${isProcessing ? 'opacity-50' : ''}`}
                        >
                           <UserPlus size={18} /> {isProcessing ? 'Adding...' : 'Add Friend'}
                        </button>
                      )}
                      <button className="bg-gray-100 text-gray-600 font-bold py-2 rounded-xl hover:bg-gray-200 transition-colors">Hide Support</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Global Platform Directory */}
        <section className="mt-16 mb-20">
          <div className="bg-gradient-to-r from-facebookBlue to-blue-500 p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-blue-200 flex items-center justify-between mb-8 overflow-visible relative mt-20">
            <div className="relative z-10 w-full md:w-2/3">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-2 md:mb-3">Global Network Directory</h2>
              <p className="text-blue-50 text-sm md:text-base font-bold tracking-wide">Connect and discover over {allPlatformUsers.length + 1} extraordinary people around the world.</p>
            </div>
            <img 
              src="https://static.vecteezy.com/system/resources/previews/022/484/504/original/3d-global-network-connection-illustration-png.png" 
              alt="Global Network" 
              className="absolute right-0 -top-16 md:-top-24 w-40 md:w-64 drop-shadow-2xl hover:scale-110 transition-transform duration-700 animate-in fade-in zoom-in-125 delay-300"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allPlatformUsers
              .filter(person => !friends.some(f => f._id === person._id))
              .map((person) => {
                const isPending = requests.some(r => r._id === person._id);
                const isSent = sentRequests.includes(person._id);
                const isProcessing = processingIds.has(person._id);
              
                return (
                  <div key={`dir-${person._id}`} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-50 hover:border-facebookBlue/20 transition-all hover:shadow-lg group">
                    <img 
                      src={person.profilePicture ? `http://localhost:5000/assets/${person.profilePicture}` : 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'} 
                      alt="" 
                      className="w-14 h-14 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform cursor-pointer" 
                      onClick={() => navigate(`/profile/${person._id}`)}
                    />
                    <div className="flex-1 overflow-hidden">
                      <p 
                        className="font-bold text-gray-900 truncate cursor-pointer hover:text-facebookBlue transition-colors"
                        onClick={() => navigate(`/profile/${person._id}`)}
                      >
                        {person.firstName} {person.lastName}
                      </p>
                      {isPending ? (
                         <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest mt-1 flex items-center gap-1 duration-700 animate-pulse">Request Pending</span>
                      ) : isSent ? (
                        <button 
                          disabled={isProcessing}
                          onClick={() => handleAction(person._id, withdrawRequest)}
                          className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1 flex items-center gap-1 hover:text-red-500 transition-all"
                        >
                          {isProcessing ? 'Cancelling...' : 'Cancel Request'} <UserMinus size={10} />
                        </button>
                      ) : (
                         <button 
                          disabled={isProcessing}
                          onClick={() => handleAction(person._id, sendRequest)}
                          className={`text-[10px] font-black text-facebookBlue uppercase tracking-widest mt-1 flex items-center gap-1 hover:gap-2 transition-all ${isProcessing ? 'opacity-50' : ''}`}
                        >
                          {isProcessing ? 'Sending...' : 'Send Invitation'} <UserPlus size={10} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
          {allPlatformUsers.length === 0 && (
            <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
               <p className="text-gray-400 font-bold italic">No other users found on the platform.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
export default Friends;
