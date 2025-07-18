import React, { useEffect, useState } from 'react';
import { CheckCircle, Info, AlertCircle, X, RotateCcw } from 'lucide-react';
import './Toast.css';

function Toast({ message, type = 'success', showUndo = false, onUndo, onDismiss, duration = 5000 }) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    // Show toast with animation
    const showTimer = setTimeout(() => setIsVisible(true), 100);
    
    // Auto-dismiss timer
    const dismissTimer = setTimeout(() => {
      handleDismiss();
    }, duration);

    // Countdown timer for progress bar
    const countdownTimer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 100) {
          clearInterval(countdownTimer);
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(dismissTimer);
      clearInterval(countdownTimer);
    };
  }, [duration]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'info':
        return <Info size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      default:
        return <CheckCircle size={20} />;
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      onDismiss();
    }, 300); // Wait for animation to complete
  };

  const handleUndo = () => {
    onUndo();
    handleDismiss();
  };

  const progressPercentage = (timeLeft / duration) * 100;

  return (
    <div className={`toast-container ${isVisible ? 'toast-visible' : ''}`}>
      <div className={`toast toast-${type}`}>
        <div className="toast-content">
          <div className="toast-icon">
            {getIcon()}
          </div>
          
          <div className="toast-message">
            {message}
          </div>
          
          <div className="toast-actions">
            {showUndo && (
              <button className="toast-undo-btn" onClick={handleUndo}>
                <RotateCcw size={16} />
                Undo
              </button>
            )}
            
            <button className="toast-close-btn" onClick={handleDismiss}>
              <X size={16} />
            </button>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="toast-progress">
          <div 
            className="toast-progress-bar"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default Toast; 