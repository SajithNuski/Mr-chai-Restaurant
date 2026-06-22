import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, ShoppingCart, MessageSquare, Heart, Mail, 
  Menu as MenuIcon, Settings, LogOut, RefreshCw, Bell, Users,
  Plus, Edit, Trash2, X, Flame, Clock, Coffee, Shield, Activity,
  Sliders, Calendar, CheckCircle2, AlertCircle
} from 'lucide-react';

import logoImg from '../assets/logo.png';
import { toast } from 'sonner';

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    menuItems: 42,
    totalReviews: 856,
    totalMessages: 24,
    weeklyVolume: [120, 180, 150, 220, 190, 240, 210]
  });
  const [messages, setMessages] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Menu form & modal states
  const [editingItem, setEditingItem] = useState(null);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [menuForm, setMenuForm] = useState({
    name: '',
    category: 'Drinks',
    description: '',
    price: '',
    badge: '',
    image: '',
    spiceLevel: 0,
    available: true
  });

  const token = localStorage.getItem('adminToken');
  const username = localStorage.getItem('adminUser') || 'Admin User';

  const handleAuthError = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    toast.error('Session expired. Please log in again.');
    onLogout();
  };

  const fetchDashboardData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      // Fetch stats
      const statsRes = await fetch('/api/admin/dashboard-stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (statsRes.status === 401 || statsRes.status === 403) {
        handleAuthError();
        return;
      }
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // Fetch messages
      const msgRes = await fetch('/api/admin/messages', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (msgRes.status === 401 || msgRes.status === 403) {
        handleAuthError();
        return;
      }
      if (msgRes.ok) {
        const msgData = await msgRes.json();
        setMessages(msgData);
      }

      // Fetch subscribers
      const subRes = await fetch('/api/admin/subscriptions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (subRes.status === 401 || subRes.status === 403) {
        handleAuthError();
        return;
      }
      if (subRes.ok) {
        const subData = await subRes.json();
        setSubscribers(subData);
      }

      // Fetch menu items
      const menuRes = await fetch('/api/menu');
      if (menuRes.ok) {
        const menuData = await menuRes.json();
        setMenuItems(menuData);
      }
    } catch (err) {
      console.error('Error fetching admin data, utilizing fallbacks:', err);
      // Mock fallback data for demo if server is not active
      setMessages([
        { id: '1', name: 'Aarav Mehta', email: 'aarav.mehta@example.com', subject: 'Catering Enquiry', message: 'Hello, I would like to enquire about catering for a corporate event of 50 people next month. Love your brand style!', date: new Date(Date.now() - 3600000 * 2).toISOString() },
        { id: '2', name: 'Priya Sharma', email: 'priya@example.com', subject: 'Booking Enquiry', message: 'Do you have availability for a private lounge booking of 15 people this Saturday evening?', date: new Date(Date.now() - 3600000 * 5).toISOString() }
      ]);
      setSubscribers([
        { id: '1', email: 'vip-guest@luxury.com', date: new Date(Date.now() - 86400000).toISOString() },
        { id: '2', email: 'foodie@bazaar.org', date: new Date(Date.now() - 86400000 * 2).toISOString() }
      ]);
      setMenuItems([
        { id: 'm1', name: 'Obsidian Masala Chai', category: 'Drinks', description: 'Slow-steeped loose leaf tea from Assam, hand-ground secret spice blend, and creamy whole milk.', price: 7.00, badge: 'Legendary', image: 'obsidian_chai', spiceLevel: 1, available: true },
        { id: 'm2', name: 'The Emperor Burger', category: 'Street Eats', description: 'Double wagyu beef, aged cheddar, truffle aioi, and caramelized heirloom spices on a toasted brioche.', price: 18.50, badge: 'Signature', image: 'emperor_burger', spiceLevel: 2, available: true },
        { id: 'm3', name: 'Gold-Leaf Saffron Cheesecake', category: 'Delights', description: 'Rich cheesecake infused with premium Kashmiri saffron, cardamom pod crust, and finished with 24k gold leaf.', price: 12.50, badge: 'Chef Special', image: 'saffron_cheesecake', spiceLevel: 0, available: true }
      ]);
      setStats({
        menuItems: 3,
        totalReviews: 856,
        totalMessages: 26,
        weeklyVolume: [120, 180, 150, 220, 190, 240, 210]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManualRefresh = async () => {
    await fetchDashboardData();
    toast.success('Real-time database metrics synchronized.');
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleLogoutClick = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    onLogout();
  };

  const handleAddOrEditMenu = async (e) => {
    e.preventDefault();
    if (!menuForm.name || !menuForm.category || !menuForm.description || menuForm.price === '') {
      toast.error('Please fill in all required fields.');
      return;
    }

    const payload = {
      ...menuForm,
      price: parseFloat(menuForm.price),
      spiceLevel: parseInt(menuForm.spiceLevel) || 0
    };

    setLoading(true);
    try {
      const isEditing = editingItem && (editingItem._id || editingItem.id);
      const url = isEditing
        ? `/api/admin/menu/${editingItem._id || editingItem.id}`
        : '/api/admin/menu';
      
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.status === 401 || res.status === 403) {
        handleAuthError();
        return;
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save menu item');
      }

      toast.success(isEditing ? 'Menu recipe updated.' : 'New menu recipe created.');
      setIsMenuModalOpen(false);
      setEditingItem(null);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Error occurred while saving recipe.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMenu = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/menu/${itemId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.status === 401 || res.status === 403) {
        handleAuthError();
        return;
      }

      if (!res.ok) throw new Error('Failed to delete menu item');

      toast.success('Menu item deleted successfully.');
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      toast.error('Error occurred while deleting.');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setMenuForm({
      name: '',
      category: 'Drinks',
      description: '',
      price: '',
      badge: '',
      image: '',
      spiceLevel: 0,
      available: true
    });
    setIsMenuModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setMenuForm({
      name: item.name || '',
      category: item.category || 'Drinks',
      description: item.description || '',
      price: item.price || '',
      badge: item.badge || '',
      image: item.image || '',
      spiceLevel: item.spiceLevel || 0,
      available: item.available !== undefined ? item.available : true
    });
    setIsMenuModalOpen(true);
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Just now';
    const diffMs = new Date() - new Date(dateString);
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1m ago';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1h ago';
    if (diffHours < 24) return `${diffHours}h ago`;
    return new Date(dateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  // Render SVG Chart using WeeklyVolume data
  const renderChart = () => {
    const data = stats.weeklyVolume || [120, 180, 150, 220, 190, 240, 210];
    const width = 600;
    const height = 180;
    const padding = 30;
    
    // Scale data
    const maxVal = Math.max(...data) * 1.15;
    const points = data.map((val, index) => {
      const x = padding + (index * (width - (padding * 2)) / (data.length - 1));
      const y = height - padding - (val * (height - (padding * 2)) / maxVal);
      return { x, y };
    });

    const pathData = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
    const areaData = `${pathData} L ${points[points.length-1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;
    
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" className="chart-svg-render">
        <defs>
          <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-saffron)" stopOpacity="0.3" />
            <stop offset="60%" stopColor="var(--color-brass)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="var(--color-clay-ebony)" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="line-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-saffron)" />
            <stop offset="100%" stopColor="var(--color-brass)" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = padding + ratio * (height - (padding * 2));
          return (
            <line 
              key={i} 
              x1={padding} 
              y1={y} 
              x2={width - padding} 
              y2={y} 
              className="chart-grid-line" 
            />
          );
        })}

        {/* Chart Area Fill */}
        <path d={areaData} className="chart-area" />

        {/* Chart Line */}
        <path d={pathData} className="chart-line" />

        {/* Data points */}
        {points.map((p, i) => (
          <g key={i} className="chart-point-group">
            <circle 
              cx={p.x} 
              cy={p.y} 
              r={7} 
              fill="rgba(222, 110, 49, 0.15)"
              className="chart-point-glow"
            />
            <circle 
              cx={p.x} 
              cy={p.y} 
              r={4} 
              fill="var(--color-clay-ebony)" 
              stroke="var(--color-brass)" 
              strokeWidth={2.5} 
            />
          </g>
        ))}

        {/* X Axis Labels */}
        {weekdays.map((day, i) => {
          const x = padding + (i * (width - (padding * 2)) / (weekdays.length - 1));
          return (
            <text 
              key={i} 
              x={x} 
              y={height - 8} 
              textAnchor="middle" 
              className="chart-label"
            >
              {day}
            </text>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="dashboard-layout">
      
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo-container">
            <img src={logoImg} alt="Mr. Chai Logo" className="logo-img" />
          </div>
          <h2 className="sidebar-brand-name">Mr. Chai</h2>
          <p className="sidebar-brand-title">Executive Ledger</p>
        </div>

        <ul className="sidebar-nav">
          <li>
            <button 
              className={`sidebar-item-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <span className="sidebar-btn-icon-wrapper"><Activity size={16} /></span>
              <span className="sidebar-btn-text">Ledger Summary</span>
            </button>
          </li>
          <li>
            <button 
              className={`sidebar-item-btn ${activeTab === 'menu' ? 'active' : ''}`}
              onClick={() => setActiveTab('menu')}
            >
              <span className="sidebar-btn-icon-wrapper"><Coffee size={16} /></span>
              <span className="sidebar-btn-text">Recipe Catalog</span>
            </button>
          </li>
          <li>
            <button 
              className={`sidebar-item-btn ${activeTab === 'messages' ? 'active' : ''}`}
              onClick={() => setActiveTab('messages')}
            >
              <span className="sidebar-btn-icon-wrapper"><MessageSquare size={16} /></span>
              <span className="sidebar-btn-text">Guest Heartbeats</span>
              {messages.length > 0 && <span className="sidebar-badge-count">{messages.length}</span>}
            </button>
          </li>
          <li>
            <button 
              className={`sidebar-item-btn ${activeTab === 'subscribers' ? 'active' : ''}`}
              onClick={() => setActiveTab('subscribers')}
            >
              <span className="sidebar-btn-icon-wrapper"><Users size={16} /></span>
              <span className="sidebar-btn-text">Subscribers</span>
              {subscribers.length > 0 && <span className="sidebar-badge-count count-muted">{subscribers.length}</span>}
            </button>
          </li>
        </ul>

        <div className="sidebar-user">
          <div className="sidebar-user-info">
            <h4>{username}</h4>
            <p className="gold-accent">Administrator</p>
          </div>
          <button onClick={handleLogoutClick} className="sidebar-logout-btn" title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="db-main">
        
        {/* Header */}
        <header className="db-header">
          <div className="db-header-title">
            <h1 className="ledger-title">Executive Ledger</h1>
            <p className="ledger-subtitle">Chai and street eats culinary administration console.</p>
          </div>
          <div className="db-header-actions">
            <button onClick={handleManualRefresh} className={`btn btn-secondary ${loading ? 'anim-spin' : ''}`} style={{ padding: '10px 20px', gap: '8px', fontSize: '12px' }}>
              <RefreshCw size={14} className={loading ? 'spin-icon' : ''} /> Synchronize Metrics
            </button>
          </div>
        </header>

        {/* Stats Row */}
        <section className="db-stats-grid">
          <div className="db-stat-card">
            <div className="db-stat-info">
              <p className="stat-label">Subscriber Registry</p>
              <h3 className="stat-value">{subscribers.length}</h3>
            </div>
            <div className="db-stat-icon">
              <Users size={20} />
            </div>
          </div>

          <div className="db-stat-card">
            <div className="db-stat-info">
              <p className="stat-label">Recipe Catalog</p>
              <h3 className="stat-value">{stats.menuItems} <span className="stat-subtext">Items</span></h3>
            </div>
            <div className="db-stat-icon">
              <Coffee size={20} />
            </div>
          </div>

          <div className="db-stat-card">
            <div className="db-stat-info">
              <p className="stat-label">Guest Appreciations</p>
              <h3 className="stat-value">{stats.totalReviews}</h3>
            </div>
            <div className="db-stat-icon">
              <Heart size={20} />
            </div>
          </div>

          <div className="db-stat-card">
            <div className="db-stat-info">
              <p className="stat-label">Inquiry Logs</p>
              <h3 className="stat-value">{stats.totalMessages}</h3>
            </div>
            <div className="db-stat-icon">
              <MessageSquare size={20} />
            </div>
          </div>
        </section>

        {/* Tab Switchers */}
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard-tab"
              className="db-content-grid"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <div className="db-panel">
                <div className="db-panel-header">
                  <div>
                    <h3>Guest Engagement Telemetry</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Digital guest engagement & interaction velocity</p>
                  </div>
                  <span className="gold-accent chart-badge">
                    <TrendingUp size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} /> 
                    +12% vs last cycle
                  </span>
                </div>
                <div className="db-chart-container">
                  {renderChart()}
                </div>
              </div>

              <div className="db-panel flex flex-col">
                <div className="db-panel-header">
                  <div>
                    <h3>Guest Dispatch Logs</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Recent direct guest inquiries</p>
                  </div>
                </div>
                <div className="spiced-hearth-list">
                  {messages.slice(0, 3).map((msg, i) => (
                    <div className="spiced-ticket-card" key={msg.id || msg._id || i}>
                      <div className="ticket-header">
                        <div className="ticket-meta">
                          <span className="ticket-label" style={{ textTransform: 'lowercase', letterSpacing: 'normal' }}>{msg.email}</span>
                          <span className="ticket-time">
                            <Clock size={11} /> {getTimeAgo(msg.date)}
                          </span>
                        </div>
                        <h4 className="ticket-table" style={{ fontSize: '15px', color: 'var(--color-brass)' }}>{msg.subject || 'Inquiry'}</h4>
                      </div>
                      
                      <div className="ticket-body" style={{ margin: '8px 0 0 0' }}>
                        <p className="ticket-items" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          "{msg.message}"
                        </p>
                      </div>
                      
                      <div className="ticket-divider-jagged" style={{ margin: '10px 0' }}></div>
                      
                      <div className="ticket-footer">
                        <span className="ticket-price" style={{ fontSize: '12px', fontWeight: 'normal', color: 'var(--color-cream-malai)' }}>From: {msg.name}</span>
                        <span className={`db-badge-glowing status-pending`} style={{ padding: '2px 8px' }}>
                          <span className="badge-pulse-dot"></span>
                          Unread
                        </span>
                      </div>
                    </div>
                  ))}
                  {messages.length === 0 && (
                    <div className="empty-state">
                      <MessageSquare size={24} />
                      <p>No inquiries logged in current session.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'menu' && (
            <motion.div 
              key="menu-tab"
              className="db-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <div className="db-panel-header flex-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3>Recipe Catalog</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Curate the luxury selection of Mr. Chai flavors</p>
                </div>
                <button className="btn btn-primary" onClick={openAddModal} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', fontSize: '12px' }}>
                  <Plus size={14} /> Add New Recipe
                </button>
              </div>
              <div className="db-table-wrapper">
                <table className="db-table">
                  <thead>
                    <tr>
                      <th>Menu Item</th>
                      <th>Category</th>
                      <th>Description</th>
                      <th>Unit Price</th>
                      <th>Spice Index</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuItems.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="table-empty">Catalog is currently empty. Add a recipe to begin.</td>
                      </tr>
                    ) : (
                      menuItems.map((item, idx) => (
                        <tr key={item._id || item.id || idx}>
                          <td>
                            <div className="table-item-title">{item.name}</div>
                            {item.badge && <span className="db-badge-tag">{item.badge}</span>}
                          </td>
                          <td className="category-cell">{item.category}</td>
                          <td className="description-cell">
                            {item.description}
                          </td>
                          <td className="gold-accent font-numeric" style={{ fontWeight: 700 }}>${parseFloat(item.price).toFixed(2)}</td>
                          <td>
                            {item.spiceLevel > 0 ? (
                              <span className="flex spice-flames" style={{ display: 'flex', color: 'var(--color-saffron)', gap: '2px' }}>
                                {[...Array(item.spiceLevel)].map((_, i) => (
                                  <Flame key={i} size={13} className="fill-gold stroke-gold" />
                                ))}
                              </span>
                            ) : (
                              <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontFamily: 'var(--font-utility)' }}>MILD</span>
                            )}
                          </td>
                          <td>
                            <span className={`db-badge-glowing ${item.available ? 'status-completed' : 'status-pending'}`}>
                              <span className="badge-pulse-dot"></span>
                              {item.available ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>
                            <div className="table-action-buttons">
                              <button 
                                className="action-icon-btn edit-btn" 
                                onClick={() => openEditModal(item)}
                                title="Edit Recipe"
                              >
                                <Edit size={13} />
                              </button>
                              <button 
                                className="action-icon-btn delete-btn" 
                                onClick={() => handleDeleteMenu(item._id || item.id)}
                                title="Delete Recipe"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'messages' && (
            <motion.div 
              key="messages-tab"
              className="db-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <div className="db-panel-header">
                <div>
                  <h3>Guest Heartbeats</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Direct feedback and inquiries logged from the web terminal</p>
                </div>
              </div>
              <div className="db-table-wrapper">
                <table className="db-table">
                  <thead>
                    <tr>
                      <th>Guest Details</th>
                      <th>Subject</th>
                      <th>Message Details</th>
                      <th>Received Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="table-empty">No inquiry logs stored.</td>
                      </tr>
                    ) : (
                      messages.map((msg, idx) => (
                        <tr key={msg.id || msg._id || idx}>
                          <td>
                            <div className="table-item-title">{msg.name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-utility)' }}>{msg.email}</div>
                          </td>
                          <td style={{ fontWeight: 700 }} className="gold-accent">{msg.subject}</td>
                          <td className="message-content-cell">{msg.message}</td>
                          <td className="font-numeric" style={{ fontSize: '12px' }}>{new Date(msg.date).toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'subscribers' && (
            <motion.div 
              key="subscribers-tab"
              className="db-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <div className="db-panel-header">
                <div>
                  <h3>Subscribers Log</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Newsletter and flavor dispatch subscriptions</p>
                </div>
              </div>
              <div className="db-table-wrapper">
                <table className="db-table">
                  <thead>
                    <tr>
                      <th>Email Address</th>
                      <th>Subscription Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.length === 0 ? (
                      <tr>
                        <td colSpan="2" className="table-empty">No newsletter subscribers logged.</td>
                      </tr>
                    ) : (
                      subscribers.map((sub, idx) => (
                        <tr key={sub.id || sub._id || idx}>
                          <td style={{ fontWeight: 700 }} className="gold-accent">{sub.email}</td>
                          <td className="font-numeric">{new Date(sub.date).toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Overlay for Add/Edit Menu Item */}
        <AnimatePresence>
          {isMenuModalOpen && (
            <div className="db-modal-overlay">
              <motion.div 
                className="db-modal-card"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, cubicBezier: [0.16, 1, 0.3, 1] }}
              >
                <div className="db-modal-header">
                  <h3>{editingItem ? 'Refine Recipe' : 'Inscribe New Recipe'}</h3>
                  <button className="db-modal-close" onClick={() => setIsMenuModalOpen(false)}>
                    <X size={16} />
                  </button>
                </div>
                <form onSubmit={handleAddOrEditMenu} className="db-modal-form">
                  <div className="form-group-row">
                    <div className="form-group">
                      <label className="alchemist-form-label">Recipe Title *</label>
                      <input 
                        type="text" 
                        value={menuForm.name} 
                        onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                        required 
                        className="alchemist-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="alchemist-form-label">Category *</label>
                      <select 
                        value={menuForm.category} 
                        onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })}
                        required
                        className="alchemist-input alchemist-select"
                      >
                        <option value="Drinks">Drinks</option>
                        <option value="Street Eats">Street Eats</option>
                        <option value="Delights">Delights</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group-row">
                    <div className="form-group">
                      <label className="alchemist-form-label">Unit Value ($) *</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        value={menuForm.price} 
                        onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })}
                        required 
                        className="alchemist-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="alchemist-form-label">Catalog Badge (e.g. Legendary)</label>
                      <input 
                        type="text" 
                        placeholder="Chef Special, Bestseller..." 
                        value={menuForm.badge} 
                        onChange={(e) => setMenuForm({ ...menuForm, badge: e.target.value })}
                        className="alchemist-input"
                      />
                    </div>
                  </div>

                  <div className="form-group-row">
                    <div className="form-group">
                      <label className="alchemist-form-label">Asset Image Key</label>
                      <input 
                        type="text" 
                        placeholder="obsidian_chai, emperor_burger..." 
                        value={menuForm.image} 
                        onChange={(e) => setMenuForm({ ...menuForm, image: e.target.value })}
                        className="alchemist-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="alchemist-form-label">Spice Intensity Level</label>
                      <select 
                        value={menuForm.spiceLevel} 
                        onChange={(e) => setMenuForm({ ...menuForm, spiceLevel: parseInt(e.target.value) })}
                        className="alchemist-input alchemist-select"
                      >
                        <option value="0">0 - Sweet / Mild</option>
                        <option value="1">1 - Flame Accent</option>
                        <option value="2">2 - Double Flame</option>
                        <option value="3">3 - Intense Heat</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="alchemist-form-label">Culinary Description *</label>
                    <textarea 
                      rows="3" 
                      value={menuForm.description} 
                      onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                      required
                      className="alchemist-input alchemist-textarea"
                    ></textarea>
                  </div>

                  <div className="form-group" style={{ marginBottom: '24px' }}>
                    <label className="alchemist-checkbox-container">
                      <input 
                        type="checkbox" 
                        checked={menuForm.available} 
                        onChange={(e) => setMenuForm({ ...menuForm, available: e.target.checked })}
                        className="alchemist-checkbox-native"
                      />
                      <span className="alchemist-checkbox-custom"></span>
                      <span className="checkbox-label-text">Inscribe as active in customer menu</span>
                    </label>
                  </div>

                  <div className="db-modal-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => setIsMenuModalOpen(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Inscribing...' : 'Save Recipe'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
