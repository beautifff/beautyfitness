import { useState } from 'react';
import { marked } from 'marked';
import {
  Dumbbell,
  Home,
  Users,
  Brain,
  Menu,
  X,
  Sparkles,
  Loader2,
  Quote,
  Zap,
  Leaf,
  HeartPulse,
  MonitorPlay,
  ClipboardList,
  Newspaper,
  Calendar,
  Clock,
  ArrowRight,
  User,
  LogIn,
  LogOut,
  UserPlus,
  Settings,
  Activity,
  Target,
  Award,
  Mail,
  Phone,
  MapPin,
  Edit
} from 'lucide-react';

// This is a complete, self-contained React application.
// The app simulates a multi-page experience using state for routing.

// Base color palette and theme configuration for Tailwind
const primaryColor = 'bg-red-700';
const secondaryColor = 'bg-gray-100'; // Lighter background for content sections
const textColor = 'text-gray-900';
const lightTextColor = 'text-white';
const roundedCorners = 'rounded-xl';
const shadow = 'shadow-lg';
const transition = 'transition-all duration-300';
const hoverEffect = 'hover:bg-red-800 hover:scale-[1.01]';

// --- Header Component ---
const Header = ({ currentPage, setCurrentPage, user, setUser, setShowAuthModal }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navigationItems = [
    { name: 'Home', icon: Home, page: 'home' },
    { name: 'About Us', icon: Users, page: 'about' },
    { name: 'AI Trainer', icon: Brain, page: 'ai-trainer' },
    { name: 'News', icon: Newspaper, page: 'news' },
  ];

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
    setShowUserMenu(false);
  };

  return (
    <header className={`p-4 bg-gray-800 ${lightTextColor} ${shadow} sticky top-0 z-50`}>
      <nav className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-3xl font-extrabold tracking-tight">
            <span className="text-white">Beauty</span>
            <span className="text-red-400">Fitness</span>
          </h1>
        </div>
        
        <div className="hidden md:flex space-x-6 items-center">
          {navigationItems.map((item) => (
            <button
              key={item.page}
              onClick={() => setCurrentPage(item.page)}
              className={`flex items-center space-x-2 text-lg font-medium px-4 py-2 ${roundedCorners} ${transition} ${hoverEffect} ${
                currentPage === item.page ? `bg-white ${textColor} ${shadow}` : 'bg-transparent text-white'
              }`}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </button>
          ))}
        </div>

        {/* Account Section */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 bg-white text-gray-900 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <User size={20} />
                <span className="font-medium">{user.name}</span>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-50">
                  <button
                    onClick={() => {
                      setCurrentPage('profile');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <Settings size={16} />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowAuthModal('login')}
                className="flex items-center space-x-2 bg-transparent text-white px-4 py-2 rounded-xl border border-white hover:bg-white hover:text-gray-900 transition-colors"
              >
                <LogIn size={18} />
                <span>Login</span>
              </button>
              <button
                onClick={() => setShowAuthModal('signup')}
                className="flex items-center space-x-2 bg-white text-gray-900 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <UserPlus size={18} />
                <span>Sign Up</span>
              </button>
            </div>
          )}
        </div>

        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-white">
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={`md:hidden absolute top-16 left-0 right-0 bg-gray-800 p-4 ${shadow}`}>
          <div className="flex flex-col space-y-4">
            {navigationItems.map((item) => (
              <button
                key={item.page}
                onClick={() => {
                  setCurrentPage(item.page);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center space-x-2 text-xl font-medium p-3 ${roundedCorners} ${transition} ${hoverEffect} ${
                  currentPage === item.page ? `bg-white ${textColor} ${shadow}` : 'bg-transparent text-white'
                }`}
              >
                <item.icon size={24} />
                <span>{item.name}</span>
              </button>
            ))}
            
            {/* Mobile Account Section */}
            <div className="border-t border-red-600 pt-4 mt-4">
              {user ? (
                <>
                  <button
                    onClick={() => {
                      setCurrentPage('profile');
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 text-xl font-medium p-3 rounded-xl transition-all bg-transparent text-white w-full"
                  >
                    <User size={24} />
                    <span>{user.name}</span>
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 text-xl font-medium p-3 rounded-xl transition-all bg-transparent text-white w-full"
                  >
                    <LogOut size={24} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setShowAuthModal('login');
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 text-xl font-medium p-3 rounded-xl transition-all bg-transparent text-white w-full"
                  >
                    <LogIn size={24} />
                    <span>Login</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowAuthModal('signup');
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 text-xl font-medium p-3 rounded-xl transition-all bg-transparent text-white w-full"
                  >
                    <UserPlus size={24} />
                    <span>Sign Up</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

// --- Footer Component ---
const Footer = () => {
  return (
    <footer className={`bg-gray-900 ${lightTextColor} p-8 mt-8`}>
      <div className="container mx-auto text-center">
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold">
              <span className="text-white">Beauty</span>
              <span className="text-red-400">Fitness</span>
            </span>
          </div>
          <div className="text-sm">
            <p>&copy; 2023 BeautyFitness. All rights reserved.</p>
            <p>Designed with passion and code.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Authentication Modal Component ---
const AuthModal = ({ type, onClose, onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    if (type === 'signup') {
      if (!formData.name) {
        setError('Name is required');
        setIsLoading(false);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        setIsLoading(false);
        return;
      }
    }

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock user data
      const userData = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name || formData.email.split('@')[0],
        email: formData.email,
        joinDate: new Date().toISOString().split('T')[0],
        membershipType: 'Premium',
        workoutsCompleted: type === 'login' ? Math.floor(Math.random() * 50) : 0,
        currentStreak: type === 'login' ? Math.floor(Math.random() * 10) : 0
      };

      onLogin(userData);
      onClose();
    } catch (err) {
      setError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {type === 'login' ? 'Welcome Back!' : 'Join BeautyFitness'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {type === 'signup' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            {type === 'signup' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent"
                  placeholder="Confirm your password"
                />
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-700 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin mr-2" />
                  {type === 'login' ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                <>
                  {type === 'login' ? (
                    <>
                      <LogIn size={20} className="mr-2" />
                      Sign In
                    </>
                  ) : (
                    <>
                      <UserPlus size={20} className="mr-2" />
                      Create Account
                    </>
                  )}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {type === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => {
                  setError('');
                  setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                }}
                className="text-red-700 font-medium hover:text-red-800"
              >
                {type === 'login' ? 'Sign up here' : 'Sign in here'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- User Profile Page Component ---
const ProfilePage = ({ user, setUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    bio: ''
  });

  const textColor = 'text-gray-900';
  const roundedCorners = 'rounded-xl';
  const shadow = 'shadow-lg';

  const handleSave = () => {
    setUser({
      ...user,
      ...editData
    });
    setIsEditing(false);
  };

  const StatCard = ({ icon: Icon, title, value, subtitle }) => (
    <div className={`bg-white p-6 ${roundedCorners} ${shadow} text-center`}>
      <Icon size={32} className="text-red-700 mx-auto mb-3" />
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      <p className="text-gray-600 font-medium">{title}</p>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );

  if (!user) return null;

  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* Profile Header */}
      <div className={`bg-gradient-to-r from-red-700 to-red-800 text-white p-8 ${roundedCorners} ${shadow} mb-8`}>
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
            <User size={48} className="text-red-700" />
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-red-100 mb-2">{user.email}</p>
            <p className="text-red-200">Member since {user.joinDate}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-white text-red-700 rounded-full text-sm font-medium">
              {user.membershipType} Member
            </span>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-white text-red-700 px-4 py-2 rounded-lg font-medium hover:bg-red-50 transition-colors flex items-center space-x-2"
          >
            <Edit size={18} />
            <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={Activity}
          title="Workouts Completed"
          value={user.workoutsCompleted}
          subtitle="This month"
        />
        <StatCard
          icon={Target}
          title="Current Streak"
          value={`${user.currentStreak} days`}
          subtitle="Keep it up!"
        />
        <StatCard
          icon={Award}
          title="Membership"
          value={user.membershipType}
          subtitle="Active status"
        />
      </div>

      {/* Profile Information */}
      <div className={`bg-white p-8 ${roundedCorners} ${shadow}`}>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
        
        {isEditing ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({...editData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => setEditData({...editData, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={editData.location}
                  onChange={(e) => setEditData({...editData, location: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700"
                  placeholder="City, Country"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                value={editData.bio}
                onChange={(e) => setEditData({...editData, bio: e.target.value})}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700"
                placeholder="Tell us about yourself and your fitness goals..."
              />
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleSave}
                className="bg-red-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-800 transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <Mail size={20} className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              {editData.phone && (
                <div className="flex items-center space-x-3">
                  <Phone size={20} className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{editData.phone}</p>
                  </div>
                </div>
              )}
              {editData.location && (
                <div className="flex items-center space-x-3">
                  <MapPin size={20} className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{editData.location}</p>
                  </div>
                </div>
              )}
            </div>
            {editData.bio && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Bio</p>
                <p className="text-gray-700 leading-relaxed">{editData.bio}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// --- HomePage Component ---
const HomePage = () => {
  const roundedCorners = 'rounded-xl';
  const shadow = 'shadow-lg';
  const transition = 'transition-all duration-300';
  const hoverEffect = 'hover:bg-red-800 hover:scale-[1.01]';
  const lightTextColor = 'text-white';
  const textColor = 'text-gray-900';

  const ServiceCard = ({ icon: Icon, title, description }) => {
    return (
      <div className={`p-6 bg-white ${textColor} ${roundedCorners} ${shadow} ${hoverEffect} ${transition} text-center`}>
        <div className="flex justify-center mb-4 text-red-700">
          <Icon size={48} />
        </div>
        <h4 className="text-2xl font-bold mb-2">{title}</h4>
        <p className="opacity-90">{description}</p>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* Hero Section */}
      <section className={`flex flex-col lg:flex-row items-center justify-between p-8 md:p-12 bg-gray-900 ${lightTextColor} ${roundedCorners} ${shadow} mb-8`}>
        <div className="lg:w-1/2 text-center lg:text-left mb-6 lg:mb-0">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">Your Journey to a Stronger You Starts Here.</h2>
          <p className="text-lg md:text-2xl opacity-90">Achieve your fitness goals with state-of-the-art equipment and expert guidance.</p>
          <button className={`mt-6 inline-flex items-center px-8 py-4 bg-white ${textColor} font-bold text-xl ${roundedCorners} ${shadow} ${hoverEffect} ${transition}`}>
            Join Us Today!
            <Zap size={24} className="ml-2" />
          </button>
        </div>
        <div className="lg:w-1/2 flex justify-center">
          <img
            src="https://placehold.co/600x400/222222/FFFFFF?text=Fitness+Image"
            alt="Person exercising"
            className={`w-full max-w-sm lg:max-w-md ${roundedCorners} ${shadow}`}
          />
        </div>
      </section>

      {/* Services Section */}
      <section className="mb-8">
        <h3 className={`text-4xl font-bold text-center mb-10 ${textColor}`}>Our Services</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ServiceCard
            icon={HeartPulse}
            title="Personal Training"
            description="One-on-one sessions with certified trainers to craft a plan just for you."
          />
          <ServiceCard
            icon={MonitorPlay}
            title="Group Classes"
            description="High-energy classes like Yoga, Zumba, and HIIT to keep you motivated and engaged."
          />
          <ServiceCard
            icon={Leaf}
            title="Nutrition Coaching"
            description="Expert advice to fuel your body and complement your workout routine."
          />
        </div>
      </section>
    </div>
  );
};

// --- AboutPage Component ---
const AboutPage = () => {
  const textColor = 'text-gray-900';
  const roundedCorners = 'rounded-xl';
  const shadow = 'shadow-lg';

  const QuoteSection = () => {
    return (
      <div className={`bg-gray-100 p-8 ${roundedCorners} ${shadow}`}>
        <div className="flex items-center mb-4">
          <Quote size={40} className={`text-red-700 mr-4`} />
          <div>
            <h4 className="text-2xl font-bold">Our Philosophy</h4>
            <p className="text-lg italic">"Fitness is not a destination, it's a way of life."</p>
          </div>
        </div>
        <p className="text-md mt-4">
          We believe that consistent effort and a positive mindset are the keys to long-term success. Our trainers are committed to guiding you, not just through workouts, but by instilling habits that will last a lifetime.
        </p>
      </div>
    );
  };
  
  const MissionSection = () => {
    return (
      <div className={`bg-gray-100 p-8 ${roundedCorners} ${shadow}`}>
        <div className="flex items-center mb-4">
          <Sparkles size={40} className={`text-red-700 mr-4`} />
          <div>
            <h4 className="text-2xl font-bold">Our Mission</h4>
            <p className="text-lg">To empower you to become the best version of yourself.</p>
          </div>
        </div>
        <p className="text-md mt-4">
          We strive to create an inclusive and supportive environment where every member feels welcome. Our mission is to provide the tools, knowledge, and motivation you need to achieve your health and fitness goals.
        </p>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h2 className={`text-5xl font-bold text-center mb-8 ${textColor}`}>About BeautyFitness</h2>
      <div className={`bg-white p-8 ${roundedCorners} ${shadow} mb-8`}>
        <p className="text-lg mb-4">
          BeautyFitness is more than just a gym; it's a community dedicated to helping you achieve your health and wellness goals. We believe that fitness is a journey of self-discovery and empowerment. Our state-of-the-art facility, combined with our passionate and knowledgeable trainers, provides the perfect environment for you to thrive.
        </p>
        <p className="text-lg">
          We offer a wide range of services, from personalized training plans to high-energy group classes, all designed to cater to different fitness levels and interests. Our mission is to inspire and support you every step of the way, helping you unlock your full potential and embrace a healthier, more active lifestyle.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <QuoteSection />
        <MissionSection />
      </div>
    </div>
  );
};

// --- News Page Component ---
const NewsPage = () => {
  const textColor = 'text-gray-900';
  const roundedCorners = 'rounded-xl';
  const shadow = 'shadow-lg';
  const transition = 'transition-all duration-300';
  const hoverEffect = 'hover:shadow-xl hover:scale-[1.02]';

  const newsArticles = [
    {
      id: 1,
      title: "New Equipment Arrival: State-of-the-Art Cardio Machines",
      excerpt: "We're excited to announce the arrival of our new premium cardio equipment, featuring the latest technology for an enhanced workout experience.",
      content: "Our gym has just received a shipment of cutting-edge cardio machines, including smart treadmills with virtual reality integration, advanced elliptical trainers with personalized coaching, and high-tech rowing machines that simulate real water conditions.",
      date: "August 10, 2025",
      category: "Equipment",
      author: "BeautyFitness Team",
      readTime: "3 min read",
      image: "https://placehold.co/400x250/DC2626/FFFFFF?text=New+Equipment"
    },
    {
      id: 2,
      title: "Summer Fitness Challenge: Transform Your Body in 30 Days",
      excerpt: "Join our exclusive summer fitness challenge designed to help you achieve your best physique with personalized training and nutrition guidance.",
      content: "Our 30-day summer challenge includes daily workout routines, meal planning, progress tracking, and weekly check-ins with certified trainers. Participants will receive exclusive access to advanced nutrition workshops and specialized group classes.",
      date: "August 8, 2025",
      category: "Challenge",
      author: "Sarah Johnson, Head Trainer",
      readTime: "5 min read",
      image: "https://placehold.co/400x250/059669/FFFFFF?text=Summer+Challenge"
    },
    {
      id: 3,
      title: "Nutrition Workshop: Fuel Your Fitness Journey",
      excerpt: "Learn how to optimize your nutrition for better performance and faster results with our comprehensive nutrition workshop series.",
      content: "Our certified nutritionists will guide you through meal planning, supplement selection, and timing strategies. Topics include pre and post-workout nutrition, hydration strategies, and creating sustainable eating habits that support your fitness goals.",
      date: "August 5, 2025",
      category: "Nutrition",
      author: "Dr. Michael Chen, Nutritionist",
      readTime: "4 min read",
      image: "https://placehold.co/400x250/7C3AED/FFFFFF?text=Nutrition+Workshop"
    },
    {
      id: 4,
      title: "New Class Alert: High-Intensity Interval Training (HIIT)",
      excerpt: "Experience the most effective fat-burning workout with our new HIIT classes, designed for all fitness levels.",
      content: "Our new HIIT classes combine strength training and cardio in explosive 45-minute sessions. These scientifically-proven workouts will boost your metabolism, improve cardiovascular health, and build lean muscle mass efficiently.",
      date: "August 3, 2025",
      category: "Classes",
      author: "Jake Martinez, Fitness Instructor",
      readTime: "2 min read",
      image: "https://placehold.co/400x250/EA580C/FFFFFF?text=HIIT+Classes"
    },
    {
      id: 5,
      title: "Mental Health and Fitness: The Mind-Body Connection",
      excerpt: "Discover how regular exercise can improve your mental health and overall well-being in our latest wellness series.",
      content: "Research shows that regular exercise can reduce anxiety, depression, and stress while improving mood and cognitive function. Our wellness coaches will share practical strategies for using fitness as a tool for mental health.",
      date: "August 1, 2025",
      category: "Wellness",
      author: "Lisa Thompson, Wellness Coach",
      readTime: "6 min read",
      image: "https://placehold.co/400x250/0891B2/FFFFFF?text=Mental+Health"
    },
    {
      id: 6,
      title: "Member Success Story: John's 50-Pound Transformation",
      excerpt: "Read about John's incredible fitness journey and how he transformed his life with dedication and the right support system.",
      content: "John started his journey 8 months ago weighing 250 pounds. Through consistent training, proper nutrition, and unwavering support from our team, he has lost 50 pounds and gained confidence, strength, and a new lease on life.",
      date: "July 28, 2025",
      category: "Success Story",
      author: "BeautyFitness Community",
      readTime: "4 min read",
      image: "https://placehold.co/400x250/DC2626/FFFFFF?text=Success+Story"
    }
  ];

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedArticle, setExpandedArticle] = useState(null);

  const categories = ['All', 'Equipment', 'Challenge', 'Nutrition', 'Classes', 'Wellness', 'Success Story'];

  const filteredArticles = selectedCategory === 'All' 
    ? newsArticles 
    : newsArticles.filter(article => article.category === selectedCategory);

  const CategoryButton = ({ category, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 ${roundedCorners} ${transition} font-medium ${
        isActive 
          ? 'bg-red-700 text-white shadow-md' 
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {category}
    </button>
  );

  const NewsCard = ({ article }) => (
    <article className={`bg-white p-6 ${roundedCorners} ${shadow} ${hoverEffect} ${transition}`}>
      <img 
        src={article.image} 
        alt={article.title}
        className={`w-full h-48 object-cover ${roundedCorners} mb-4`}
      />
      
      <div className="flex items-center justify-between mb-3">
        <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
          {article.category}
        </span>
        <div className="flex items-center text-gray-500 text-sm">
          <Calendar size={16} className="mr-1" />
          {article.date}
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
        {article.title}
      </h3>

      <p className="text-gray-600 mb-4 leading-relaxed">
        {expandedArticle === article.id ? article.content : article.excerpt}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-500">
          <span className="mr-3">{article.author}</span>
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            {article.readTime}
          </div>
        </div>
        
        <button
          onClick={() => setExpandedArticle(
            expandedArticle === article.id ? null : article.id
          )}
          className="flex items-center text-red-700 font-medium hover:text-red-800 transition-colors"
        >
          {expandedArticle === article.id ? 'Read Less' : 'Read More'}
          <ArrowRight size={16} className="ml-1" />
        </button>
      </div>
    </article>
  );

  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h2 className={`text-5xl font-bold mb-4 ${textColor}`}>Fitness News & Updates</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Stay updated with the latest fitness trends, equipment arrivals, success stories, and wellness tips from our BeautyFitness community.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((category) => (
          <CategoryButton
            key={category}
            category={category}
            isActive={selectedCategory === category}
            onClick={() => setSelectedCategory(category)}
          />
        ))}
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredArticles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>

      {/* Newsletter Signup */}
      <div className={`mt-16 bg-gradient-to-r from-red-700 to-red-800 text-white p-8 ${roundedCorners} ${shadow} text-center`}>
        <div className="max-w-2xl mx-auto">
          <Newspaper size={48} className="mx-auto mb-4" />
          <h3 className="text-3xl font-bold mb-4">Stay in the Loop!</h3>
          <p className="text-lg mb-6 opacity-90">
            Subscribe to our newsletter and never miss important updates, new class announcements, or exclusive member benefits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="px-6 py-3 bg-white text-red-700 font-bold rounded-lg hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- AI Trainer Page Component ---
const AiTrainerPage = () => {
  const [goal, setGoal] = useState('');
  const [fitnessLevel, setFitnessLevel] = useState('Beginner');
  const [frequency, setFrequency] = useState('3 times a week');
  const [generatedProgram, setGeneratedProgram] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const primaryColor = 'bg-red-700';
  const lightTextColor = 'text-white';
  const roundedCorners = 'rounded-xl';
  const shadow = 'shadow-lg';
  const transition = 'transition-all duration-300';
  const hoverEffect = 'hover:bg-red-800 hover:scale-[1.01]';
  const textColor = 'text-gray-900';

  const generateProgram = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedProgram('');

    const requestBody = {
      goal,
      fitness_level: fitnessLevel,
      frequency,
    };

    try {
      // Simulate a network delay to mimic the time it would take for a real API call.
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockResponse = {
        program: `
          # Personalized 4-Week Training Plan

          Congratulations on taking the first step towards your fitness goals! This plan is designed to help you **${requestBody.goal}** at an **${requestBody.fitness_level}** level, with a training frequency of **${requestBody.frequency}**.

          ### Week 1: Foundation Building

          **Day 1: Full Body Strength**
          -   **Warm-up:** 5 minutes of light cardio (jumping jacks, jogging in place).
          -   **Workout:**
              -   Squats: 3 sets of 10 reps
              -   Push-ups (on knees if needed): 3 sets of 8 reps
              -   Lunges: 3 sets of 10 reps per leg
              -   Plank: 3 sets, hold for 30 seconds
          -   **Cool-down:** 5 minutes of stretching.
        `
      };

      setGeneratedProgram(mockResponse.program);

    } catch (err) {
      console.error(err);
      setError('Failed to generate program. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h2 className={`text-5xl font-bold text-center mb-8 ${textColor}`}>Your AI Fitness Trainer</h2>
      <div className={`bg-gray-100 p-8 ${roundedCorners} ${shadow} mb-8`}>
        <p className="text-lg mb-6 text-center">
          Get a personalized 4-week training plan tailored to your goals and fitness level.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Goal Input */}
          <div>
            <label htmlFor="goal" className="block text-lg font-medium mb-2">What is your main fitness goal?</label>
            <input
              id="goal"
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g., Build muscle, lose weight, improve endurance"
              className={`w-full p-3 border-2 border-gray-300 ${roundedCorners} focus:outline-none focus:ring-2 focus:ring-red-700`}
            />
          </div>
          {/* Fitness Level Dropdown */}
          <div>
            <label htmlFor="fitnessLevel" className="block text-lg font-medium mb-2">Your current fitness level?</label>
            <select
              id="fitnessLevel"
              value={fitnessLevel}
              onChange={(e) => setFitnessLevel(e.target.value)}
              className={`w-full p-3 border-2 border-gray-300 ${roundedCorners} focus:outline-none focus:ring-2 focus:ring-red-700`}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          {/* Frequency Dropdown */}
          <div>
            <label htmlFor="frequency" className="block text-lg font-medium mb-2">How often can you train?</label>
            <select
              id="frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className={`w-full p-3 border-2 border-gray-300 ${roundedCorners} focus:outline-none focus:ring-2 focus:ring-red-700`}
            >
              <option value="2 times a week">2 times a week</option>
              <option value="3 times a week">3 times a week</option>
              <option value="4 times a week">4 times a week</option>
              <option value="5+ times a week">5+ times a week</option>
            </select>
          </div>
        </div>
        <div className="flex justify-center">
          <button
            onClick={generateProgram}
            disabled={isLoading || !goal.trim()}
            className={`flex items-center px-8 py-3 ${primaryColor} ${lightTextColor} font-bold text-lg ${roundedCorners} ${shadow} ${hoverEffect} ${transition} disabled:bg-gray-400 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <>
                <Loader2 size={24} className="animate-spin mr-2" />
                Generating...
              </>
            ) : (
              <>
                <ClipboardList size={24} className="mr-2" />
                Generate My Program
              </>
            )}
          </button>
        </div>
      </div>

      {/* Program Output Section */}
      {generatedProgram && (
        <div className={`bg-white p-8 ${roundedCorners} ${shadow}`}>
          <h3 className={`text-4xl font-bold mb-4 ${textColor}`}>Your Personalized Training Plan</h3>
          <div 
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-strong:text-red-700" 
            dangerouslySetInnerHTML={{ __html: marked(generatedProgram) }} 
          />
        </div>
      )}
      {error && (
        <div className={`p-4 bg-red-100 border-l-4 border-red-700 text-red-700 ${roundedCorners} mt-6`}>
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

// --- Main App Component ---
export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(null); // 'login', 'signup', or null

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage />;
      case 'ai-trainer':
        return <AiTrainerPage />;
      case 'news':
        return <NewsPage />;
      case 'profile':
        return <ProfilePage user={user} setUser={setUser} />;
      default:
        return <HomePage />;
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleCloseModal = () => {
    setShowAuthModal(null);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased bg-gray-50 text-gray-900">
      <Header 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        user={user}
        setUser={setUser}
        setShowAuthModal={setShowAuthModal}
      />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer />
      
      {/* Authentication Modal */}
      {showAuthModal && (
        <AuthModal
          type={showAuthModal}
          onClose={handleCloseModal}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
}
