import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Gamepad2, Trophy, Video, Play, Search, MoreHorizontal, ChevronRight } from 'lucide-react';

const Gaming = () => {
  const [activeSub, setActiveSub] = useState('Home'); // Home, Videos, Tournaments
  const [selectedStream, setSelectedStream] = useState(null);
  const [joinedIds, setJoinedIds] = useState(new Set());

  const games = [
    { id: 1, name: "Valorant", players: "1.2M", img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=60" },
    { id: 2, name: "League of Legends", players: "800k", img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&auto=format&fit=crop&q=60" },
    { id: 3, name: "Minecraft", players: "2.5M", img: "https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?w=500&auto=format&fit=crop&q=60" },
    { id: 4, name: "Cyberpunk 2077", players: "400k", img: "https://images.unsplash.com/photo-1605898835518-20384ec261bd?w=500&auto=format&fit=crop&q=60" },
    { id: 5, name: "Apex Legends", players: "600k", img: "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=500&auto=format&fit=crop&q=60" },
  ];

  const streams = [
    { id: 1, title: "Grand Final Tournament!", viewers: "45.2k", user: "ProGamer_X", img: "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=500&auto=format&fit=crop&q=60", vid: "https://www.w3schools.com/html/mov_bbb.mp4" },
    { id: 2, title: "Road to Radiant - Solo Queue", viewers: "12k", user: "Tenz_Copy", img: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500&auto=format&fit=crop&q=60", vid: "https://www.w3schools.com/html/movie.mp4" },
    { id: 3, title: "Chill Vibes Only - No Tox", viewers: "8.5k", user: "LoFi_Gaming", img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=60", vid: "https://www.w3schools.com/html/mov_bbb.mp4" },
    { id: 4, title: "New Patch Review!", viewers: "3k", user: "PatchNotes", img: "https://images.unsplash.com/photo-1600861194942-f883de0dfe96?w=500&auto=format&fit=crop&q=60", vid: "https://www.w3schools.com/html/movie.mp4" },
    { id: 5, title: "Horror Game High Jinks 😱", viewers: "22k", user: "Fearless_One", img: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=60", vid: "https://www.w3schools.com/html/mov_bbb.mp4" },
  ];

  const tournaments = [
    { id: 1, name: "Spring Valorant Open", status: "Live", prize: "$50,000", participants: "128 Teams", img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=60" },
    { id: 2, name: "League Legends World Inv", status: "Upcoming", prize: "$100,000", participants: "64 Teams", img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=60" },
    { id: 3, name: "Chess Masters Blitz", status: "Ending Soon", prize: "$10,000", participants: "256 Players", img: "https://images.unsplash.com/photo-1529697210530-8c4734574e30?w=500&auto=format&fit=crop&q=60" },
  ];

  const handleJoin = (id) => {
     setJoinedIds(prev => new Set(prev).add(id));
     alert("You've successfully registered for this tournament!");
  };

  return (
    <div className="flex justify-center md:justify-between mx-auto max-w-[1600px] w-full min-h-screen bg-gray-100 relative">
      <div className="p-4 w-[360px] hidden xl:block bg-white h-[calc(100vh-60px)] sticky top-[60px] shadow-sm overflow-y-auto no-scrollbar">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-black text-gray-900">Gaming</h1>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Search size={20} /></button>
        </div>
        
        <div className="space-y-1 mb-6">
          <div onClick={() => setActiveSub('Home')} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${activeSub === 'Home' ? 'bg-blue-50 text-facebookBlue' : 'hover:bg-gray-100'}`}>
            <div className={`${activeSub === 'Home' ? 'bg-facebookBlue text-white shadow-md shadow-blue-100' : 'bg-gray-200'} p-2 rounded-full`}><Play size={20} fill={activeSub === 'Home' ? "currentColor" : "none"} /></div>
            <span className="font-bold">Play games</span>
          </div>
          <div onClick={() => setActiveSub('Videos')} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${activeSub === 'Videos' ? 'bg-blue-50 text-facebookBlue' : 'hover:bg-gray-100'}`}>
            <div className={`${activeSub === 'Videos' ? 'bg-facebookBlue text-white shadow-md shadow-blue-100' : 'bg-gray-200'} p-2 rounded-full`}><Video size={20} /></div>
            <span className="font-bold">Gaming video</span>
          </div>
          <div onClick={() => setActiveSub('Tournaments')} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${activeSub === 'Tournaments' ? 'bg-blue-50 text-facebookBlue' : 'hover:bg-gray-100'}`}>
            <div className={`${activeSub === 'Tournaments' ? 'bg-facebookBlue text-white shadow-md shadow-blue-100' : 'bg-gray-200'} p-2 rounded-full`}><Trophy size={20} /></div>
            <span className="font-bold">Tournaments</span>
          </div>
        </div>

        <hr className="mb-4" />
        
        <div className="mb-4">
          <h3 className="font-bold text-[17px] mb-2 px-2">Your Games</h3>
          <p className="text-gray-500 text-sm px-2">Games you've played will appear here.</p>
        </div>

        <div className="mb-4">
           <h3 className="font-bold text-[17px] mb-2 px-2">Followed Streamers</h3>
           {[1,2,3].map(i => {
              const stream = streams[i-1];
              return (
              <div key={i} onClick={() => setSelectedStream(stream)} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-xl cursor-pointer group transition-all">
                 <img src={`https://ui-avatars.com/api/?name=${stream.user}&background=random`} className="w-10 h-10 rounded-full border border-gray-100" />
                 <div className="flex-1 overflow-hidden">
                    <p className="font-black text-sm text-gray-900 group-hover:text-facebookBlue transition-colors truncate">{stream.user}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Live now</p>
                 </div>
                 <div className="w-2.5 h-2.5 bg-green-500 rounded-full ml-auto shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse" />
              </div>
           )})}
        </div>
      </div>

      <div className="flex-1 max-w-[1100px] p-6 lg:p-10 overflow-hidden">
        {activeSub === 'Home' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="mb-10">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-black tracking-tight">Live gaming videos</h2>
                 <button onClick={() => setActiveSub('Videos')} className="text-facebookBlue font-bold flex items-center gap-1 hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors">See all <ChevronRight size={18} /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {streams.slice(0,3).map(s => (
                  <StreamCard key={s.id} stream={s} onClick={() => setSelectedStream(s)} />
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-black tracking-tight">Popular games</h2>
                 <button className="text-facebookBlue font-bold flex items-center gap-1 hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors">See all <ChevronRight size={18} /></button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {games.map(g => (
                  <GameCard key={g.id} game={g} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Selected Video Player Modal */}
        {selectedStream && (
          <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col pt-10 px-4 animate-in fade-in zoom-in-95">
             <div className="max-w-[1200px] mx-auto w-full">
                <div className="flex justify-between items-center mb-6 text-white">
                   <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-facebookBlue">
                        <img src={`https://ui-avatars.com/api/?name=${selectedStream.user}&background=random`} alt="" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black">{selectedStream.title}</h2>
                        <p className="text-sm font-bold text-gray-400 capitalize flex items-center gap-2">
                           {selectedStream.user} • <span className="text-red-500">Live</span>
                        </p>
                      </div>
                   </div>
                   <button onClick={() => setSelectedStream(null)} className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors font-black text-2xl">×</button>
                </div>
                <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                   <video src={selectedStream.vid} className="w-full h-full" controls autoPlay />
                </div>
             </div>
          </div>
        )}

        {activeSub === 'Videos' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="mb-10 border-b border-gray-200 pb-6">
                <h2 className="text-3xl font-black mb-2 tracking-tight">Gaming Video</h2>
                <p className="text-gray-500 font-bold">Watch live streams and top gaming clips from your favorite creators.</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                {streams.map(s => (
                  <StreamCard key={s.id} stream={s} onClick={() => setSelectedStream(s)} />
                ))}
             </div>
          </div>
        )}

        {activeSub === 'Tournaments' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="mb-10 border-b border-gray-200 pb-6">
                <h2 className="text-3xl font-black mb-2 tracking-tight">Tournaments</h2>
                <p className="text-gray-500 font-bold">Discover and join community-run tournaments.</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tournaments.map(t => {
                   const isJoined = joinedIds.has(t.id);
                   return (
                   <div key={t.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 flex group hover:shadow-xl transition-all duration-300">
                      <div className="w-[180px] h-[180px] relative shrink-0">
                         <img src={t.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                         <div className="absolute top-2 left-2 bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">{t.status}</div>
                      </div>
                      <div className="p-5 flex flex-col justify-between flex-1">
                         <div>
                            <h3 className="font-black text-lg text-gray-900 mb-1 leading-tight">{t.name}</h3>
                            <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest">{t.participants}</p>
                         </div>
                         <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
                            <div>
                               <p className="text-[10px] font-black text-gray-400 uppercase">Prize Pool</p>
                               <p className="font-black text-facebookBlue text-xl">{t.prize}</p>
                            </div>
                            <button 
                              onClick={() => handleJoin(t.id)} 
                              className={`font-black px-6 py-2 rounded-xl text-sm transition-all shadow-lg shadow-blue-100 ${isJoined ? 'bg-gray-200 text-gray-700' : 'bg-facebookBlue text-white hover:scale-[1.05]'}`}
                            >
                               {isJoined ? 'Joined' : 'Join'}
                            </button>
                         </div>
                      </div>
                   </div>
                )})}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StreamCard = ({ stream, onClick }) => (
  <div onClick={onClick} className="cursor-pointer group">
    <div className="relative aspect-video rounded-2xl overflow-hidden mb-3 shadow-sm border border-black/5">
      <img src={stream.img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-lg">Live</div>
      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[12px] px-2 py-1 rounded-lg flex items-center gap-1 font-bold">
        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> {stream.viewers} viewers
      </div>
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
         <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all shadow-2xl">
            <Play fill="white" size={24} className="ml-1" />
         </div>
      </div>
    </div>
    <div className="flex gap-3">
       <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
          <img src={`https://ui-avatars.com/api/?name=${stream.user}&background=random`} alt="" />
       </div>
       <div className="overflow-hidden">
          <p className="font-bold text-gray-900 leading-tight truncate">{stream.title}</p>
          <p className="text-sm text-gray-500 font-bold mt-0.5 group-hover:text-facebookBlue transition-colors">{stream.user}</p>
       </div>
    </div>
  </div>
);

const GameCard = ({ game }) => (
  <div className="cursor-pointer group">
    <div className="aspect-[9/12] bg-gray-200 rounded-2xl overflow-hidden mb-2 relative shadow-sm border border-white/10">
       <img src={game.img} alt={game.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
       <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
    <p className="font-bold text-[15px] truncate px-1 text-gray-900">{game.name}</p>
    <p className="text-[13px] text-gray-500 font-bold px-1">{game.players} players</p>
  </div>
);

export default Gaming;
