import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ILLUSTRATION_URL =
  'https://cdni.iconscout.com/illustration/premium/thumb/social-media-8121536-6556700.png';

const inputStyle = {
  padding: '0.8rem 1rem',
  border: '1.5px solid #dddfe2',
  borderRadius: '8px',
  fontSize: '0.95rem',
  outline: 'none',
  background: '#f7f8fa',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  width: '100%',
  boxSizing: 'border-box',
};

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    location: '',
    occupation: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });
  const handleFocus = (e) => { e.target.style.borderColor = '#1877f2'; e.target.style.boxShadow = '0 0 0 3px rgba(24,119,242,0.12)'; };
  const handleBlur  = (e) => { e.target.style.borderColor = '#dddfe2'; e.target.style.boxShadow = 'none'; };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e8f0fe 0%, #f0f2f5 60%, #dce9ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ display: 'flex', width: '100%', maxWidth: '980px', alignItems: 'center', gap: '3rem', flexWrap: 'wrap', justifyContent: 'center' }}>

        {/* ── Left: Branding + Illustration ── */}
        <div style={{ flex: '1 1 360px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: '#1877f2', letterSpacing: '-1px', margin: 0 }}>facebook</h1>
          <p style={{ fontSize: '1.35rem', color: '#1c1e21', lineHeight: 1.5, margin: 0, maxWidth: '360px' }}>
            Create an account and start connecting with the people and things you care about.
          </p>
          <img
            src={ILLUSTRATION_URL}
            alt="Social Media Illustration"
            style={{
              width: '100%',
              maxWidth: '420px',
              marginTop: '0.5rem',
              filter: 'drop-shadow(0 20px 40px rgba(24,119,242,0.18))',
              animation: 'floatUp 3.5s ease-in-out infinite alternate',
              borderRadius: '16px',
            }}
            onError={(e) => {
              e.target.src = 'https://static.vecteezy.com/system/resources/previews/009/342/688/original/3d-social-media-platform-with-like-and-chat-icon-png.png';
            }}
          />
        </div>

        {/* ── Right: Register Card ── */}
        <div style={{ flex: '1 1 340px', maxWidth: '440px', width: '100%' }}>
          <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 8px 40px rgba(0,0,0,0.12)', padding: '2rem', border: '1px solid #e4e6eb', position: 'relative' }}>
            {/* Header */}
            <div style={{ marginBottom: '0.75rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0, color: '#1c1e21' }}>Create Account</h2>
              <p style={{ color: '#606770', fontSize: '0.9rem', margin: '0.25rem 0 0' }}>It's quick and easy.</p>
            </div>
            <button
              id="close-register"
              onClick={() => navigate('/login')}
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: '#f0f2f5', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '1rem', color: '#606770', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >✕</button>
            <hr style={{ border: 'none', borderTop: '1px solid #dddfe2', margin: '0.75rem 0 1rem' }} />

            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <input id="reg-firstname" type="text" placeholder="First name" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} onChange={handleChange('firstName')} required />
                <input id="reg-lastname"  type="text" placeholder="Last name"  style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} onChange={handleChange('lastName')}  required />
              </div>
              <input id="reg-email"      type="email"    placeholder="Email"        style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} onChange={handleChange('email')}      required />
              <input id="reg-password"   type="password" placeholder="New password" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} onChange={handleChange('password')}   required />
              <input id="reg-location"   type="text"     placeholder="Location"     style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} onChange={handleChange('location')} />
              <input id="reg-occupation" type="text"     placeholder="Occupation"   style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} onChange={handleChange('occupation')} />

              <p style={{ fontSize: '0.68rem', color: '#8a8d91', lineHeight: '1.4', marginTop: '0.4rem' }}>
                By clicking Sign Up, you agree to our <span style={{ color: '#1877f2', cursor: 'pointer' }}>Terms</span>, <span style={{ color: '#1877f2', cursor: 'pointer' }}>Privacy Policy</span> and <span style={{ color: '#1877f2', cursor: 'pointer' }}>Cookies Policy</span>.
              </p>

              <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                <button
                  id="register-submit"
                  type="submit"
                  disabled={loading}
                  style={{ background: loading ? '#5a9e4a' : '#00a400', color: '#fff', fontWeight: 700, fontSize: '1.05rem', padding: '0.75rem 2.5rem', borderRadius: '10px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s', boxShadow: '0 4px 18px rgba(0,164,0,0.2)', minWidth: '180px' }}
                  onMouseEnter={(e) => !loading && (e.target.style.background = '#009000')}
                  onMouseLeave={(e) => !loading && (e.target.style.background = '#00a400')}
                >
                  {loading ? 'Creating account…' : 'Sign Up'}
                </button>
              </div>

              <div style={{ textAlign: 'center', marginTop: '0.25rem' }}>
                <span
                  id="goto-login"
                  onClick={() => navigate('/login')}
                  style={{ color: '#1877f2', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}
                  onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')}
                  onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
                >
                  Already have an account?
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatUp {
          from { transform: translateY(0px); }
          to   { transform: translateY(-14px); }
        }
      `}</style>
    </div>
  );
};

export default Register;
