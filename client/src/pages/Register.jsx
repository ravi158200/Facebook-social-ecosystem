import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    location: '',
    occupation: ''
  });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-[450px] border border-gray-100 border-solid relative">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold">Sign Up</h1>
            <p className="text-gray-500 text-sm mt-1">It's quick and easy.</p>
          </div>
          <button onClick={() => navigate('/login')} className="absolute top-4 right-4 bg-gray-50 hover:bg-gray-200 text-gray-500 rounded-full w-8 h-8 flex items-center justify-center transition-colors">✕</button>
        </div>
        <hr className="mb-4" />
        <form onSubmit={handleRegister} className="flex flex-col gap-3">
          <div className="flex gap-3">
            <input type="text" placeholder="First name" className="p-3 border border-gray-300 rounded-lg bg-gray-50 flex-1 focus:ring-2 ring-facebookBlue outline-none transition-shadow" onChange={(e) => setFormData({...formData, firstName: e.target.value})} required/>
            <input type="text" placeholder="Last name" className="p-3 border border-gray-300 rounded-lg bg-gray-50 flex-1 focus:ring-2 ring-facebookBlue outline-none transition-shadow" onChange={(e) => setFormData({...formData, lastName: e.target.value})} required/>
          </div>
          <input type="email" placeholder="Email" className="p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 ring-facebookBlue outline-none transition-shadow" onChange={(e) => setFormData({...formData, email: e.target.value})} required/>
          <input type="password" placeholder="New password" className="p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 ring-facebookBlue outline-none transition-shadow" onChange={(e) => setFormData({...formData, password: e.target.value})} required/>
          <input type="text" placeholder="Location" className="p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 ring-facebookBlue outline-none transition-shadow" onChange={(e) => setFormData({...formData, location: e.target.value})} />
          <input type="text" placeholder="Occupation" className="p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 ring-facebookBlue outline-none transition-shadow" onChange={(e) => setFormData({...formData, occupation: e.target.value})} />
          
          <p className="text-[11px] text-gray-500 mt-2 leading-tight">
            By clicking Sign Up, you agree to our Terms, Privacy Policy and Cookies Policy. You may receive SMS notifications from us and can opt out at any time.
          </p>
          
          <div className="text-center mt-3 mb-1">
            <button type="submit" className="bg-[#00a400] hover:bg-[#009000] text-white font-bold py-3 px-10 rounded-xl w-3/4 mx-auto text-lg transition-colors shadow-lg shadow-green-100">
              Sign Up
            </button>
          </div>
          <div className="text-center mt-2 pb-2">
            <span onClick={() => navigate('/login')} className="text-facebookBlue text-[15px] font-semibold cursor-pointer hover:underline transition-all">
               Already have an account?
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Register;
