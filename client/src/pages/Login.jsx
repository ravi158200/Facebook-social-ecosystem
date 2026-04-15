import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ILLUSTRATION_URL =
  'https://cdni.iconscout.com/illustration/premium/thumb/social-media-8121536-6556700.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e8f0fe 0%, #f0f2f5 60%, #dce9ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ display: 'flex', width: '100%', maxWidth: '960px', alignItems: 'center', gap: '3rem', flexWrap: 'wrap', justifyContent: 'center' }}>

        {/* ── Left: Branding + Illustration ── */}
        <div style={{ flex: '1 1 380px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: '#1877f2', letterSpacing: '-1px', margin: 0 }}>facebook</h1>
          <p style={{ fontSize: '1.4rem', color: '#1c1e21', lineHeight: '1.5', margin: 0, maxWidth: '380px' }}>
            Connect with friends and the world around you on Facebook.
          </p>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
            <img
              src={ILLUSTRATION_URL}
              alt="Social Media Illustration"
              style={{
                width: '100%',
                maxWidth: '420px',
                filter: 'drop-shadow(0 20px 40px rgba(24,119,242,0.18))',
                animation: 'floatUp 3.5s ease-in-out infinite alternate',
                borderRadius: '16px',
              }}
              onError={(e) => {
                e.target.src = 'https://static.vecteezy.com/system/resources/previews/009/342/688/original/3d-social-media-platform-with-like-and-chat-icon-png.png';
              }}
            />
          </div>
        </div>

        {/* ── Right: Login Card ── */}
        <div style={{ flex: '1 1 320px', maxWidth: '400px', width: '100%' }}>
          <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 8px 40px rgba(0,0,0,0.12)', padding: '2rem', border: '1px solid #e4e6eb' }}>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                id="login-email"
                type="email"
                placeholder="Email or phone number"
                style={{ padding: '0.9rem 1rem', border: '1.5px solid #dddfe2', borderRadius: '8px', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={(e) => (e.target.style.borderColor = '#1877f2')}
                onBlur={(e) => (e.target.style.borderColor = '#dddfe2')}
                required
              />
              <input
                id="login-password"
                type="password"
                placeholder="Password"
                style={{ padding: '0.9rem 1rem', border: '1.5px solid #dddfe2', borderRadius: '8px', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={(e) => (e.target.style.borderColor = '#1877f2')}
                onBlur={(e) => (e.target.style.borderColor = '#dddfe2')}
                required
              />
              <button
                id="login-submit"
                type="submit"
                disabled={loading}
                style={{ background: loading ? '#6c9edc' : '#1877f2', color: '#fff', fontWeight: 700, fontSize: '1.1rem', padding: '0.8rem', borderRadius: '8px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s, transform 0.1s', letterSpacing: '0.3px' }}
                onMouseEnter={(e) => !loading && (e.target.style.background = '#166fe5')}
                onMouseLeave={(e) => !loading && (e.target.style.background = '#1877f2')}
              >
                {loading ? 'Logging in…' : 'Log In'}
              </button>
              <div style={{ textAlign: 'center', color: '#1877f2', fontSize: '0.9rem', cursor: 'pointer' }}
                onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')}
                onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}>
                Forgot password?
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid #dddfe2', margin: '0.25rem 0' }} />
              <div style={{ textAlign: 'center' }}>
                <button
                  id="goto-register"
                  type="button"
                  onClick={() => navigate('/register')}
                  style={{ background: '#42b72a', color: '#fff', fontWeight: 700, fontSize: '1rem', padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseEnter={(e) => (e.target.style.background = '#36a420')}
                  onMouseLeave={(e) => (e.target.style.background = '#42b72a')}
                >
                  Create new account
                </button>
              </div>
            </form>
          </div>
          <div style={{ textAlign: 'center', fontSize: '0.85rem', marginTop: '1.25rem', color: '#606770' }}>
            <p><span style={{ fontWeight: 700, cursor: 'pointer' }}>Create a Page</span> for a celebrity, brand or business.</p>
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

export default Login;
