import React from 'react';
import { Filter, BarChart3, Clock, CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';
import { statusOptions, categories, priorityLevels } from '../data/sampleData';
import './Sidebar.css';

function Sidebar({ isOpen, contentItems, filters, onFilterChange }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} />;
      case 'approved':
        return <CheckCircle size={16} />;
      case 'rejected':
        return <XCircle size={16} />;
      case 'flagged':
        return <AlertTriangle size={16} />;
      default:
        return null;
    }
  };

  const getStatusCount = (status) => {
    if (status === 'all') return contentItems.length;
    return contentItems.filter(item => item.status === status).length;
  };

  const getPriorityCount = (priority) => {
    if (priority === 'all') return contentItems.length;
    return contentItems.filter(item => item.priority === priority).length;
  };

  const getCategoryCount = (category) => {
    if (category === 'all') return contentItems.length;
    return contentItems.filter(item => item.category === category).length;
  };

  // Calculate dynamic moderation statistics
  const getModerationStats = () => {
    const stats = {
      total: contentItems.length,
      pending: 0,
      approved: 0,
      rejected: 0,
      flagged: 0
    };

    contentItems.forEach(item => {
      switch (item.status) {
        case 'pending':
          stats.pending++;
          break;
        case 'approved':
          stats.approved++;
          break;
        case 'rejected':
          stats.rejected++;
          break;
        case 'flagged':
          stats.flagged++;
          break;
        default:
          break;
      }
    });

    return stats;
  };

  const moderationStats = getModerationStats();

  return (
    <>
      {isOpen && <div className="sidebar-overlay" />}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-content">
          {/* Statistics */}
          <div className="sidebar-section">
            <div className="section-header">
              <BarChart3 size={18} />
              <h3>Statistics</h3>
            </div>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{moderationStats.total}</div>
                <div className="stat-label">Total</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{moderationStats.pending}</div>
                <div className="stat-label">Pending</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{moderationStats.approved}</div>
                <div className="stat-label">Approved</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{moderationStats.rejected}</div>
                <div className="stat-label">Rejected</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="sidebar-section">
            <div className="section-header">
              <Filter size={18} />
              <h3>Filters</h3>
            </div>

            {/* Status Filter */}
            <div className="filter-group">
              <label className="filter-label">Status</label>
              <div className="filter-options">
                {statusOptions.map(status => (
                  <button
                    key={status}
                    className={`filter-option ${filters.status === status ? 'active' : ''}`}
                    onClick={() => onFilterChange('status', status)}
                  >
                    {getStatusIcon(status)}
                    <span className="filter-text">
                      {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                    <span className="filter-count">({getStatusCount(status)})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Priority Filter */}
            <div className="filter-group">
              <label className="filter-label">Priority</label>
              <div className="filter-options">
                {priorityLevels.map(priority => (
                  <button
                    key={priority}
                    className={`filter-option ${filters.priority === priority ? 'active' : ''}`}
                    onClick={() => onFilterChange('priority', priority)}
                  >
                    <span className="filter-text">
                      {priority === 'all' ? 'All' : priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </span>
                    <span className="filter-count">({getPriorityCount(priority)})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="filter-group">
              <label className="filter-label">Category</label>
              <div className="filter-options">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`filter-option ${filters.category === category ? 'active' : ''}`}
                    onClick={() => onFilterChange('category', category)}
                  >
                    <span className="filter-text">
                      {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </span>
                    <span className="filter-count">({getCategoryCount(category)})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="sidebar-section">
            <div className="section-header">
              <AlertTriangle size={18} />
              <h3>Quick Actions</h3>
            </div>
            <div className="quick-actions">
              <button 
                className="quick-action-btn"
                onClick={() => onFilterChange('status', 'flagged')}
              >
                <AlertTriangle size={16} />
                Review Flagged ({getStatusCount('flagged')})
              </button>
              <button 
                className="quick-action-btn"
                onClick={() => onFilterChange('priority', 'high')}
              >
                <Clock size={16} />
                High Priority ({getPriorityCount('high')})
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar; 