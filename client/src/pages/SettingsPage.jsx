import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { Settings, Lock, Globe, Bell, Shield, User } from 'lucide-react';

const SettingsPage = () => {
  const { user, token, login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    location: user.location || '',
    occupation: user.occupation || '',
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const res = await axios.patch(`http://localhost:5000/api/users/${user._id}/update`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      login(res.data, token);
      alert("Settings updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location || '',
      occupation: user.occupation || '',
    });
  };

  return (
    <div className="flex justify-center md:justify-between mx-auto max-w-[1600px] w-full min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 max-w-[1000px] p-6 flex flex-col lg:flex-row gap-6">
        {/* Left Nav */}
        <div className="w-full lg:w-[300px] bg-white rounded-xl shadow-sm p-4 h-fit sticky top-[80px]">
          <h1 className="text-2xl font-bold mb-6">Settings</h1>
          <div className="space-y-1">
             <div className="flex items-center gap-3 p-3 bg-blue-50 text-facebookBlue rounded-lg cursor-pointer">
                <User size={20} />
                <span className="font-semibold">Personal Information</span>
             </div>
             <div className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer text-gray-600">
                <Lock size={20} />
                <span className="font-semibold">Password and Security</span>
             </div>
             <div className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer text-gray-600">
                <Shield size={20} />
                <span className="font-semibold">Privacy Policy</span>
             </div>
             <div className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer text-gray-600">
                <Bell size={20} />
                <span className="font-semibold">Notifications</span>
             </div>
             <div className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer text-gray-600">
                <Globe size={20} />
                <span className="font-semibold">Language and Region</span>
             </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 bg-white rounded-xl shadow-sm p-8">
           <h2 className="text-xl font-bold mb-6 border-b pb-4">Personal General Details</h2>
           <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-600">First Name</label>
                    <input 
                      type="text" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-facebookBlue" 
                    />
                 </div>
                 <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-600">Last Name</label>
                    <input 
                      type="text" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-facebookBlue" 
                    />
                 </div>
              </div>
              <div className="flex flex-col gap-1">
                 <label className="text-sm font-semibold text-gray-600">Email Address</label>
                 <input type="email" disabled value={user.email} className="p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed" />
                 <p className="text-[12px] text-gray-400">Email cannot be changed for security reasons.</p>
              </div>
              <div className="flex flex-col gap-1">
                 <label className="text-sm font-semibold text-gray-600">Location</label>
                 <input 
                   type="text" 
                   name="location"
                   value={formData.location}
                   onChange={handleChange}
                   placeholder="e.g. New York, USA"
                   className="p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-facebookBlue" 
                 />
              </div>
              <div className="flex flex-col gap-1">
                 <label className="text-sm font-semibold text-gray-600">Occupation</label>
                 <input 
                   type="text" 
                   name="occupation"
                   value={formData.occupation}
                   onChange={handleChange}
                   placeholder="e.g. Software Engineer"
                   className="p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-facebookBlue" 
                 />
              </div>
              
              <div className="pt-6 flex justify-end gap-3">
                 <button 
                  type="button" 
                  onClick={handleCancel}
                  className="px-6 py-2 bg-gray-200 text-black font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                 >
                   Cancel
                 </button>
                 <button 
                   type="submit" 
                   disabled={isUpdating}
                   className="px-6 py-2 bg-facebookBlue text-white font-semibold rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                 >
                   {isUpdating ? 'Saving...' : 'Save Changes'}
                 </button>
              </div>
           </form>
           
           <div className="mt-12 bg-red-50 p-6 rounded-xl border border-red-100">
              <h3 className="text-red-600 font-bold mb-2">Danger Zone</h3>
              <p className="text-sm text-gray-600 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
              <button className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition">Delete Account</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
