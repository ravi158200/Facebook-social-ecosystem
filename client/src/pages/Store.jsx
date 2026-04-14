import Sidebar from '../components/Sidebar';
import { Search, MapPin, Tag, Smartphone, Car, Home } from 'lucide-react';

const Store = () => {
  const items = [
    { id: 1, title: "iPhone 13 Pro", price: "$650", location: "Mumbai", img: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=500&auto=format&fit=crop&q=60" },
    { id: 2, title: "Mountain Bike", price: "$200", location: "Delhi", img: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=500&auto=format&fit=crop&q=60" },
    { id: 3, title: "Comfortable Sofa", price: "$450", location: "Bangalore", img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format&fit=crop&q=60" },
    { id: 4, title: "Gaming Laptop", price: "$1200", location: "Pune", img: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&auto=format&fit=crop&q=60" },
  ];

  return (
    <div className="flex justify-center md:justify-between mx-auto max-w-[1600px] w-full">
      <div className="p-4 w-[300px] hidden xl:block bg-white h-[calc(100vh-60px)] sticky top-[60px] shadow-sm">
         <h1 className="text-2xl font-bold mb-4">Marketplace</h1>
         <div className="bg-gray-100 rounded-full flex items-center px-3 py-2 mb-4">
            <Search size={18} className="text-gray-500" />
            <input type="text" placeholder="Search Marketplace" className="bg-transparent outline-none ml-2 text-sm" />
         </div>
         <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer bg-gray-100">
               <div className="bg-facebookBlue p-2 rounded-full text-white"><Tag size={20} /></div>
               <span className="font-semibold text-[15px]">Browse all</span>
            </div>
            <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
               <div className="bg-gray-200 p-2 rounded-full"><Smartphone size={20} /></div>
               <span className="font-semibold text-[15px]">Electronics</span>
            </div>
            <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
               <div className="bg-gray-200 p-2 rounded-full"><Car size={20} /></div>
               <span className="font-semibold text-[15px]">Vehicles</span>
            </div>
            <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
               <div className="bg-gray-200 p-2 rounded-full"><Home size={20} /></div>
               <span className="font-semibold text-[15px]">Property</span>
            </div>
         </div>
      </div>
      
      <div className="w-full max-w-[1200px] p-6 flex-1">
        <div className="flex justify-between items-center mb-6">
           <h2 className="text-xl font-bold">Today's picks</h2>
           <div className="text-facebookBlue flex items-center gap-1 cursor-pointer">
              <MapPin size={18} />
              <span className="font-semibold">Mumbai · 40 km</span>
           </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item.id} className="cursor-pointer group">
              <div className="relative aspect-square rounded-xl overflow-hidden mb-2">
                 <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <p className="font-bold text-lg">{item.price}</p>
              <p className="text-[15px] leading-tight">{item.title}</p>
              <p className="text-gray-500 text-sm">{item.location}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Store;
