import { useContext, useState, useEffect, useRef } from 'react';
import { Search, Home, Users, Tv, Store, Bell, MessageCircle, Menu, ShieldCheck, LogOut, User, Settings, HelpCircle, ChevronRight, Gamepad2, MonitorPlay } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(null); // 'notif', 'msg', 'settings'
  const [activeSubMenu, setActiveSubMenu] = useState(null); // 'settings_privacy', 'help_support'
  const navRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveMenu(null);
        setActiveSubMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  const toggleMenu = (menu) => {
    if (activeMenu === menu) {
      setActiveMenu(null);
      setActiveSubMenu(null);
    } else {
      setActiveMenu(menu);
      setActiveSubMenu(null);
    }
  };

  return (
    <div ref={navRef} className="flex items-center justify-between px-4 py-2 bg-white shadow-sm sticky top-0 z-50 h-[60px] border-b border-gray-100">
      {/* Left */}
      <div className="flex items-center gap-2">
        <div onClick={() => navigate('/')} className="cursor-pointer transition-opacity hover:opacity-90">
          <svg viewBox="0 0 36 36" className="w-[40px] h-[40px]" fill="currentColor">
             <circle cx="18" cy="18" r="18" fill="#0866FF"/>
             <path d="M22.5 18h-2.9v11.8h-4.9V18h-2.3v-4.1h2.3v-2.7c0-1.9 1.4-5.3 5.4-5.3h3.5v4.1h-2.5c-.5 0-1.2.3-1.2 1.3v2.6h3.8l-1.2 4.1z" fill="#ffffff"/>
          </svg>
        </div>
        <div className="flex items-center bg-gray-100 rounded-full px-3 py-2">
          <Search size={18} className="text-gray-500 font-bold" />
          <input type="text" placeholder="Search Facebook" className="bg-transparent outline-none ml-2 hidden xl:block w-40 text-sm font-medium" />
        </div>
      </div>

      {/* Middle */}
      <div className="flex-1 flex justify-center hidden lg:flex gap-1 h-full">
        <div onClick={() => navigate('/')} className={`px-8 xl:px-12 flex items-center cursor-pointer hover:bg-gray-100 rounded-xl relative group transition-all ${isActive('/') ? 'text-facebookBlue' : 'text-gray-500'}`}>
          <Home size={28} fill={isActive('/') ? "currentColor" : "none"} strokeWidth={isActive('/') ? 2.5 : 2} />
          {isActive('/') && <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-facebookBlue rounded-t-full"></div>}
          <div className="absolute bottom-[-35px] bg-gray-700/90 text-white text-[11px] font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl border border-white/10">Home</div>
        </div>

        <div onClick={() => navigate('/watch')} className={`px-8 xl:px-12 flex items-center cursor-pointer hover:bg-gray-100 rounded-xl relative group transition-all ${isActive('/watch') ? 'text-facebookBlue' : 'text-gray-500'}`}>
          <Tv size={28} fill={isActive('/watch') ? "currentColor" : "none"} strokeWidth={isActive('/watch') ? 2.5 : 2} />
          {isActive('/watch') && <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-facebookBlue rounded-t-full"></div>}
          <div className="absolute bottom-[-35px] bg-gray-700/90 text-white text-[11px] font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl border border-white/10">Watch</div>
        </div>

        <div onClick={() => navigate('/store')} className={`px-8 xl:px-12 flex items-center cursor-pointer hover:bg-gray-100 rounded-xl relative group transition-all ${isActive('/store') ? 'text-facebookBlue' : 'text-gray-500'}`}>
          <Store size={28} fill={isActive('/store') ? "currentColor" : "none"} strokeWidth={isActive('/store') ? 2.5 : 2} />
          {isActive('/store') && <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-facebookBlue rounded-t-full"></div>}
          <div className="absolute bottom-[-35px] bg-gray-700/90 text-white text-[11px] font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl border border-white/10">Marketplace</div>
        </div>

        <div onClick={() => navigate('/friends')} className={`px-8 xl:px-12 flex items-center cursor-pointer hover:bg-gray-100 rounded-xl relative group transition-all ${isActive('/friends') ? 'text-facebookBlue' : 'text-gray-500'}`}>
          <Users size={28} fill={isActive('/friends') ? "currentColor" : "none"} strokeWidth={isActive('/friends') ? 2.5 : 2} />
          {isActive('/friends') && <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-facebookBlue rounded-t-full"></div>}
          <div className="absolute bottom-[-35px] bg-gray-700/90 text-white text-[11px] font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl border border-white/10">Groups</div>
        </div>

        <div onClick={() => navigate('/gaming')} className={`px-8 xl:px-12 flex items-center cursor-pointer hover:bg-gray-100 rounded-xl relative group transition-all ${isActive('/gaming') ? 'text-facebookBlue' : 'text-gray-500'}`}>
          <Gamepad2 size={28} fill={isActive('/gaming') ? "currentColor" : "none"} strokeWidth={isActive('/gaming') ? 2.5 : 2} />
          {isActive('/gaming') && <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-facebookBlue rounded-t-full"></div>}
          <div className="absolute bottom-[-35px] bg-gray-700/90 text-white text-[11px] font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl border border-white/10">Gaming</div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 relative">
        {(user?.isAdmin || user?.email === 'raviraj7301325@gmail.com') && (
          <div 
            onClick={() => navigate('/admin')} 
            className="flex items-center gap-2 bg-blue-50 text-facebookBlue px-4 py-2 rounded-full cursor-pointer hover:bg-blue-100 transition-colors border border-blue-100"
          >
            <ShieldCheck size={20} className="stroke-[2.5px]" />
            <span className="font-bold text-sm tracking-tight">ADMIN PANEL</span>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <div className="relative group">
            <div onClick={() => toggleMenu('msg')} className={`p-2 rounded-full cursor-pointer transition-colors ${activeMenu === 'msg' ? 'bg-blue-100 text-facebookBlue' : 'bg-gray-100 hover:bg-gray-200'}`}>
              <MessageCircle size={22} fill={activeMenu === 'msg' ? "currentColor" : "none"} />
            </div>
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">2</div>
            
            {activeMenu === 'msg' && (
              <div className="absolute top-12 right-0 bg-white shadow-2xl rounded-xl w-80 p-4 border border-gray-100 animate-in fade-in zoom-in duration-100">
                <h3 className="font-bold text-xl mb-4">Chats</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg cursor-pointer">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-facebookBlue text-xl">R</div>
                    <div>
                      <p className="font-semibold text-sm">Rahul Kumar</p>
                      <p className="text-xs text-gray-500 truncate w-40 font-bold">sent you a video post</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg cursor-pointer">
                     <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xl">S</div>
                    <div>
                      <p className="font-semibold text-sm">Sonia Sharam</p>
                      <p className="text-xs text-gray-500 truncate w-40">Are you going to the live strea...</p>
                    </div>
                  </div>
                </div>
                <hr className="my-4" />
                <button 
                  onClick={() => {navigate('/messages'); setActiveMenu(null);}} 
                  className="text-facebookBlue font-semibold w-full text-center hover:underline text-sm"
                >
                  See all in Messenger
                </button>
              </div>
            )}
          </div>

          <div className="relative group">
            <div onClick={() => toggleMenu('notif')} className={`p-2 rounded-full cursor-pointer transition-colors ${activeMenu === 'notif' ? 'bg-blue-100 text-facebookBlue' : 'bg-gray-100 hover:bg-gray-200'}`}>
              <Bell size={22} fill={activeMenu === 'notif' ? "currentColor" : "none"} />
            </div>
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">5+</div>

            {activeMenu === 'notif' && (
              <div className="absolute top-12 right-[-50px] bg-white shadow-2xl rounded-xl w-80 p-4 border border-gray-100 animate-in fade-in zoom-in duration-100">
                <h3 className="font-bold text-xl mb-4">Notifications</h3>
                <div className="flex gap-2 mb-4">
                  <span className="bg-blue-50 text-facebookBlue px-3 py-1 rounded-full text-xs font-bold">All</span>
                  <span className="hover:bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-600">Unread</span>
                </div>
                <div className="space-y-4 mb-4">
                   <div className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg cursor-pointer">
                      <div className="w-10 h-10 bg-facebookBlue rounded-full flex items-center justify-center text-white"><Users size={18}/></div>
                      <div className="text-[13px]"><span className="font-bold">Ankit Raj</span> sent you a friend request.</div>
                   </div>
                   <div className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg cursor-pointer">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600"><Bell size={18}/></div>
                      <div className="text-[13px]"><span className="font-bold">System</span> Your post is trending!</div>
                   </div>
                </div>
                <hr className="my-2" />
                <button 
                  onClick={() => {navigate('/notifications'); setActiveMenu(null);}} 
                  className="text-facebookBlue font-semibold w-full text-center hover:underline text-sm"
                >
                  See all notifications
                </button>
              </div>
            )}
          </div>

          <div className="relative group">
            <div onClick={() => toggleMenu('settings')} className={`flex items-center cursor-pointer transition-all hover:opacity-90 ${activeMenu === 'settings' ? 'ring-2 ring-facebookBlue ring-offset-2' : ''} rounded-full`}>
               <img src={user.profilePicture ? `http://localhost:5000/assets/${user.profilePicture}` : 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'} alt="user" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
            </div>
            <div className="absolute bottom-0 right-0 bg-gray-100 rounded-full border border-white p-0.5"><ChevronRight size={10} className="rotate-90"/></div>

            {activeMenu === 'settings' && (
              <div className="absolute top-12 right-0 bg-white shadow-2xl rounded-xl w-80 p-3 border border-gray-100 animate-in fade-in zoom-in duration-100">
                 {!activeSubMenu ? (
                   <>
                    <div onClick={() => {navigate(`/profile/${user._id}`); setActiveMenu(null);}} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer shadow-sm border border-gray-50 mb-4 transition-transform active:scale-95">
                        <img src={user.profilePicture ? `http://localhost:5000/assets/${user.profilePicture}` : 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'} alt="" className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                        <div>
                          <p className="font-bold">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-gray-500">See your profile</p>
                        </div>
                    </div>
                    
                    <div className="space-y-1">
                        <div onClick={() => setActiveSubMenu('settings_privacy')} className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg cursor-pointer group">
                          <div className="flex items-center gap-3">
                              <div className="p-2 bg-gray-200 rounded-full group-hover:bg-gray-300"><Settings size={20}/></div>
                              <span className="font-semibold text-[15px]">Settings & privacy</span>
                          </div>
                          <ChevronRight size={20} className="text-gray-500"/>
                        </div>
                        <div onClick={() => setActiveSubMenu('help_support')} className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg cursor-pointer group">
                          <div className="flex items-center gap-3">
                              <div className="p-2 bg-gray-200 rounded-full group-hover:bg-gray-300"><HelpCircle size={20}/></div>
                              <span className="font-semibold text-[15px]">Help & support</span>
                          </div>
                          <ChevronRight size={20} className="text-gray-500"/>
                        </div>
                        <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg cursor-pointer group">
                          <div className="flex items-center gap-3">
                              <div className="p-2 bg-gray-200 rounded-full group-hover:bg-gray-300"><MonitorPlay size={20}/></div>
                              <span className="font-semibold text-[15px]">Display & accessibility</span>
                          </div>
                          <ChevronRight size={20} className="text-gray-500"/>
                        </div>
                        <div onClick={logout} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer group">
                          <div className="p-2 bg-gray-200 rounded-full group-hover:bg-gray-300"><LogOut size={20}/></div>
                          <span className="font-semibold text-[15px]">Log Out</span>
                        </div>
                    </div>
                   </>
                 ) : activeSubMenu === 'settings_privacy' ? (
                   <div className="animate-in slide-in-from-right-4 duration-200">
                      <div className="flex items-center gap-2 mb-2 p-1">
                         <button onClick={() => setActiveSubMenu(null)} className="p-2 hover:bg-gray-100 rounded-full"><ChevronRight size={20} className="rotate-180"/></button>
                         <h3 className="font-bold text-xl">Settings & privacy</h3>
                      </div>
                      <div className="space-y-1">
                         <div 
                           onClick={() => {navigate('/settings'); setActiveMenu(null);}}
                           className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                         >
                            <div className="p-2 bg-gray-200 rounded-full"><Settings size={20}/></div>
                            <span className="font-semibold text-sm">Settings</span>
                         </div>
                         <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                            <div className="p-2 bg-gray-200 rounded-full"><ShieldCheck size={20}/></div>
                            <span className="font-semibold text-sm">Privacy Checkup</span>
                         </div>
                         <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                            <div className="p-2 bg-gray-200 rounded-full"><Users size={20}/></div>
                            <span className="font-semibold text-sm">Activity Log</span>
                         </div>
                         <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                            <div className="p-2 bg-gray-200 rounded-full"><Store size={20}/></div>
                            <span className="font-semibold text-sm">Language</span>
                         </div>
                      </div>
                   </div>
                 ) : (
                   <div className="animate-in slide-in-from-right-4 duration-200">
                      <div className="flex items-center gap-2 mb-2 p-1">
                         <button onClick={() => setActiveSubMenu(null)} className="p-2 hover:bg-gray-100 rounded-full"><ChevronRight size={20} className="rotate-180"/></button>
                         <h3 className="font-bold text-xl">Help & support</h3>
                      </div>
                      <div className="space-y-1">
                         <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                            <div className="p-2 bg-gray-200 rounded-full"><HelpCircle size={20}/></div>
                            <span className="font-semibold text-sm">Help Center</span>
                         </div>
                         <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                            <div className="p-2 bg-gray-100 rounded-full"><MessageCircle size={20}/></div>
                            <span className="font-semibold text-sm">Support Inbox</span>
                         </div>
                         <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                            <div className="p-2 bg-gray-200 rounded-full"><ShieldCheck size={20}/></div>
                            <span className="font-semibold text-sm">Report a problem</span>
                         </div>
                      </div>
                   </div>
                 )}
                 <p className="text-[12px] text-gray-500 mt-4 px-2">Privacy  · Terms  · Advertising  · Ad Choices   · Cookies  · More  · Meta © 2024</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Navbar;
