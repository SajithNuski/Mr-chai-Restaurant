import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import logoImg from '../assets/logo.png';

export default function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({ loading: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true });

    try {
      const res = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', data.username);
        toast.success('Access granted! Welcome back.');
        onLoginSuccess();
      } else {
        toast.error(data.error || 'Invalid credentials.');
      }
    } catch (err) {
      // resilience check: if connection is refused (server not running), check if they entered seed defaults to mock login
      if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('adminToken', 'mock-token-fallback');
        localStorage.setItem('adminUser', 'admin (mock)');
        toast.success('Access granted (Offline Mode)! Welcome back.');
        onLoginSuccess();
      } else {
        toast.error('Cannot connect to backend server. (Hint: default login is admin/admin123)');
      }
    } finally {
      setStatus({ loading: false });
    }
  };

  return (
    <section className="admin-login-sec">
      <motion.div 
        className="admin-login-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="admin-login-header">
          <img src={logoImg} alt="Mr. Chai Logo" className="logo-img" style={{ margin: '0 auto 16px', height: '60px', width: '60px' }} />
          <p className="gold-accent" style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Management Portal</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="login-username">Admin Username</label>
            <input 
              type="text" 
              id="login-username" 
              className="form-control" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0, position: 'relative' }}>
            <label className="form-label" htmlFor="login-password">Access Password</label>
            <input 
              type={showPassword ? 'text' : 'password'} 
              id="login-password" 
              className="form-control" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: 0, bottom: '10px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={status.loading}>
            {status.loading ? 'Authenticating...' : (
              <>
                <Shield size={16} /> Authenticate
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '11px', color: 'rgba(245, 240, 232, 0.4)', borderTop: '1px solid rgba(212, 160, 23, 0.08)', paddingTop: '16px' }}>
          <p>Demo Credentials: <strong>admin</strong> / <strong>admin123</strong></p>
        </div>
      </motion.div>
    </section>
  );
}
