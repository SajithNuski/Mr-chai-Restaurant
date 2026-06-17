import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, ShoppingCart, MessageSquare, Heart, Mail, 
  Menu as MenuIcon, Settings, LogOut, RefreshCw, Bell, Users
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
  const [alertOrder, setAlertOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('adminToken');
  const username = localStorage.getItem('adminUser') || 'Admin User';

  const fetchDashboardData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      // Fetch stats
      const statsRes = await fetch('http://localhost:5000/api/admin/dashboard-stats', {
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
      const msgRes = await fetch('http://localhost:5000/api/admin/messages', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (msgRes.ok) {
        const msgData = await msgRes.json();
        setMessages(msgData);
      }

      // Fetch orders
      const orderRes = await fetch('http://localhost:5000/api/admin/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (orderRes.ok) {
        const orderData = await orderRes.json();
        setOrders(orderData);
      }

      // Fetch subscribers
      const subRes = await fetch('http://localhost:5000/api/admin/subscriptions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (subRes.ok) {
        const subData = await subRes.json();
        setSubscribers(subData);
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
      setStats({
        totalOrders: 1482,
        menuItems: 42,
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
            <div className="db-panel-header">
              <h3>Menu Catalog Management</h3>
            </div>
            <div className="db-table-wrapper">
              <table className="db-table">
                <thead>
                  <tr>
                    <th>Menu Item</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Unit Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 700 }}>Signature Saffron Chai</td>
                    <td>Drinks</td>
                    <td>Loose leaf organic Assam steeped with toasted cardamom, star anise, ginger, and saffron threads.</td>
                    <td className="gold-accent" style={{ fontWeight: 700 }}>$8.50</td>
                    <td><span className="db-badge db-badge-completed">Active</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>Truffle Vada Pav</td>
                    <td>Fusion Classic</td>
                    <td>Traditional spiced potato fritter inside brioche, topped with grated black truffles and gold dust.</td>
                    <td className="gold-accent" style={{ fontWeight: 700 }}>$15.00</td>
                    <td><span className="db-badge db-badge-completed">Active</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>Smoked Goat Biryani</td>
                    <td>Mains</td>
                    <td>Dum-cooked heritage long-grain basmati with slow-smoked tender goat meat and saffron.</td>
                    <td className="gold-accent" style={{ fontWeight: 700 }}>$29.00</td>
                    <td><span className="db-badge db-badge-completed">Active</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>The Emperor Burger</td>
                    <td>Burgers</td>
                    <td>Double wagyu beef, aged cheddar, truffle aioli, and caramelized heirloom spices.</td>
                    <td className="gold-accent" style={{ fontWeight: 700 }}>$18.50</td>
                    <td><span className="db-badge db-badge-completed">Active</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
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
