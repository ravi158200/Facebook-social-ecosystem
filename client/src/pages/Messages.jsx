import { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { Search, Video, Phone, Info, Smile, Plus, Image, Send } from 'lucide-react';

// Internal component for Chat List items
const ConversationListItem = ({ conversation, currentUser, token, isActive, onClick }) => {
  const [friend, setFriend] = useState(null);

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);
    const getFriend = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${friendId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFriend(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getFriend();
  }, [currentUser, conversation, token]);

  if (!friend) return <div className="p-4 bg-gray-50 animate-pulse rounded-xl mb-1 h-20"></div>;

  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 transition-all border-b border-gray-50 ${isActive ? 'bg-blue-50/50' : ''}`}
    >
       <div className="relative">
          <img src={friend.profilePicture ? `http://localhost:5000/assets/${friend.profilePicture}` : 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'} alt="" className="w-14 h-14 rounded-full border border-gray-100 object-cover" />
          <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
       </div>
       <div className="flex-1 overflow-hidden">
          <p className={`font-bold ${isActive ? 'text-facebookBlue' : 'text-gray-900'}`}>{friend.firstName} {friend.lastName}</p>
          <p className="text-xs text-gray-500 truncate font-medium">Joined the conversation</p>
       </div>
    </div>
  );
};

const Messages = () => {
  const { user, token } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [friendData, setFriendData] = useState(null);
  const scrollRef = useRef();

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/conversations/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user._id, token]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/messages/${currentChat?._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (currentChat) getMessages();
  }, [currentChat, token]);

  useEffect(() => {
    const getFriendData = async () => {
      const friendId = currentChat?.members.find((m) => m !== user._id);
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${friendId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFriendData(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (currentChat) getFriendData();
  }, [currentChat, user, token]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    try {
      const res = await axios.post("http://localhost:5000/api/messages", message, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center md:justify-between mx-auto max-w-[1600px] w-full min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex max-w-[1240px] h-[calc(100vh-80px)] mt-5 mb-5 mx-4 bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-white">
         
         {/* Sidebar Chats */}
         <div className="w-[380px] border-r border-gray-50 flex flex-col bg-white">
            <div className="p-6">
               <div className="flex justify-between items-center mb-6">
                  <h1 className="text-3xl font-black tracking-tight">Chats</h1>
                  <div className="p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 cursor-pointer transition-colors"><Plus size={20} className="text-facebookBlue" /></div>
               </div>
               <div className="flex items-center bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100 focus-within:border-facebookBlue/30 transition-all">
                  <Search size={18} className="text-gray-400" />
                  <input type="text" placeholder="Search conversations" className="bg-transparent outline-none ml-3 w-full text-sm font-medium" />
               </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar px-2">
               {conversations.map((c) => (
                  <ConversationListItem 
                    key={c._id} 
                    conversation={c} 
                    currentUser={user} 
                    token={token} 
                    isActive={currentChat?._id === c._id}
                    onClick={() => setCurrentChat(c)}
                  />
               ))}
               {conversations.length === 0 && (
                 <div className="p-10 text-center">
                    <p className="text-gray-400 font-bold italic">No active chats found.</p>
                 </div>
               )}
            </div>
         </div>

         {/* Chat Window */}
         <div className="flex-1 flex flex-col bg-[#F9FAFB]">
            {currentChat ? (
              <>
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white shadow-sm z-10">
                   <div className="flex items-center gap-4">
                      {friendData && (
                        <>
                          <img src={friendData.profilePicture ? `http://localhost:5000/assets/${friendData.profilePicture}` : 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'} alt="" className="w-11 h-11 rounded-2xl object-cover shadow-sm" />
                          <div>
                             <p className="font-black text-gray-900 leading-tight text-lg">{friendData.firstName} {friendData.lastName}</p>
                             <div className="flex items-center gap-2">
                               <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                               <p className="text-xs text-green-600 font-bold uppercase tracking-wider">Active Status</p>
                             </div>
                          </div>
                        </>
                      )}
                   </div>
                   <div className="flex gap-2">
                      <button className="hover:bg-gray-50 p-3 rounded-2xl text-facebookBlue transition-all active:scale-90"><Phone size={22}/></button>
                      <button className="hover:bg-gray-50 p-3 rounded-2xl text-facebookBlue transition-all active:scale-90"><Video size={22}/></button>
                      <button className="hover:bg-gray-50 p-3 rounded-2xl text-facebookBlue transition-all active:scale-90"><Info size={22}/></button>
                   </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 custom-scrollbar">
                   {friendData && (
                     <div className="self-center my-12 flex flex-col items-center animate-in zoom-in duration-500">
                        <img src={friendData.profilePicture ? `http://localhost:5000/assets/${friendData.profilePicture}` : 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'} alt="" className="w-24 h-24 rounded-3xl object-cover mb-4 shadow-xl shadow-blue-100 ring-4 ring-white" />
                        <p className="font-black text-2xl text-gray-900">{friendData.firstName} {friendData.lastName}</p>
                        <p className="text-facebookBlue font-black text-xs uppercase tracking-widest mt-2 px-3 py-1 bg-blue-50 rounded-full italic">Connected via Meta Registry</p>
                     </div>
                   )}
                   
                   {messages.map((m) => (
                      <div 
                        key={m._id} 
                        ref={scrollRef}
                        className={`p-4 rounded-3xl max-w-[70%] text-sm font-medium shadow-sm transition-all animate-in slide-in-from-bottom-2 ${m.sender === user._id ? 'bg-facebookBlue text-white self-end rounded-br-none' : 'bg-white text-gray-700 self-start rounded-bl-none border border-gray-100'}`}
                      >
                         {m.text}
                      </div>
                   ))}
                </div>

                {/* Input Area */}
                <div className="p-6 bg-white border-t border-gray-100">
                   <form onSubmit={handleSubmit} className="flex items-center gap-4 bg-gray-50 p-2 rounded-[2rem] border border-gray-100 focus-within:border-facebookBlue/30 transition-all">
                      <div className="flex gap-4 text-facebookBlue pl-3">
                         <Plus size={20} className="hidden sm:block cursor-pointer hover:scale-110 transition-transform" />
                         <Image size={20} className="cursor-pointer hover:scale-110 transition-transform" />
                         <Smile size={20} className="cursor-pointer hover:scale-110 transition-transform" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="Type a message..." 
                        className="flex-1 bg-transparent outline-none text-sm font-medium py-2 px-2" 
                        onChange={(e) => setNewMessage(e.target.value)}
                        value={newMessage}
                      />
                      <button type="submit" className="bg-facebookBlue text-white p-3 rounded-full shadow-lg shadow-blue-100 hover:scale-105 active:scale-95 transition-all">
                         <Send size={20} fill="currentColor" />
                      </button>
                   </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-20 text-center animate-in fade-in duration-700">
                 <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-50 flex flex-col items-center">
                    <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center text-facebookBlue mb-6">
                       <Send size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-3">Your Messages</h2>
                    <p className="text-gray-500 font-medium max-w-[300px] leading-relaxed mb-8">Select a conversation from the sidebar to start real-time messaging with your friends.</p>
                    <button className="bg-facebookBlue text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-blue-100 hover:scale-105 transition-all">
                       Search Friends
                    </button>
                 </div>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default Messages;

