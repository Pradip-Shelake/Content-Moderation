import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ContentList from './components/ContentList';
import ContentPreview from './components/ContentPreview';
import Toast from './components/Toast';
import {
  fetchContent,
  moderateContent,
  setCurrentPage,
  setPageSize,
  setFilters,
  setSortOrder,
  setSelectedContent,
  setSelectedPosts,
  togglePostSelection,
  selectAllPosts,
  updateContentStatus,
  undoLastAction,
  setToastMessage,
  clearToastMessage,
  clearError
} from './store/slices/contentSlice';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const {
    items: contentItems,
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    filters,
    sortOrder,
    loading,
    error,
    selectedContent,
    selectedPosts,
    undoStack,
    toastMessage
  } = useSelector(state => state.content);

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  // Fetch content when filters, sorting, or pagination changes
  useEffect(() => {
    dispatch(fetchContent({ 
      page: currentPage, 
      pageSize, 
      filters, 
      sortOrder 
    }));
  }, [dispatch, currentPage, pageSize, filters, sortOrder]);

  // Calculate statistics from current filtered content
  const allFilteredItems = useSelector(state => {
    const { allItems, filters } = state.content;
    return allItems.filter(item => {
      const matchesStatus = filters.status === 'all' || item.status === filters.status;
      const matchesPriority = filters.priority === 'all' || item.priority === filters.priority;
      const matchesCategory = filters.category === 'all' || item.category === filters.category;
      const matchesSearch = filters.search === '' || 
        item.content.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.author.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.author.username.toLowerCase().includes(filters.search.toLowerCase());
      
      return matchesStatus && matchesPriority && matchesCategory && matchesSearch;
    });
  });

  // Handle content moderation actions
  const handleModerationAction = async (contentId, action, reason = null) => {
    // Update UI immediately
    dispatch(updateContentStatus({ 
      contentIds: [contentId], 
      action, 
      reason 
    }));
    
    // Show toast notification
    const actionText = action === 'approved' ? 'approved' : 
                      action === 'rejected' ? 'rejected' : 
                      action === 'flagged' ? 'flagged' : 'updated';
    dispatch(setToastMessage({
      id: Date.now(),
      message: `Post ${actionText} successfully`,
      type: 'success',
      showUndo: true,
      timestamp: Date.now()
    }));

    // Dispatch async action for API call (simulated)
    try {
      await dispatch(moderateContent({ 
        contentIds: [contentId], 
        action, 
        reason 
      })).unwrap();
    } catch (error) {
      console.error('Moderation failed:', error);
      // Could add error handling/rollback here
    }
  };

  // Handle batch moderation actions
  const handleBatchModerationAction = async (action) => {
    if (selectedPosts.length === 0) return;

    // Update UI immediately
    dispatch(updateContentStatus({ 
      contentIds: selectedPosts, 
      action 
    }));
    
    // Show toast notification
    const actionText = action === 'approved' ? 'approved' : 
                      action === 'rejected' ? 'rejected' : 
                      action === 'flagged' ? 'flagged' : 'updated';
    dispatch(setToastMessage({
      id: Date.now(),
      message: `${selectedPosts.length} posts ${actionText} successfully`,
      type: 'success',
      showUndo: true,
      timestamp: Date.now()
    }));

    // Dispatch async action for API call (simulated)
    try {
      await dispatch(moderateContent({ 
        contentIds: selectedPosts, 
        action 
      })).unwrap();
    } catch (error) {
      console.error('Batch moderation failed:', error);
      // Could add error handling/rollback here
    }
  };

  // Handle undo action
  const handleUndo = () => {
    dispatch(undoLastAction());
    dispatch(setToastMessage({
      id: Date.now(),
      message: 'Action undone successfully',
      type: 'info',
      showUndo: false,
      timestamp: Date.now()
    }));
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    dispatch(setFilters({ [filterType]: value }));
  };

  // Handle sort order change
  const handleSortChange = (newSortOrder) => {
    dispatch(setSortOrder(newSortOrder));
  };

  // Handle pagination
  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  const handlePageSizeChange = (size) => {
    dispatch(setPageSize(size));
  };

  // Handle content selection
  const handleContentSelect = (content) => {
    dispatch(setSelectedContent(content));
    setIsSidebarOpen(false); // Close sidebar on mobile when content is selected
  };

  // Handle sidebar toggle
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Handle post selection for batch operations
  const handlePostSelection = (postId, isSelected) => {
    dispatch(togglePostSelection(postId));
  };

  // Handle select all posts
  const handleSelectAll = (isSelected) => {
    dispatch(selectAllPosts(isSelected));
  };

  // Navigate between posts in modal
  const handleNavigatePost = (direction) => {
    if (!selectedContent) return;
    
    const currentIndex = contentItems.findIndex(item => item.id === selectedContent.id);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = currentIndex + 1 >= contentItems.length ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex - 1 < 0 ? contentItems.length - 1 : currentIndex - 1;
    }
    
    dispatch(setSelectedContent(contentItems[newIndex]));
  };

  // Handle toast dismiss
  const handleToastDismiss = () => {
    dispatch(clearToastMessage());
  };

  return (
    <div className="app">
      <Header 
        onToggleSidebar={toggleSidebar}
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      
      <div className="app-body">
        <Sidebar 
          isOpen={isSidebarOpen}
          contentItems={allFilteredItems}
          selectedContent={selectedContent}
          onContentSelect={handleContentSelect}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        
        <main className="main-content">
          <div className="content-area">
            <ContentList 
              contentItems={contentItems}
              selectedContent={selectedContent}
              selectedPosts={selectedPosts}
              sortOrder={sortOrder}
              loading={loading}
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={pageSize}
              onContentSelect={handleContentSelect}
              onModerationAction={handleModerationAction}
              onBatchModerationAction={handleBatchModerationAction}
              onPostSelection={handlePostSelection}
              onSelectAll={handleSelectAll}
              onSortChange={handleSortChange}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
            
            {selectedContent && (
              <ContentPreview 
                content={selectedContent}
                onModerationAction={handleModerationAction}
                onClose={() => dispatch(setSelectedContent(null))}
                onNavigate={handleNavigatePost}
                currentIndex={contentItems.findIndex(item => item.id === selectedContent.id)}
                totalCount={contentItems.length}
              />
            )}
          </div>
        </main>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <Toast
          message={toastMessage.message}
          type={toastMessage.type}
          showUndo={toastMessage.showUndo}
          onUndo={handleUndo}
          onDismiss={handleToastDismiss}
        />
      )}

      {/* Error Display */}
      {error && (
        <div className="error-banner">
          <span>Error: {error}</span>
          <button onClick={() => dispatch(clearError())}>Dismiss</button>
        </div>
      )}
    </div>
  );
}

export default App; 