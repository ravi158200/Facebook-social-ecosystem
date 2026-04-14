import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { Bell, MoreHorizontal, CheckCircle } from 'lucide-react';

const Notifications = () => {
  const { user } = useContext(AuthContext);

  const notifications = [
    { id: 1, type: 'friend', name: 'Rahul Kumar', time: '2m ago', read: false },
    { id: 2, type: 'post', name: 'Sonia Sharma', time: '15m ago', read: false, text: 'reacted to your photo.' },
    { id: 3, type: 'group', name: 'JS Developers', time: '1h ago', read: true, text: 'posted in the group.' },
    { id: 4, type: 'birthday', name: 'Amit Singh', time: '2h ago', read: true, text: 'has a birthday today.' },
    { id: 5, type: 'friend', name: 'Priya Verma', time: '5h ago', read: true },
  ];

  return (
    <div className="flex justify-center md:justify-between mx-auto max-w-[1600px] w-full min-h-screen bg-gray-100">
      <Sidebar />
      <div className="w-full max-w-[800px] p-6 flex-1 bg-white shadow-sm mt-4 rounded-xl mx-4 mb-10 h-fit">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <button className="text-facebookBlue hover:bg-blue-50 p-2 rounded-full"><MoreHorizontal /></button>
        </div>
        
        <div className="flex gap-2 mb-6">
          <button className="bg-blue-50 text-facebookBlue px-4 py-2 rounded-full font-bold text-sm">All</button>
          <button className="hover:bg-gray-100 px-4 py-2 rounded-full font-bold text-sm text-gray-600">Unread</button>
        </div>

        <div className="space-y-1">
          {notifications.map((n) => (
            <div key={n.id} className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${!n.read ? 'bg-blue-50/50' : ''}`}>
               <div className="relative">
                 <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    <img src={`https://ui-avatars.com/api/?name=${n.name}&background=random`} alt="" className="w-full h-full object-cover" />
                 </div>
                 <div className="absolute -bottom-1 -right-1 bg-facebookBlue p-1.5 rounded-full border-2 border-white text-white">
                    <Bell size={12} fill="currentColor" />
                 </div>
               </div>
               <div className="flex-1">
                 <p className="text-[15px] leading-tight">
                    <span className="font-bold">{n.name}</span> {n.type === 'friend' ? 'sent you a friend request.' : n.text}
                 </p>
                 <p className={`text-[13px] ${!n.read ? 'text-facebookBlue font-bold' : 'text-gray-500'}`}>{n.time}</p>
               </div>
               {!n.read && <div className="w-3 h-3 bg-facebookBlue rounded-full shadow-sm shadow-blue-400"></div>}
               <div className="group relative">
                  <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-100 rounded-full"><CheckCircle size={18} className="text-gray-400"/></button>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Notifications;
