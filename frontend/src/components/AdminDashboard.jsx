import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, ShoppingCart, MessageSquare, Heart, Mail, 
  Menu as MenuIcon, Settings, LogOut, RefreshCw, Bell, Users,
  Plus, Edit, Trash2, X, Flame, Clock, Coffee, Shield, Activity,
  Sliders, Calendar, CheckCircle2, AlertCircle, Image, Sparkles, Search
} from 'lucide-react';

import logoImg from '../assets/logo.png';
import { toast } from 'sonner';

import emperorBurger from '../assets/emperor_burger.png';
import obsidianChai from '../assets/obsidian_chai.png';
import gunpowderFries from '../assets/gunpowder_fries.png';
import heroChai from '../assets/hero_chai.png';
import mrChaiAmbiance from '../assets/mr_chai_ambiance.png';
import saffronCheesecake from '../assets/saffron_cheesecake.png';

const localImages = {
  emperor_burger: emperorBurger,
  obsidian_chai: obsidianChai,
  gunpowder_fries: gunpowderFries,
  hero_chai: heroChai,
  mr_chai_ambiance: mrChaiAmbiance,
  saffron_cheesecake: saffronCheesecake
};

const defaultMenuItems = [
  { id: 'm1', name: 'Obsidian Masala Chai', category: 'Drinks', description: 'Slow-steeped loose leaf tea from Assam, hand-ground secret spice blend, and creamy whole milk.', price: 7.00, badge: 'Legendary', image: 'obsidian_chai', spiceLevel: 1, available: true },
  { id: 'm2', name: 'The Emperor Burger', category: 'Street Eats', description: 'Double wagyu beef, aged cheddar, truffle aioi, and caramelized heirloom spices on a toasted brioche.', price: 18.50, badge: 'Signature', image: 'emperor_burger', spiceLevel: 2, available: true },
  { id: 'm3', name: 'Gold-Leaf Saffron Cheesecake', category: 'Delights', description: 'Rich cheesecake infused with premium Kashmiri saffron, cardamom pod crust, and finished with 24k gold leaf.', price: 12.50, badge: 'Chef Special', image: 'saffron_cheesecake', spiceLevel: 0, available: true },
  { id: 'm4', name: 'Kashmiri Rose Kahwa', category: 'Drinks', description: 'Traditional green tea prepared with saffron, almonds, cinnamon, cardamom, and fresh red rose petals.', price: 8.00, badge: 'Premium', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80', spiceLevel: 0, available: true },
  { id: 'm5', name: 'Truffle Vada Pav', category: 'Street Eats', description: 'Traditional potato dumpling slider inside a soft pav, infused with black truffle oil and dry garlic chutney.', price: 14.00, badge: 'Premium', image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=400&q=80', spiceLevel: 1, available: true },
  { id: 'm6', name: 'Gunpowder Fries', category: 'Street Eats', description: 'Crisp hand-cut potato wedges tossed in a fiery South Indian gunpowder spice mix and curry leaf dust.', price: 9.00, badge: 'Fiery', image: 'gunpowder_fries', spiceLevel: 3, available: true },
  { id: 'm7', name: 'Mango Cardamom Lassi', category: 'Drinks', description: 'Velvety yogurt beverage blended with sweet Alphonso mango pulp, green cardamom, and pistachio slivers.', price: 8.50, badge: 'Bestseller', image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=400&q=80', spiceLevel: 0, available: true },
  { id: 'm8', name: 'Pistachio Kulfi Dome', category: 'Delights', description: 'Classic dense Indian ice cream slow-churned with pistachios, served as a gold-dusted dome.', price: 10.50, badge: 'Signature', image: 'https://images.unsplash.com/photo-1505394033343-e3852a656e43?auto=format&fit=crop&w=400&q=80', spiceLevel: 0, available: true }
];

const defaultGalleryItems = [
  { id: 'g1', title: 'The Emperor Burger', category: 'Dishes', image: 'emperor_burger', sizeClass: 'tall', desc: 'Double wagyu beef, caramelized heirloom spices, toasted brioche.' },
  { id: 'g2', title: 'Obsidian Masala Chai', category: 'Drinks', image: 'obsidian_chai', sizeClass: 'standard', desc: 'Slow-steeped Assam black tea infused with our signature hand-ground spices.' },
  { id: 'g3', title: 'The Obsidian Sanctuary', category: 'Ambiance', image: 'mr_chai_ambiance', sizeClass: 'wide', desc: 'Our flagship dining room featuring deep obsidian tones and warm golden pendant lights.' },
  { id: 'g4', title: 'Gold-Leaf Saffron Cheesecake', category: 'Dishes', image: 'saffron_cheesecake', sizeClass: 'standard', desc: 'Creamy cardamom and saffron cheesecake topped with genuine 24k gold leaf.' },
  { id: 'g5', title: 'Gunpowder Fries', category: 'Dishes', image: 'gunpowder_fries', sizeClass: 'standard', desc: 'Triple-cooked fries tossed in spicy gunpowder podi blend and bird’s eye chili.' },
  { id: 'g6', title: 'Artisanal Cardamom Chai', category: 'Drinks', image: 'hero_chai', sizeClass: 'wide', desc: 'A premium pour of freshly boiled milk tea, cardamom pods, and raw cane sugar.' }
];

const getImageUrl = (imageKey) => {
  if (localImages[imageKey]) return localImages[imageKey];
  return imageKey; // Base64 or http URL
};

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
  const [galleryItems, setGalleryItems] = useState([]);
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

  // Gallery form & modal states
  const [editingGalleryItem, setEditingGalleryItem] = useState(null);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    category: 'Dishes',
    image: '',
    sizeClass: 'standard',
    desc: ''
  });

  // List Search, Filter & Pagination states
  const [menuSearch, setMenuSearch] = useState('');
  const [menuCatFilter, setMenuCatFilter] = useState('All');
  const [menuPage, setMenuPage] = useState(1);

  const [gallerySearch, setGallerySearch] = useState('');
  const [galleryCatFilter, setGalleryCatFilter] = useState('All');
  const [galleryPage, setGalleryPage] = useState(1);

  const [messagesSearch, setMessagesSearch] = useState('');
  const [messagesPage, setMessagesPage] = useState(1);

  const [subscribersSearch, setSubscribersSearch] = useState('');
  const [subscribersPage, setSubscribersPage] = useState(1);

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
        setMenuItems(menuData.length > 0 ? menuData : defaultMenuItems);
      }

      // Fetch gallery items
      const galleryRes = await fetch('/api/gallery');
      if (galleryRes.ok) {
        const galleryData = await galleryRes.json();
        setGalleryItems(galleryData.length > 0 ? galleryData : defaultGalleryItems);
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
      setMenuItems(defaultMenuItems);
      setGalleryItems(defaultGalleryItems);
      setStats({
        menuItems: defaultMenuItems.length,
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
        let errorMessage = 'Failed to save menu item';
        try {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await res.json();
            errorMessage = errorData.error || errorMessage;
          } else {
            errorMessage = `${res.status} ${res.statusText}`;
          }
        } catch (parseErr) {
          errorMessage = `${res.status} ${res.statusText}`;
        }
        throw new Error(errorMessage);
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

  const handleAddOrEditGallery = async (e) => {
    e.preventDefault();
    if (!galleryForm.title || !galleryForm.category || !galleryForm.desc || !galleryForm.image) {
      toast.error('Please fill in all fields and provide an image.');
      return;
    }

    setLoading(true);
    try {
      const isEditing = editingGalleryItem && (editingGalleryItem._id || editingGalleryItem.id);
      const url = isEditing
        ? `/api/admin/gallery/${editingGalleryItem._id || editingGalleryItem.id}`
        : '/api/admin/gallery';
      
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(galleryForm)
      });

      if (res.status === 401 || res.status === 403) {
        handleAuthError();
        return;
      }

      if (!res.ok) {
        let errorMessage = 'Failed to save gallery item';
        try {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await res.json();
            errorMessage = errorData.error || errorMessage;
          } else {
            errorMessage = `${res.status} ${res.statusText}`;
          }
        } catch (parseErr) {
          errorMessage = `${res.status} ${res.statusText}`;
        }
        throw new Error(errorMessage);
      }

      toast.success(isEditing ? 'Gallery canvas item updated.' : 'New gallery canvas item added.');
      setIsGalleryModalOpen(false);
      setEditingGalleryItem(null);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Error occurred while saving gallery item.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGallery = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this gallery item?')) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/gallery/${itemId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.status === 401 || res.status === 403) {
        handleAuthError();
        return;
      }

      if (!res.ok) throw new Error('Failed to delete gallery item');

      toast.success('Gallery item deleted successfully.');
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      toast.error('Error occurred while deleting gallery item.');
    } finally {
      setLoading(false);
    }
  };

  const openAddGalleryModal = () => {
    setEditingGalleryItem(null);
    setGalleryForm({
      title: '',
      category: 'Dishes',
      image: '',
      sizeClass: 'standard',
      desc: ''
    });
    setIsGalleryModalOpen(true);
  };

  const openEditGalleryModal = (item) => {
    setEditingGalleryItem(item);
    setGalleryForm({
      title: item.title || '',
      category: item.category || 'Dishes',
      image: item.image || '',
      sizeClass: item.sizeClass || 'standard',
      desc: item.desc || ''
    });
    setIsGalleryModalOpen(true);
  };

  const handleGalleryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGalleryForm(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMenuImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMenuForm(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
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

  // Filtered & Paginated Menu Items
  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
                          (item.description && item.description.toLowerCase().includes(menuSearch.toLowerCase()));
    const matchesCat = menuCatFilter === 'All' || item.category === menuCatFilter;
    return matchesSearch && matchesCat;
  });
  const itemsPerPage = 5;
  const totalMenuPages = Math.ceil(filteredMenuItems.length / itemsPerPage) || 1;
  const activeMenuPage = Math.min(menuPage, totalMenuPages);
  const startIndexMenu = (activeMenuPage - 1) * itemsPerPage;
  const paginatedMenuItems = filteredMenuItems.slice(startIndexMenu, startIndexMenu + itemsPerPage);

  // Filtered & Paginated Messages
  const filteredMessages = messages.filter(msg => {
    return msg.name.toLowerCase().includes(messagesSearch.toLowerCase()) ||
           msg.email.toLowerCase().includes(messagesSearch.toLowerCase()) ||
           (msg.subject && msg.subject.toLowerCase().includes(messagesSearch.toLowerCase())) ||
           (msg.message && msg.message.toLowerCase().includes(messagesSearch.toLowerCase()));
  });
  const totalMessagePages = Math.ceil(filteredMessages.length / itemsPerPage) || 1;
  const activeMessagePage = Math.min(messagesPage, totalMessagePages);
  const startIndexMsg = (activeMessagePage - 1) * itemsPerPage;
  const paginatedMessages = filteredMessages.slice(startIndexMsg, startIndexMsg + itemsPerPage);

  // Filtered & Paginated Subscribers
  const subscribersPerPage = 10;
  const filteredSubscribers = subscribers.filter(sub => {
    return sub.email.toLowerCase().includes(subscribersSearch.toLowerCase());
  });
  const totalSubscriberPages = Math.ceil(filteredSubscribers.length / subscribersPerPage) || 1;
  const activeSubscriberPage = Math.min(subscribersPage, totalSubscriberPages);
  const startIndexSub = (activeSubscriberPage - 1) * subscribersPerPage;
  const paginatedSubscribers = filteredSubscribers.slice(startIndexSub, startIndexSub + subscribersPerPage);

  // Filtered & Paginated Gallery Canvas Items
  const filteredGalleryItems = galleryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(gallerySearch.toLowerCase()) ||
                          (item.desc && item.desc.toLowerCase().includes(gallerySearch.toLowerCase()));
    const matchesCat = galleryCatFilter === 'All' || item.category === galleryCatFilter;
    return matchesSearch && matchesCat;
  });
  const totalGalleryPages = Math.ceil(filteredGalleryItems.length / itemsPerPage) || 1;
  const activeGalleryPage = Math.min(galleryPage, totalGalleryPages);
  const startIndexGallery = (activeGalleryPage - 1) * itemsPerPage;
  const paginatedGalleryItems = filteredGalleryItems.slice(startIndexGallery, startIndexGallery + itemsPerPage);

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
          <li>
            <button 
              className={`sidebar-item-btn ${activeTab === 'gallery' ? 'active' : ''}`}
              onClick={() => setActiveTab('gallery')}
            >
              <span className="sidebar-btn-icon-wrapper"><Image size={16} /></span>
              <span className="sidebar-btn-text">Gallery Canvas</span>
              {galleryItems.length > 0 && <span className="sidebar-badge-count count-muted">{galleryItems.length}</span>}
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
            <h1 className="ledger-title">
              {activeTab === 'dashboard' && "Executive Ledger"}
              {activeTab === 'menu' && "Recipe Catalog"}
              {activeTab === 'messages' && "Guest Heartbeats"}
              {activeTab === 'subscribers' && "Subscribers Log"}
              {activeTab === 'gallery' && "Gallery Canvas"}
            </h1>
            <p className="ledger-subtitle">
              {activeTab === 'dashboard' && "Chai and street eats culinary administration console."}
              {activeTab === 'menu' && "Curate the luxury selection of Mr. Chai flavors."}
              {activeTab === 'messages' && "Direct feedback and inquiries logged from the web terminal."}
              {activeTab === 'subscribers' && "Newsletter and flavor dispatch subscriptions."}
              {activeTab === 'gallery' && "Manage the visual art portfolio of Mr. Chai restaurant and ambiance."}
            </p>
          </div>
          <div className="db-header-actions">
            {activeTab === 'dashboard' && (
              <button onClick={handleManualRefresh} className={`btn btn-secondary ${loading ? 'anim-spin' : ''}`} style={{ padding: '10px 20px', gap: '8px', fontSize: '12px' }}>
                <RefreshCw size={14} className={loading ? 'spin-icon' : ''} /> Synchronize Metrics
              </button>
            )}
            {activeTab === 'menu' && (
              <button className="btn btn-primary" onClick={openAddModal} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', fontSize: '12px' }}>
                <Plus size={14} /> Add New Recipe
              </button>
            )}
            {activeTab === 'gallery' && (
              <button className="btn btn-primary" onClick={openAddGalleryModal} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', fontSize: '12px' }}>
                <Plus size={14} /> Add New Canvas
              </button>
            )}
          </div>
        </header>

        {/* Tab Switchers */}
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
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

              <div className="db-content-grid">
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
              <div className="db-filter-bar">
                <div className="db-search-group">
                  <Search size={14} className="db-search-icon" />
                  <input 
                    type="text" 
                    placeholder="Search recipes by name or description..." 
                    value={menuSearch}
                    onChange={(e) => { setMenuSearch(e.target.value); setMenuPage(1); }}
                    className="db-search-input"
                  />
                </div>
                <div className="db-filter-group">
                  <select 
                    value={menuCatFilter}
                    onChange={(e) => { setMenuCatFilter(e.target.value); setMenuPage(1); }}
                    className="db-filter-select"
                  >
                    <option value="All">All Categories</option>
                    <option value="Drinks">Drinks</option>
                    <option value="Street Eats">Street Eats</option>
                    <option value="Delights">Delights</option>
                  </select>
                </div>
              </div>
              <div className="db-table-wrapper">
                <table className="db-table">
                  <thead>
                    <tr>
                      <th>Preview</th>
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
                    {paginatedMenuItems.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="table-empty">No recipes match the search/filter criteria.</td>
                      </tr>
                    ) : (
                      paginatedMenuItems.map((item, idx) => (
                        <tr key={item._id || item.id || idx}>
                          <td style={{ width: '80px' }}>
                            <div className="table-preview-img-wrapper" style={{ width: '60px', height: '60px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-color)', background: 'var(--color-clay-ebony)' }}>
                              <img 
                                src={getImageUrl(item.image)} 
                                alt={item.name} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => {
                                  e.target.src = 'https://images.unsplash.com/photo-1544025162-d76694265947?w=120&auto=format&fit=crop&q=60';
                                }}
                              />
                            </div>
                          </td>
                          <td>
                            <div className="table-item-title">{item.name}</div>
                            {item.badge && <span className="db-badge-tag">{item.badge}</span>}
                          </td>
                          <td className="category-cell">{item.category}</td>
                          <td className="description-cell">
                            {item.description}
                          </td>
                          <td className="gold-accent font-numeric" style={{ fontWeight: 700 }}>Rs. {parseFloat(item.price).toFixed(2)}</td>
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
              
              {/* Pagination */}
              <div className="db-pagination">
                <div className="pagination-info">
                  Showing {filteredMenuItems.length === 0 ? 0 : startIndexMenu + 1} to {Math.min(startIndexMenu + itemsPerPage, filteredMenuItems.length)} of {filteredMenuItems.length} recipes
                </div>
                <div className="pagination-btn-group">
                  <button 
                    onClick={() => setMenuPage(prev => Math.max(prev - 1, 1))} 
                    disabled={activeMenuPage === 1}
                    className="pagination-btn"
                  >
                    Previous
                  </button>
                  <button 
                    onClick={() => setMenuPage(prev => Math.min(prev + 1, totalMenuPages))} 
                    disabled={activeMenuPage === totalMenuPages}
                    className="pagination-btn"
                  >
                    Next
                  </button>
                </div>
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
              <div className="db-filter-bar">
                <div className="db-search-group">
                  <Search size={14} className="db-search-icon" />
                  <input 
                    type="text" 
                    placeholder="Search dispatches by name, email, subject, or message..." 
                    value={messagesSearch}
                    onChange={(e) => { setMessagesSearch(e.target.value); setMessagesPage(1); }}
                    className="db-search-input"
                  />
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
                    {paginatedMessages.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="table-empty">No inquiry logs match the search criteria.</td>
                      </tr>
                    ) : (
                      paginatedMessages.map((msg, idx) => (
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
              
              {/* Pagination */}
              <div className="db-pagination">
                <div className="pagination-info">
                  Showing {filteredMessages.length === 0 ? 0 : startIndexMsg + 1} to {Math.min(startIndexMsg + itemsPerPage, filteredMessages.length)} of {filteredMessages.length} dispatches
                </div>
                <div className="pagination-btn-group">
                  <button 
                    onClick={() => setMessagesPage(prev => Math.max(prev - 1, 1))} 
                    disabled={activeMessagePage === 1}
                    className="pagination-btn"
                  >
                    Previous
                  </button>
                  <button 
                    onClick={() => setMessagesPage(prev => Math.min(prev + 1, totalMessagePages))} 
                    disabled={activeMessagePage === totalMessagePages}
                    className="pagination-btn"
                  >
                    Next
                  </button>
                </div>
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
              <div className="db-filter-bar">
                <div className="db-search-group">
                  <Search size={14} className="db-search-icon" />
                  <input 
                    type="text" 
                    placeholder="Search subscribers by email..." 
                    value={subscribersSearch}
                    onChange={(e) => { setSubscribersSearch(e.target.value); setSubscribersPage(1); }}
                    className="db-search-input"
                  />
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
                    {paginatedSubscribers.length === 0 ? (
                      <tr>
                        <td colSpan="2" className="table-empty">No newsletter subscribers match the search criteria.</td>
                      </tr>
                    ) : (
                      paginatedSubscribers.map((sub, idx) => (
                        <tr key={sub.id || sub._id || idx}>
                          <td style={{ fontWeight: 700 }} className="gold-accent">{sub.email}</td>
                          <td className="font-numeric">{new Date(sub.date).toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="db-pagination">
                <div className="pagination-info">
                  Showing {filteredSubscribers.length === 0 ? 0 : startIndexSub + 1} to {Math.min(startIndexSub + subscribersPerPage, filteredSubscribers.length)} of {filteredSubscribers.length} subscribers
                </div>
                <div className="pagination-btn-group">
                  <button 
                    onClick={() => setSubscribersPage(prev => Math.max(prev - 1, 1))} 
                    disabled={activeSubscriberPage === 1}
                    className="pagination-btn"
                  >
                    Previous
                  </button>
                  <button 
                    onClick={() => setSubscribersPage(prev => Math.min(prev + 1, totalSubscriberPages))} 
                    disabled={activeSubscriberPage === totalSubscriberPages}
                    className="pagination-btn"
                  >
                    Next
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'gallery' && (
            <motion.div 
              key="gallery-tab"
              className="db-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <div className="db-filter-bar">
                <div className="db-search-group">
                  <Search size={14} className="db-search-icon" />
                  <input 
                    type="text" 
                    placeholder="Search gallery by title or description..." 
                    value={gallerySearch}
                    onChange={(e) => { setGallerySearch(e.target.value); setGalleryPage(1); }}
                    className="db-search-input"
                  />
                </div>
                <div className="db-filter-group">
                  <select 
                    value={galleryCatFilter}
                    onChange={(e) => { setGalleryCatFilter(e.target.value); setGalleryPage(1); }}
                    className="db-filter-select"
                  >
                    <option value="All">All Categories</option>
                    <option value="Dishes">Dishes</option>
                    <option value="Drinks">Drinks</option>
                    <option value="Ambiance">Ambiance</option>
                  </select>
                </div>
              </div>
              <div className="db-table-wrapper">
                <table className="db-table">
                  <thead>
                    <tr>
                      <th>Preview</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Size Layout</th>
                      <th>Description</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedGalleryItems.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="table-empty">No gallery canvas items match the search/filter criteria.</td>
                      </tr>
                    ) : (
                      paginatedGalleryItems.map((item, idx) => (
                        <tr key={item._id || item.id || idx}>
                          <td style={{ width: '80px' }}>
                            <div className="table-preview-img-wrapper" style={{ width: '60px', height: '60px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-color)', background: 'var(--color-clay-ebony)' }}>
                              <img 
                                src={getImageUrl(item.image)} 
                                alt={item.title} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => {
                                  e.target.src = 'https://images.unsplash.com/photo-1544025162-d76694265947?w=120&auto=format&fit=crop&q=60';
                                }}
                              />
                            </div>
                          </td>
                          <td>
                            <div className="table-item-title">{item.title}</div>
                          </td>
                          <td className="category-cell">{item.category}</td>
                          <td>
                            <span className="db-badge-tag" style={{ textTransform: 'capitalize' }}>
                              {item.sizeClass || 'standard'}
                            </span>
                          </td>
                          <td className="description-cell">
                            {item.desc}
                          </td>
                          <td>
                            <div className="table-action-buttons">
                              <button 
                                className="action-icon-btn edit-btn" 
                                onClick={() => openEditGalleryModal(item)}
                                title="Edit Canvas"
                              >
                                <Edit size={13} />
                              </button>
                              <button 
                                className="action-icon-btn delete-btn" 
                                onClick={() => handleDeleteGallery(item._id || item.id)}
                                title="Delete Canvas"
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
              
              {/* Pagination */}
              <div className="db-pagination">
                <div className="pagination-info">
                  Showing {filteredGalleryItems.length === 0 ? 0 : startIndexGallery + 1} to {Math.min(startIndexGallery + itemsPerPage, filteredGalleryItems.length)} of {filteredGalleryItems.length} canvas items
                </div>
                <div className="pagination-btn-group">
                  <button 
                    onClick={() => setGalleryPage(prev => Math.max(prev - 1, 1))} 
                    disabled={activeGalleryPage === 1}
                    className="pagination-btn"
                  >
                    Previous
                  </button>
                  <button 
                    onClick={() => setGalleryPage(prev => Math.min(prev + 1, totalGalleryPages))} 
                    disabled={activeGalleryPage === totalGalleryPages}
                    className="pagination-btn"
                  >
                    Next
                  </button>
                </div>
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
                      <label className="alchemist-form-label">Unit Value (Rs.) *</label>
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
                      <label className="alchemist-form-label">Asset Image Key / URL</label>
                      <input 
                        type="text" 
                        placeholder="obsidian_chai, emperor_burger..." 
                        value={menuForm.image.startsWith('data:') ? 'Base64 Encoded Image' : menuForm.image} 
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

                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="alchemist-form-label">Or Upload Custom Image File</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleMenuImageChange}
                      className="alchemist-input"
                      style={{ padding: '8px' }}
                    />
                    {menuForm.image && (
                      <div style={{ marginTop: '10px', width: '100px', height: '100px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                        <img 
                          src={getImageUrl(menuForm.image)}
                          alt="Upload Preview" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1544025162-d76694265947?w=120&auto=format&fit=crop&q=60';
                          }}
                        />
                      </div>
                    )}
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

        {/* Modal Overlay for Add/Edit Gallery Item */}
        <AnimatePresence>
          {isGalleryModalOpen && (
            <div className="db-modal-overlay">
              <motion.div 
                className="db-modal-card"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, cubicBezier: [0.16, 1, 0.3, 1] }}
              >
                <div className="db-modal-header">
                  <h3>{editingGalleryItem ? 'Refine Canvas Item' : 'Publish New Canvas Item'}</h3>
                  <button className="db-modal-close" onClick={() => setIsGalleryModalOpen(false)}>
                    <X size={16} />
                  </button>
                </div>
                <form onSubmit={handleAddOrEditGallery} className="db-modal-form">
                  {menuItems.length > 0 && (
                    <div className="form-group" style={{ marginBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '16px' }}>
                      <label className="alchemist-form-label" style={{ color: 'var(--gold-heritage)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sparkles size={14} /> Import Details from Recipe Catalog
                      </label>
                      <select 
                        className="alchemist-input alchemist-select"
                        value=""
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          if (!selectedId) return;
                          const selectedItem = menuItems.find(item => (item._id || item.id) === selectedId);
                          if (selectedItem) {
                            setGalleryForm(prev => ({
                              ...prev,
                              title: selectedItem.name,
                              category: selectedItem.category === 'Drinks' ? 'Drinks' : 'Dishes',
                              desc: selectedItem.description,
                              image: selectedItem.image || ''
                            }));
                          }
                        }}
                      >
                        <option value="">-- Choose an existing dish/drink to auto-fill fields --</option>
                        {menuItems.map(item => (
                          <option key={item._id || item.id} value={item._id || item.id}>
                            {item.name} ({item.category})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="form-group-row">
                    <div className="form-group">
                      <label className="alchemist-form-label">Canvas Title *</label>
                      <input 
                        type="text" 
                        value={galleryForm.title} 
                        onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                        required 
                        className="alchemist-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="alchemist-form-label">Category *</label>
                      <select 
                        value={galleryForm.category} 
                        onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                        required
                        className="alchemist-input alchemist-select"
                      >
                        <option value="Dishes">Dishes</option>
                        <option value="Drinks">Drinks</option>
                        <option value="Ambiance">Ambiance</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group-row">
                    <div className="form-group">
                      <label className="alchemist-form-label">Size Layout *</label>
                      <select 
                        value={galleryForm.sizeClass} 
                        onChange={(e) => setGalleryForm({ ...galleryForm, sizeClass: e.target.value })}
                        required
                        className="alchemist-input alchemist-select"
                      >
                        <option value="standard">Standard (Square/Balanced)</option>
                        <option value="tall">Tall (Portrait-oriented)</option>
                        <option value="wide">Wide (Landscape-oriented)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="alchemist-form-label">Asset Image Key / URL</label>
                      <input 
                        type="text" 
                        placeholder="e.g. emperor_burger or HTTP URL" 
                        value={galleryForm.image.startsWith('data:') ? 'Base64 Encoded Image' : galleryForm.image} 
                        onChange={(e) => setGalleryForm({ ...galleryForm, image: e.target.value })}
                        className="alchemist-input"
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="alchemist-form-label">Or Upload Custom Image File</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleGalleryImageChange}
                      className="alchemist-input"
                      style={{ padding: '8px' }}
                    />
                    {galleryForm.image && (
                      <div style={{ marginTop: '10px', width: '100px', height: '100px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                        <img 
                          src={getImageUrl(galleryForm.image)}
                          alt="Upload Preview" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1544025162-d76694265947?w=120&auto=format&fit=crop&q=60';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="alchemist-form-label">Description *</label>
                    <textarea 
                      rows="3" 
                      value={galleryForm.desc} 
                      onChange={(e) => setGalleryForm({ ...galleryForm, desc: e.target.value })}
                      required
                      className="alchemist-input alchemist-textarea"
                    ></textarea>
                  </div>

                  <div className="db-modal-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => setIsGalleryModalOpen(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Publishing...' : 'Publish Canvas'}
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
