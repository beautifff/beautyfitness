import { useState } from 'react';
import { Dumbbell, Home, Users, Brain, Menu, X } from 'lucide-react';

const primaryColor = 'bg-red-700';
const textColor = 'text-gray-900';
const lightTextColor = 'text-white';
const roundedCorners = 'rounded-xl';
const shadow = 'shadow-lg';
const transition = 'transition-all duration-300';
const hoverEffect = 'hover:bg-red-800 hover:scale-[1.01]';

const Header = ({ currentPage, setCurrentPage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { name: 'Home', icon: Home, page: 'home' },
    { name: 'About Us', icon: Users, page: 'about' },
    { name: 'AI Trainer', icon: Brain, page: 'ai-trainer' },
  ];

  return (
    <header className={`p-4 ${primaryColor} ${lightTextColor} ${shadow} sticky top-0 z-50`}>
      <nav className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Dumbbell size={32} />
          <h1 className="text-3xl font-extrabold tracking-tight">BeautyFitness</h1>
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
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-white">
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={`md:hidden absolute top-16 left-0 right-0 ${primaryColor} p-4 ${shadow}`}>
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
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
