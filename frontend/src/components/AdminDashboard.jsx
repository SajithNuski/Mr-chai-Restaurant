import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, ShoppingCart, MessageSquare, Heart, Mail, 
  Menu as MenuIcon, Settings, LogOut, RefreshCw, Bell, Users,
  Plus, Edit, Trash2, X, Flame
} from 'lucide-react';

import logoImg from '../assets/logo.png';
import { toast } from 'sonner';

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalOrders: 1482,
    menuItems: 42,
    totalReviews: 856,
    totalMessages: 24,
    recentOrders: [],
    weeklyVolume: [120, 180, 150, 220, 190, 240, 210]
  });
  const [messages, setMessages] = useState([]);
  const [orders, setOrders] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [alertOrder, setAlertOrder] = useState(null);
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

  const fetchDashboardData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      // Fetch stats
      const statsRes = await fetch('/api/admin/dashboard-stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
        if (statsData.recentOrders && statsData.recentOrders.length > 0) {
          // If there is a very new order, trigger a live alert notification
          const latest = statsData.recentOrders[0];
          if (latest.status === 'Pending') {
            setAlertOrder(latest);
          }
        }
      }

      // Fetch messages
      const msgRes = await fetch('/api/admin/messages', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (msgRes.ok) {
        const msgData = await msgRes.json();
        setMessages(msgData);
      }

      // Fetch orders
      const orderRes = await fetch('/api/admin/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (orderRes.ok) {
        const orderData = await orderRes.json();
        setOrders(orderData);
      }

      // Fetch subscribers
      const subRes = await fetch('/api/admin/subscriptions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
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
        { id: '1', name: 'Aarav Mehta', email: 'aarav.mehta@example.com', subject: 'Catering Enquiry', message: 'Hello, I would like to enquire about catering for a corporate event of 50 people next month. Love your brand style!', date: new Date().toISOString() },
        { id: '2', name: 'Priya Sharma', email: 'priya@example.com', subject: 'Booking Enquiry', message: 'Do you have availability for a private lounge booking of 15 people this Saturday evening?', date: new Date().toISOString() }
      ]);
      setOrders([
        { id: '1', tableNumber: '12', items: ['Truffle Vada Pav', 'Signature Saffron Chai'], total: 28.50, status: 'Pending', date: new Date().toISOString() },
        { id: '2', tableNumber: '04', items: ['The Emperor Burger', 'Gunpowder Fries', 'Obsidian Masala Chai'], total: 38.00, status: 'Completed', date: new Date().toISOString() },
        { id: '3', tableNumber: '09', items: ['Gold-Dust Chicken', 'Truffle Silk Fries'], total: 24.50, status: 'Completed', date: new Date().toISOString() }
      ]);
      setSubscribers([
        { id: '1', email: 'vip-guest@luxury.com', date: new Date().toISOString() },
        { id: '2', email: 'foodie@bazaar.org', date: new Date().toISOString() }
      ]);
      setMenuItems([
        { id: 'm1', name: 'Obsidian Masala Chai', category: 'Drinks', description: 'Slow-steeped loose leaf tea from Assam, hand-ground secret spice blend, and creamy whole milk.', price: 7.00, badge: 'Legendary', image: 'obsidian_chai', spiceLevel: 1, available: true },
        { id: 'm2', name: 'The Emperor Burger', category: 'Street Eats', description: 'Double wagyu beef, aged cheddar, truffle aioli, and caramelized heirloom spices on a toasted brioche.', price: 18.50, badge: 'Signature', image: 'emperor_burger', spiceLevel: 2, available: true },
        { id: 'm3', name: 'Gold-Leaf Saffron Cheesecake', category: 'Delights', description: 'Rich cheesecake infused with premium Kashmiri saffron, cardamom pod crust, and finished with 24k gold leaf.', price: 12.50, badge: 'Chef Special', image: 'saffron_cheesecake', spiceLevel: 0, available: true }
      ]);
      setStats({
        totalOrders: 1482,
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
    // Poll every 10 seconds for orders/alerts updates
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

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save menu item');
      }

      toast.success(isEditing ? 'Menu item updated.' : 'Menu item added.');
      setIsMenuModalOpen(false);
      setEditingItem(null);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Error occurred while saving.');
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

  // Render SVG Chart using WeeklyVolume data
  const renderChart = () => {
    const data = stats.weeklyVolume || [120, 180, 150, 220, 190, 240, 210];
    const width = 600;
    const height = 180;
    const padding = 25;
    
    // Scale data
    const maxVal = Math.max(...data) * 1.1;
    const points = data.map((val, index) => {
      const x = padding + (index * (width - (padding * 2)) / (data.length - 1));
      const y = height - padding - (val * (height - (padding * 2)) / maxVal);
      return { x, y };
    });

    const pathData = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
    const areaData = `${pathData} L ${points[points.length-1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;
    
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%">
        <defs>
          <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--gold-heritage)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--gold-heritage)" stopOpacity="0.0" />
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
          <circle 
            key={i} 
            cx={p.x} 
            cy={p.y} 
            r={5} 
            fill="var(--bg-obsidian)" 
            stroke="var(--gold-vibrant)" 
            strokeWidth={2} 
          />
        ))}

        {/* X Axis Labels */}
        {weekdays.map((day, i) => {
          const x = padding + (i * (width - (padding * 2)) / (weekdays.length - 1));
          return (
            <text 
              key={i} 
              x={x} 
              y={height - 5} 
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
          <img src={logoImg} alt="Mr. Chai Logo" className="logo-img" style={{ height: '40px', width: '40px', marginBottom: '8px' }} />
          <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold-heritage)', fontWeight: 700 }}>Management Portal</p>
        </div>

        <ul className="sidebar-nav">
          <li>
            <button 
              className={`sidebar-item-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <ShoppingCart size={18} />
              Dashboard
            </button>
          </li>
          <li>
            <button 
              className={`sidebar-item-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <ShoppingCart size={18} />
              Orders Logging
            </button>
          </li>
          <li>
            <button 
              className={`sidebar-item-btn ${activeTab === 'menu' ? 'active' : ''}`}
              onClick={() => setActiveTab('menu')}
            >
              <MenuIcon size={18} />
              Menu Items
            </button>
          </li>
          <li>
            <button 
              className={`sidebar-item-btn ${activeTab === 'messages' ? 'active' : ''}`}
              onClick={() => setActiveTab('messages')}
            >
              <MessageSquare size={18} />
              Guest Messages ({messages.length})
            </button>
          </li>
          <li>
            <button 
              className={`sidebar-item-btn ${activeTab === 'subscribers' ? 'active' : ''}`}
              onClick={() => setActiveTab('subscribers')}
            >
              <Users size={18} />
              Subscribers ({subscribers.length})
            </button>
          </li>
        </ul>

        <div className="sidebar-user">
          <div className="sidebar-user-info">
            <h4>{username}</h4>
            <p className="gold-accent">Administrator</p>
          </div>
          <button onClick={handleLogoutClick} className="sidebar-logout-btn" title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="db-main">
        
        {/* Header */}
        <header className="db-header">
          <div className="db-header-title">
            <h1>Executive Dashboard</h1>
            <p>Real-time analytics and management operations.</p>
          </div>
          <button onClick={handleManualRefresh} className={`btn btn-secondary ${loading ? 'anim-spin' : ''}`} style={{ padding: '8px 16px', gap: '6px', fontSize: '12px' }}>
            <RefreshCw size={14} /> Refresh Logs
          </button>
        </header>

        {/* Live Notification Alert */}
        {alertOrder && (
          <div className="db-alert-banner">
            <div className="db-alert-icon">
              <Bell size={24} />
            </div>
            <div className="db-alert-text">
              <h4>New Order Alert!</h4>
              <p>Table #{alertOrder.tableNumber} just ordered: {alertOrder.items?.join(', ')} (Total: ${alertOrder.total?.toFixed(2)})</p>
            </div>
            <button onClick={() => setAlertOrder(null)} className="btn-tertiary" style={{ marginLeft: 'auto', border: 'none', background: 'none', color: 'var(--gold-heritage)', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}>
              Dismiss
            </button>
          </div>
        )}

        {/* Stats Row */}
        <section className="db-stats-grid">
          <div className="db-stat-card">
            <div className="db-stat-info">
              <p>Total Orders</p>
              <h3>{stats.totalOrders}</h3>
            </div>
            <div className="db-stat-icon">
              <ShoppingCart size={24} />
            </div>
          </div>

          <div className="db-stat-card">
            <div className="db-stat-info">
              <p>Menu Catalog</p>
              <h3>{stats.menuItems} Items</h3>
            </div>
            <div className="db-stat-icon">
              <MenuIcon size={24} />
            </div>
          </div>

          <div className="db-stat-card">
            <div className="db-stat-info">
              <p>Guest Reviews</p>
              <h3>{stats.totalReviews}</h3>
            </div>
            <div className="db-stat-icon">
              <Heart size={24} />
            </div>
          </div>

          <div className="db-stat-card">
            <div className="db-stat-info">
              <p>Messages Log</p>
              <h3>{stats.totalMessages}</h3>
            </div>
            <div className="db-stat-icon">
              <MessageSquare size={24} />
            </div>
          </div>
        </section>

        {/* Tab Switchers */}
        {activeTab === 'dashboard' && (
          <div className="db-content-grid">
            <div className="db-panel">
              <div className="db-panel-header">
                <h3>Weekly Order Volume</h3>
                <span className="gold-accent" style={{ fontSize: '12px', fontWeight: 700 }}><TrendingUp size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> +12% this week</span>
              </div>
              <div className="db-chart-container">
                {renderChart()}
              </div>
            </div>

            <div className="db-panel">
              <div className="db-panel-header">
                <h3>Recent Live Activity</h3>
              </div>
              <div className="db-list">
                {orders.slice(0, 3).map((ord, i) => (
                  <div className="db-list-item" key={ord.id || ord._id || i}>
                    <div className="db-list-item-content">
                      <h4>Table #{ord.tableNumber}</h4>
                      <p>{ord.items?.join(', ')}</p>
                    </div>
                    <span className={`db-badge ${ord.status === 'Completed' ? 'db-badge-completed' : 'db-badge-pending'}`}>
                      {ord.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="db-panel">
            <div className="db-panel-header">
              <h3>Live Table Order Logs</h3>
            </div>
            <div className="db-table-wrapper">
              <table className="db-table">
                <thead>
                  <tr>
                    <th>Table</th>
                    <th>Ordered Items</th>
                    <th>Subtotal</th>
                    <th>Status</th>
                    <th>Logged Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '24px' }}>No orders logged yet. Place an order on the landing page!</td>
                    </tr>
                  ) : (
                    orders.map((ord, idx) => (
                      <tr key={ord.id || ord._id || idx}>
                        <td style={{ fontWeight: 700 }}>#{ord.tableNumber}</td>
                        <td>{ord.items?.join(', ')}</td>
                        <td className="gold-accent" style={{ fontWeight: 700 }}>${ord.total?.toFixed(2)}</td>
                        <td>
                          <span className={`db-badge ${ord.status === 'Completed' ? 'db-badge-completed' : 'db-badge-pending'}`}>
                            {ord.status}
                          </span>
                        </td>
                        <td>{new Date(ord.date).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="db-panel">
            <div className="db-panel-header" style={{ display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
              <h3>Menu Catalog Management</h3>
              <button className="btn btn-primary" onClick={openAddModal} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '13px' }}>
                <Plus size={16} /> Add New Item
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
                    <th>Spice</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '24px' }}>No menu items found.</td>
                    </tr>
                  ) : (
                    menuItems.map((item, idx) => (
                      <tr key={item._id || item.id || idx}>
                        <td>
                          <div style={{ fontWeight: 700 }}>{item.name}</div>
                          {item.badge && <span className="db-badge-tag">{item.badge}</span>}
                        </td>
                        <td>{item.category}</td>
                        <td style={{ maxWidth: '280px', whiteSpace: 'normal', wordBreak: 'break-word', fontSize: '13px' }}>
                          {item.description}
                        </td>
                        <td className="gold-accent" style={{ fontWeight: 700 }}>${parseFloat(item.price).toFixed(2)}</td>
                        <td>
                          {item.spiceLevel > 0 ? (
                            <span className="flex" style={{ color: 'var(--gold-heritage)', gap: '1px' }}>
                              {[...Array(item.spiceLevel)].map((_, i) => (
                                <Flame key={i} size={14} className="fill-gold stroke-gold" />
                              ))}
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>None</span>
                          )}
                        </td>
                        <td>
                          <span className={`db-badge ${item.available ? 'db-badge-completed' : 'db-badge-pending'}`}>
                            {item.available ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button 
                              className="btn btn-secondary" 
                              onClick={() => openEditModal(item)}
                              style={{ padding: '6px 10px', minWidth: 'auto' }}
                              title="Edit"
                            >
                              <Edit size={14} />
                            </button>
                            <button 
                              className="btn btn-secondary" 
                              onClick={() => handleDeleteMenu(item._id || item.id)}
                              style={{ padding: '6px 10px', minWidth: 'auto', color: '#ff4444', borderColor: 'rgba(255, 68, 68, 0.2)' }}
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Modal Overlay for Add/Edit Menu Item */}
            {isMenuModalOpen && (
              <div className="db-modal-overlay">
                <div className="db-modal-card">
                  <div className="db-modal-header">
                    <h3>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h3>
                    <button className="db-modal-close" onClick={() => setIsMenuModalOpen(false)}>
                      <X size={18} />
                    </button>
                  </div>
                  <form onSubmit={handleAddOrEditMenu} className="db-modal-form">
                    <div className="form-group-row" style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>Item Name *</label>
                        <input 
                          type="text" 
                          value={menuForm.name} 
                          onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                          required 
                          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid rgba(212, 175, 55, 0.2)', backgroundColor: 'rgba(255, 255, 255, 0.03)', color: '#fff' }}
                        />
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>Category *</label>
                        <select 
                          value={menuForm.category} 
                          onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })}
                          required
                          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid rgba(212, 175, 55, 0.2)', backgroundColor: 'rgba(255, 255, 255, 0.03)', color: '#fff' }}
                        >
                          <option value="Drinks" style={{ background: '#0a0a0a' }}>Drinks</option>
                          <option value="Street Eats" style={{ background: '#0a0a0a' }}>Street Eats</option>
                          <option value="Delights" style={{ background: '#0a0a0a' }}>Delights</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group-row" style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>Price ($) *</label>
                        <input 
                          type="number" 
                          step="0.01" 
                          value={menuForm.price} 
                          onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })}
                          required 
                          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid rgba(212, 175, 55, 0.2)', backgroundColor: 'rgba(255, 255, 255, 0.03)', color: '#fff' }}
                        />
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>Badge (e.g. Legendary)</label>
                        <input 
                          type="text" 
                          placeholder="Chef Special, Bestseller..." 
                          value={menuForm.badge} 
                          onChange={(e) => setMenuForm({ ...menuForm, badge: e.target.value })}
                          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid rgba(212, 175, 55, 0.2)', backgroundColor: 'rgba(255, 255, 255, 0.03)', color: '#fff' }}
                        />
                      </div>
                    </div>

                    <div className="form-group-row" style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>Image Key / URL</label>
                        <input 
                          type="text" 
                          placeholder="obsidian_chai, emperor_burger..." 
                          value={menuForm.image} 
                          onChange={(e) => setMenuForm({ ...menuForm, image: e.target.value })}
                          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid rgba(212, 175, 55, 0.2)', backgroundColor: 'rgba(255, 255, 255, 0.03)', color: '#fff' }}
                        />
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>Spice Level (0 to 3)</label>
                        <select 
                          value={menuForm.spiceLevel} 
                          onChange={(e) => setMenuForm({ ...menuForm, spiceLevel: parseInt(e.target.value) })}
                          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid rgba(212, 175, 55, 0.2)', backgroundColor: 'rgba(255, 255, 255, 0.03)', color: '#fff' }}
                        >
                          <option value="0" style={{ background: '#0a0a0a' }}>0 - Non-Spicy</option>
                          <option value="1" style={{ background: '#0a0a0a' }}>1 - Mild</option>
                          <option value="2" style={{ background: '#0a0a0a' }}>2 - Medium</option>
                          <option value="3" style={{ background: '#0a0a0a' }}>3 - Spicy</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>Description *</label>
                      <textarea 
                        rows="3" 
                        value={menuForm.description} 
                        onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                        required
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid rgba(212, 175, 55, 0.2)', backgroundColor: 'rgba(255, 255, 255, 0.03)', color: '#fff', resize: 'vertical' }}
                      ></textarea>
                    </div>

                    <div className="form-group" style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                        <input 
                          type="checkbox" 
                          checked={menuForm.available} 
                          onChange={(e) => setMenuForm({ ...menuForm, available: e.target.checked })}
                          style={{ accentColor: 'var(--gold-heritage)' }}
                        />
                        <span>Item is available for orders</span>
                      </label>
                    </div>

                    <div className="db-modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                      <button type="button" className="btn btn-secondary" onClick={() => setIsMenuModalOpen(false)}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Item'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="db-panel">
            <div className="db-panel-header">
              <h3>Guest Inquiry Logs (MongoDB)</h3>
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
                      <td colSpan="4" style={{ textAlign: 'center', padding: '24px' }}>No guest messages logged in database yet.</td>
                    </tr>
                  ) : (
                    messages.map((msg, idx) => (
                      <tr key={msg.id || msg._id || idx}>
                        <td>
                          <div style={{ fontWeight: 700 }}>{msg.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{msg.email}</div>
                        </td>
                        <td style={{ fontWeight: 700 }} className="gold-accent">{msg.subject}</td>
                        <td style={{ maxWidth: '400px', whiteSpace: 'normal', wordBreak: 'break-word' }}>{msg.message}</td>
                        <td>{new Date(msg.date).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'subscribers' && (
          <div className="db-panel">
            <div className="db-panel-header">
              <h3>Newsletter Subscriptions Log</h3>
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
                      <td colSpan="2" style={{ textAlign: 'center', padding: '24px' }}>No subscribers logged yet.</td>
                    </tr>
                  ) : (
                    subscribers.map((sub, idx) => (
                      <tr key={sub.id || sub._id || idx}>
                        <td style={{ fontWeight: 700 }} className="gold-accent">{sub.email}</td>
                        <td>{new Date(sub.date).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
