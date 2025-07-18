import React, { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle, AlertTriangle, Clock, Flag, User, MessageSquare, Image, Video, Calendar, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import './ContentPreview.css';

function ContentPreview({ content, onModerationAction, onClose, onNavigate, currentIndex, totalCount }) {
  const [actionReason, setActionReason] = useState('');
  const [showReasonInput, setShowReasonInput] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock size={20} className="status-icon pending" />;
      case 'approved':
        return <CheckCircle size={20} className="status-icon approved" />;
      case 'rejected':
        return <XCircle size={20} className="status-icon rejected" />;
      case 'flagged':
        return <AlertTriangle size={20} className="status-icon flagged" />;
      default:
        return null;
    }
  };

  const getContentTypeIcon = (type) => {
    switch (type) {
      case 'image':
        return <Image size={20} className="content-type-icon" />;
      case 'video':
        return <Video size={20} className="content-type-icon" />;
      case 'text':
        return <MessageSquare size={20} className="content-type-icon" />;
      default:
        return <MessageSquare size={20} className="content-type-icon" />;
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
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

  const handleAction = (action) => {
    if (action === 'rejected' || action === 'flagged') {
      setPendingAction(action);
      setShowReasonInput(true);
    } else {
      onModerationAction(content.id, action);
    }
  };

  const submitAction = () => {
    if (pendingAction && actionReason.trim()) {
      onModerationAction(content.id, pendingAction, actionReason.trim());
      setShowReasonInput(false);
      setPendingAction(null);
      setActionReason('');
    }
  };

  const cancelAction = () => {
    setShowReasonInput(false);
    setPendingAction(null);
    setActionReason('');
  };

  const handleNavigate = (direction) => {
    // Clear any pending actions when navigating
    cancelAction();
    onNavigate(direction);
  };

  const isPostProcessed = (status) => {
    return status === 'approved' || status === 'rejected';
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container">
        <div className="content-preview">
          <div className="preview-header">
            <div className="preview-title">
              <h3>Content Details</h3>
              <span className={`status-badge ${content.status}`}>
                {getStatusIcon(content.status)}
                {content.status.charAt(0).toUpperCase() + content.status.slice(1)}
              </span>
            </div>
            
            <div className="preview-navigation">
              <div className="post-counter">
                {currentIndex + 1} of {totalCount}
              </div>
              <div className="nav-buttons">
                <button 
                  className="nav-btn" 
                  onClick={() => handleNavigate('prev')}
                  title="Previous post"
                  disabled={totalCount <= 1}
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  className="nav-btn" 
                  onClick={() => handleNavigate('next')}
                  title="Next post"
                  disabled={totalCount <= 1}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              <button className="close-btn" onClick={onClose}>
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="preview-content">
            <div className="content-header">
              <div className="content-info">
                <div className="content-type">
                  {getContentTypeIcon(content.type)}
                  <span>{content.type.charAt(0).toUpperCase() + content.type.slice(1)} Content</span>
                </div>
                <div className="content-priority">
                  <span className={`priority-badge ${getPriorityClass(content.priority)}`}>
                    {content.priority.toUpperCase()} PRIORITY
                  </span>
                </div>
              </div>
              <div className="content-meta">
                <div className="meta-item">
                  <Calendar size={16} />
                  <span>{formatTimestamp(content.timestamp)}</span>
                </div>
                <div className="meta-item">
                  <Tag size={16} />
                  <span>{content.category}</span>
                </div>
              </div>
            </div>

            <div className="content-body">
              <div className="content-text">
                <h4>Post Content</h4>
                <p>{content.content}</p>
              </div>
              
              {content.imageUrl && (
                <div className="content-media">
                  <h4>Media Content</h4>
                  <img src={content.imageUrl} alt="Content media" className="media-full" />
                </div>
              )}
              
              {content.videoUrl && (
                <div className="content-media">
                  <h4>Video Content</h4>
                  <video controls className="media-full">
                    <source src={content.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>

            <div className="author-section">
              <div className="section-title">
                <User size={18} />
                <h4>Author Information</h4>
              </div>
              <div className="author-card">
                <img src={content.author.avatar} alt={content.author.name} className="author-avatar-large" />
                <div className="author-info">
                  <h5>{content.author.name}</h5>
                  <p>@{content.author.username}</p>
                </div>
              </div>
            </div>

            {(content.reportCount > 0 || content.reportReason) && (
              <div className="report-section">
                <div className="section-title">
                  <Flag size={18} />
                  <h4>Reports & Moderation</h4>
                </div>
                <div className="report-info">
                  {content.reportCount > 0 && (
                    <div className="report-count">
                      <span className="count">{content.reportCount}</span>
                      <span className="label">Reports</span>
                    </div>
                  )}
                  {content.reportReason && (
                    <div className="report-reason">
                      <strong>Reported Reason:</strong> {content.reportReason}
                    </div>
                  )}
                </div>
              </div>
            )}

            {showReasonInput && (
              <div className="reason-section">
                <div className="section-title">
                  <MessageSquare size={18} />
                  <h4>Action Reason</h4>
                </div>
                <textarea
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder="Please provide a reason for this action..."
                  className="reason-input"
                  rows="3"
                />
                <div className="reason-actions">
                  <button className="btn btn-primary" onClick={submitAction}>
                    Submit Action
                  </button>
                  <button className="btn btn-secondary" onClick={cancelAction}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="preview-actions">
            <div className="action-title">
              <h4>Moderation Actions</h4>
              {isPostProcessed(content.status) && (
                <span className="processed-notice">
                  This post has been processed
                </span>
              )}
            </div>
            <div className="action-buttons">
              <button
                className="btn btn-success"
                onClick={() => handleAction('approved')}
                disabled={content.status === 'approved'}
              >
                <CheckCircle size={16} />
                Approve
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleAction('rejected')}
                disabled={content.status === 'rejected'}
              >
                <XCircle size={16} />
                Reject
              </button>
              <button
                className="btn btn-warning"
                onClick={() => handleAction('flagged')}
                disabled={content.status === 'flagged'}
              >
                <AlertTriangle size={16} />
                Flag
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => handleAction('pending')}
                disabled={content.status === 'pending'}
              >
                <Clock size={16} />
                Reset to Pending
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentPreview; 