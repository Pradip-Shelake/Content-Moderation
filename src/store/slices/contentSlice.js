import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { sampleContent } from '../../data/sampleData';

// Simulate API delay for loading states
const simulateApiDelay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

// Generate more sample data for pagination demonstration
const generateMoreContent = (baseContent, multiplier = 10) => {
  const expandedContent = [];
  for (let i = 0; i < multiplier; i++) {
    baseContent.forEach((item, index) => {
      expandedContent.push({
        ...item,
        id: item.id + (i * baseContent.length),
        content: `${item.content} (Copy ${i + 1})`,
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        author: {
          ...item.author,
          name: `${item.author.name} ${i + 1}`,
          username: `${item.author.username}_${i + 1}`
        }
      });
    });
  }
  return expandedContent;
};

const allContent = generateMoreContent(sampleContent, 12); // 96 total items

// Async thunk for fetching content with pagination
export const fetchContent = createAsyncThunk(
  'content/fetchContent',
  async ({ page, pageSize, filters, sortOrder }) => {
    await simulateApiDelay();
    
    // Apply filters
    let filtered = allContent.filter(item => {
      const matchesStatus = filters.status === 'all' || item.status === filters.status;
      const matchesPriority = filters.priority === 'all' || item.priority === filters.priority;
      const matchesCategory = filters.category === 'all' || item.category === filters.category;
      const matchesSearch = filters.search === '' || 
        item.content.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.author.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.author.username.toLowerCase().includes(filters.search.toLowerCase());
      
      return matchesStatus && matchesPriority && matchesCategory && matchesSearch;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortOrder) {
        case 'newest':
          return new Date(b.timestamp) - new Date(a.timestamp);
        case 'oldest':
          return new Date(a.timestamp) - new Date(b.timestamp);
        case 'priority':
          const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
          const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
          if (priorityDiff === 0) {
            return new Date(b.timestamp) - new Date(a.timestamp);
          }
          return priorityDiff;
        default:
          return 0;
      }
    });

    // Apply pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedContent = filtered.slice(startIndex, endIndex);

    return {
      content: paginatedContent,
      totalItems: filtered.length,
      totalPages: Math.ceil(filtered.length / pageSize),
      currentPage: page,
      pageSize
    };
  }
);

// Async thunk for moderation actions
export const moderateContent = createAsyncThunk(
  'content/moderateContent',
  async ({ contentIds, action, reason = null }) => {
    await simulateApiDelay(300);
    return { contentIds, action, reason };
  }
);

const initialState = {
  // Content data
  items: [],
  allItems: allContent,
  
  // Pagination
  currentPage: 1,
  pageSize: 12,
  totalItems: 0,
  totalPages: 0,
  
  // Filters and sorting
  filters: {
    status: 'all',
    priority: 'all',
    category: 'all',
    search: ''
  },
  sortOrder: 'newest',
  
  // UI state
  loading: false,
  error: null,
  selectedContent: null,
  selectedPosts: [],
  
  // Undo functionality
  undoStack: [],
  toastMessage: null,
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    // Pagination actions
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
      state.currentPage = 1; // Reset to first page when changing page size
    },
    
    // Filter actions
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1; // Reset to first page when filtering
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
      state.currentPage = 1; // Reset to first page when sorting
    },
    
    // Selection actions
    setSelectedContent: (state, action) => {
      state.selectedContent = action.payload;
    },
    setSelectedPosts: (state, action) => {
      state.selectedPosts = action.payload;
    },
    togglePostSelection: (state, action) => {
      const postId = action.payload;
      const index = state.selectedPosts.indexOf(postId);
      if (index > -1) {
        state.selectedPosts.splice(index, 1);
      } else {
        state.selectedPosts.push(postId);
      }
    },
    selectAllPosts: (state, action) => {
      state.selectedPosts = action.payload ? state.items.map(item => item.id) : [];
    },
    
    // Direct moderation actions (for immediate UI updates)
    updateContentStatus: (state, action) => {
      const { contentIds, action: newAction, reason } = action.payload;
      
      // Store previous states for undo
      const previousStates = contentIds.map(id => {
        const item = state.allItems.find(item => item.id === id);
        return {
          contentId: id,
          previousStatus: item ? item.status : 'pending'
        };
      });

      const undoAction = {
        type: contentIds.length === 1 ? 'single' : 'batch',
        contentIds,
        changes: previousStates,
        newStatus: newAction,
        timestamp: Date.now()
      };

      // Add to undo stack (keep only last 10)
      state.undoStack.unshift(undoAction);
      state.undoStack = state.undoStack.slice(0, 10);
      
      // Update content in allItems
      state.allItems = state.allItems.map(item => 
        contentIds.includes(item.id)
          ? { ...item, status: newAction, timestamp: new Date().toISOString(), reason }
          : item
      );
      
      // Update current page items
      state.items = state.items.map(item => 
        contentIds.includes(item.id)
          ? { ...item, status: newAction, timestamp: new Date().toISOString(), reason }
          : item
      );
      
      // Update selected content if needed
      if (state.selectedContent && contentIds.includes(state.selectedContent.id)) {
        state.selectedContent = { ...state.selectedContent, status: newAction };
      }
      
      // Clear selection after batch operations
      if (contentIds.length > 1) {
        state.selectedPosts = [];
      }
    },
    
    // Undo actions
    undoLastAction: (state) => {
      if (state.undoStack.length === 0) return;
      
      const lastAction = state.undoStack[0];
      
      // Restore previous states
      lastAction.changes.forEach(change => {
        // Update in allItems
        const allItemIndex = state.allItems.findIndex(item => item.id === change.contentId);
        if (allItemIndex !== -1) {
          state.allItems[allItemIndex].status = change.previousStatus;
        }
        
        // Update in current page items
        const currentItemIndex = state.items.findIndex(item => item.id === change.contentId);
        if (currentItemIndex !== -1) {
          state.items[currentItemIndex].status = change.previousStatus;
        }
        
        // Update selected content if needed
        if (state.selectedContent && state.selectedContent.id === change.contentId) {
          state.selectedContent.status = change.previousStatus;
        }
      });
      
      // Remove the undone action from stack
      state.undoStack.shift();
    },
    
    // Toast actions
    setToastMessage: (state, action) => {
      state.toastMessage = action.payload;
    },
    clearToastMessage: (state) => {
      state.toastMessage = null;
    },
    
    // Error handling
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch content
      .addCase(fetchContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContent.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.content;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(fetchContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Moderate content
      .addCase(moderateContent.pending, (state) => {
        // Keep current state during moderation API call
      })
      .addCase(moderateContent.fulfilled, (state, action) => {
        // Content already updated by updateContentStatus reducer
      })
      .addCase(moderateContent.rejected, (state, action) => {
        state.error = action.error.message;
      });
  }
});

export const {
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
} = contentSlice.actions;

export default contentSlice.reducer; 