import React from 'react';
import { Clock, CheckCircle, XCircle, AlertTriangle, Image, Video, MessageSquare, Flag, User, Check, Square, Loader2 } from 'lucide-react';
import Pagination from './Pagination';
import './ContentList.css';

function ContentList({ 
  contentItems, 
  selectedContent, 
  selectedPosts, 
  sortOrder,
  loading,
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onContentSelect, 
  onModerationAction, 
  onBatchModerationAction,
  onPostSelection,
  onSelectAll,
  onSortChange,
  onPageChange,
  onPageSizeChange
}) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} className="status-icon pending" />;
      case 'approved':
        return <CheckCircle size={16} className="status-icon approved" />;
      case 'rejected':
        return <XCircle size={16} className="status-icon rejected" />;
      case 'flagged':
        return <AlertTriangle size={16} className="status-icon flagged" />;
      default:
        return null;
    }
  };

  const getContentTypeIcon = (type) => {
    switch (type) {
      case 'image':
        return <Image size={16} className="content-type-icon" />;
      case 'video':
        return <Video size={16} className="content-type-icon" />;
      case 'text':
        return <MessageSquare size={16} className="content-type-icon" />;
      default:
        return <MessageSquare size={16} className="content-type-icon" />;
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return 'priority-low';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  const truncateContent = (content, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const handleQuickAction = (e, contentId, action) => {
    e.stopPropagation();
    onModerationAction(contentId, action);
  };

  const handleCheckboxChange = (e, postId) => {
    e.stopPropagation();
    onPostSelection(postId, e.target.checked);
  };

  const handleSelectAllChange = (e) => {
    onSelectAll(e.target.checked);
  };

  const handleSortChange = (e) => {
    onSortChange(e.target.value);
  };

  const isAllSelected = contentItems.length > 0 && selectedPosts.length === contentItems.length;
  const isPartiallySelected = selectedPosts.length > 0 && selectedPosts.length < contentItems.length;

  const isPostProcessed = (status) => {
    return status === 'approved' || status === 'rejected';
  };

  const getSortLabel = (sortOrder) => {
    switch (sortOrder) {
      case 'newest':
        return 'Newest first';
      case 'oldest':
        return 'Oldest first';
      case 'priority':
        return 'Priority';
      default:
        return 'Newest first';
    }
  };

  return (
    <div className="content-list">
      <div className="content-list-header">
        <div className="header-title">
          <h2>
            Content Review
            {!loading && totalItems > 0 && (
              <span className="total-count">({totalItems} total)</span>
            )}
            {loading && (
              <span className="loading-indicator">
                <Loader2 size={16} className="spinner" />
                Loading...
              </span>
            )}
          </h2>
          {selectedPosts.length > 0 && (
            <span className="selection-count">
              {selectedPosts.length} selected
            </span>
          )}
        </div>
        <div className="header-actions">
          <select 
            className="sort-select" 
            value={sortOrder} 
            onChange={handleSortChange}
            disabled={loading}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>

      {/* Batch Operations Bar */}
      {contentItems.length > 0 && (
        <div className="batch-operations">
          <div className="batch-selection">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={isAllSelected}
                ref={input => {
                  if (input) input.indeterminate = isPartiallySelected;
                }}
                onChange={handleSelectAllChange}
                disabled={loading}
              />
              <span className="checkmark"></span>
              Select All (Current Page)
            </label>
            {sortOrder && (
              <span className="sort-indicator">
                Sorted by: <strong>{getSortLabel(sortOrder)}</strong>
              </span>
            )}
          </div>
          
          {selectedPosts.length > 0 && (
            <div className="batch-actions">
              <button
                className="btn btn-success"
                onClick={() => onBatchModerationAction('approved')}
                disabled={loading}
              >
                <CheckCircle size={16} />
                Approve Selected ({selectedPosts.length})
              </button>
              <button
                className="btn btn-danger"
                onClick={() => onBatchModerationAction('rejected')}
                disabled={loading}
              >
                <XCircle size={16} />
                Reject Selected ({selectedPosts.length})
              </button>
              <button
                className="btn btn-warning"
                onClick={() => onBatchModerationAction('flagged')}
                disabled={loading}
              >
                <AlertTriangle size={16} />
                Flag Selected ({selectedPosts.length})
              </button>
            </div>
          )}
        </div>
      )}

      <div className="content-items">
        {loading && contentItems.length === 0 ? (
          <div className="loading-state">
            <Loader2 size={48} className="loading-spinner" />
            <h3>Loading content...</h3>
            <p>Please wait while we fetch the latest posts.</p>
          </div>
        ) : contentItems.length === 0 ? (
          <div className="empty-state">
            <MessageSquare size={48} className="empty-icon" />
            <h3>No content found</h3>
            <p>Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <>
            <div className={`content-grid ${loading ? 'loading' : ''}`}>
              {contentItems.map(item => (
                <div
                  key={item.id}
                  className={`content-item ${selectedContent?.id === item.id ? 'selected' : ''} ${getPriorityClass(item.priority)} ${isPostProcessed(item.status) ? 'processed' : ''}`}
                  onClick={() => onContentSelect(item)}
                >
                  <div className="content-item-header">
                    <div className="content-selection">
                      <label className="checkbox-container" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedPosts.includes(item.id)}
                          onChange={(e) => handleCheckboxChange(e, item.id)}
                          disabled={loading}
                        />
                        <span className="checkmark"></span>
                      </label>
                    </div>
                    
                    <div className="content-meta">
                      <div className="content-type">
                        {getContentTypeIcon(item.type)}
                      </div>
                      <div className="content-status">
                        {getStatusIcon(item.status)}
                      </div>
                      <div className="content-timestamp">
                        {formatTimestamp(item.timestamp)}
                      </div>
                    </div>
                    <div className="content-priority">
                      <span className={`priority-badge ${getPriorityClass(item.priority)}`}>
                        {item.priority}
                      </span>
                    </div>
                  </div>

                  <div className="content-body">
                    <div className="content-text">
                      <strong className="content-title">
                        {truncateContent(item.content, 60)}
                      </strong>
                      <p className="content-description">
                        {truncateContent(item.content, 100)}
                      </p>
                    </div>
                    
                    {item.imageUrl && (
                      <div className="content-media">
                        <img src={item.imageUrl} alt="Content preview" className="media-preview" />
                      </div>
                    )}
                  </div>

                  <div className="content-footer">
                    <div className="author-info">
                      <img src={item.author.avatar} alt={item.author.name} className="author-avatar" />
                      <div className="author-details">
                        <span className="author-name">{item.author.name}</span>
                        <span className="author-username">@{item.author.username}</span>
                      </div>
                    </div>

                    <div className="content-metadata">
                      {item.reportReason && (
                        <div className="report-reason">
                          <strong>Reported:</strong> {item.reportReason}
                        </div>
                      )}
                      {item.reportCount > 0 && (
                        <div className="report-count">
                          <Flag size={14} />
                          <span>{item.reportCount} reports</span>
                        </div>
                      )}
                    </div>

                    <div className="content-actions">
                      {item.status === 'pending' && (
                        <div className="quick-actions">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={(e) => handleQuickAction(e, item.id, 'approved')}
                            title="Approve"
                            disabled={loading}
                          >
                            <CheckCircle size={14} />
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={(e) => handleQuickAction(e, item.id, 'rejected')}
                            title="Reject"
                            disabled={loading}
                          >
                            <XCircle size={14} />
                          </button>
                        </div>
                      )}
                      
                      {isPostProcessed(item.status) && (
                        <div className="processed-indicator">
                          <span className={`badge badge-${item.status}`}>
                            {item.status === 'approved' ? 'Approved' : 'Rejected'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Loading overlay for pagination changes */}
            {loading && contentItems.length > 0 && (
              <div className="pagination-loading-overlay">
                <div className="pagination-loading-content">
                  <Loader2 size={24} className="spinner" />
                  <span>Loading page {currentPage}...</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          loading={loading}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
}

export default ContentList; 