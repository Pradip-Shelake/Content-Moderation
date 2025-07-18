import React from 'react';
import { Search, Menu, Bell, User, Shield } from 'lucide-react';
import './Header.css';

function Header({ onToggleSidebar, filters, onFilterChange }) {
  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle" onClick={onToggleSidebar}>
          <Menu size={20} />
        </button>
        
        <div className="header-brand">
          <Shield size={24} />
          <h1>Content Moderation</h1>
        </div>
      </div>
      
      <div className="header-center">
        <div className="search-container">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search content, users, or keywords..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      
      <div className="header-right">
        <button className="notification-btn">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>
        
        <div className="user-menu">
          <button className="user-btn">
            <User size={20} />
            <span className="user-name">Moderator</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header; 