# Content Moderation Dashboard

A responsive web application for content moderators to efficiently review user-submitted content and take appropriate moderation actions.

## Features

### 🔍 Content Review
- **List View**: Compact list of all content items with key information
- **Detailed Preview**: Full content display with media support
- **Quick Actions**: Approve/reject directly from the list view
- **Status Indicators**: Visual status badges for pending, approved, rejected, and flagged content

### 📱 Responsive Design
- **Mobile-First**: Optimized for mobile devices with touch-friendly interface
- **Tablet Support**: Adaptive layout for tablet screens
- **Desktop**: Full-featured experience with sidebar navigation
- **Cross-Browser**: Compatible with modern browsers

### 🎛️ Advanced Filtering & Sorting
- **Status Filter**: Filter by approval status (pending, approved, rejected, flagged)
- **Priority Filter**: Filter by priority level (high, medium, low)
- **Category Filter**: Filter by content category
- **Real-time Search**: Search through content and user information
- **Quick Actions**: One-click access to flagged and high-priority content
- **Smart Sorting**: Sort by newest, oldest, or priority level

### 👤 User Management
- **Author Information**: Complete user profiles with avatars
- **Report System**: Track user reports and reasons
- **Content History**: View content submission timestamps

### 🛠️ Moderation Tools
- **Individual Actions**: Approve, reject, or flag individual posts
- **Bulk Actions**: Efficient batch moderation for multiple posts
- **Reason Tracking**: Mandatory reasons for rejections and flags
- **Priority Management**: Visual priority indicators
- **Statistics Dashboard**: Real-time moderation statistics
- **Modal Navigation**: Browse between posts without closing the preview

### ↩️ Undo Functionality *(NEW)*
- **Toast Notifications**: Instant feedback after moderation actions
- **Undo Button**: Revert recent actions within a 5-second window
- **Visual Progress**: Progress bar showing time remaining for undo
- **Batch Undo**: Support for undoing both single and batch operations
- **Smart Recovery**: Restores previous status and maintains data integrity
- **Auto-dismiss**: Notifications automatically disappear after timeout

### ☑️ Batch Operations
- **Checkbox Selection**: Select multiple posts for bulk actions
- **Select All**: One-click selection of all visible posts
- **Batch Actions**: Approve, reject, or flag multiple posts simultaneously
- **Selection Counter**: Clear indication of selected items count
- **Smart Interface**: Batch controls only appear when posts are selected

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## Usage

### Navigation
- **Header**: Contains search functionality and user profile
- **Sidebar**: Filters, statistics, and quick actions (desktop)
- **Main Content**: List view and detailed preview
- **Mobile Menu**: Hamburger menu for mobile navigation

### Content Moderation Workflow

1. **Review Content**
   - Browse content list or use filters to find specific items
   - Click on content items to view detailed information
   - Review media content (images, videos)
   - Check user reports and reasons

2. **Take Action**
   - **Approve**: Mark content as approved for publication
   - **Reject**: Remove content (requires reason)
   - **Flag**: Mark for further review (requires reason)
   - **Reset**: Return to pending status

3. **Undo Actions** *(NEW)*
   - **Instant Undo**: Click "Undo" in toast notification within 5 seconds
   - **Visual Feedback**: Progress bar shows time remaining
   - **Batch Support**: Undo works for both single and batch operations
   - **Smart Recovery**: Previous status is automatically restored

4. **Batch Operations**
   - **Select Posts**: Use checkboxes to select multiple posts
   - **Bulk Actions**: Apply actions to all selected posts at once
   - **Select All**: Quickly select all visible posts
   - **Batch Undo**: Undo entire batch operations

5. **Track Progress**
   - Monitor statistics in the sidebar
   - Use filters to focus on specific content types
   - Search for specific users or keywords

### Keyboard Shortcuts
- **Escape**: Close content preview or dismiss toast
- **Enter**: Confirm actions in forms
- **Tab**: Navigate between interactive elements

### Toast Notifications

The application provides instant feedback through toast notifications:

- **Success Actions**: Green toasts for approved/completed actions
- **Info Messages**: Blue toasts for informational updates
- **Error States**: Red toasts for errors or failures
- **Undo Option**: Available for 5 seconds after moderation actions
- **Auto-dismiss**: Notifications disappear automatically
- **Progress Bar**: Visual countdown showing time remaining

## Project Structure

```
src/
├── components/
│   ├── Header.js          # Top navigation bar
│   ├── Sidebar.js         # Filter and statistics sidebar
│   ├── ContentList.js     # Content list view with batch operations
│   ├── ContentPreview.js  # Detailed content view with navigation
│   ├── Toast.js           # Toast notification system (NEW)
│   └── *.css             # Component styles
├── data/
│   └── sampleData.js     # Sample content data
├── App.js                # Main application component with undo logic
├── App.css               # Application styles
├── index.js              # Application entry point
└── index.css             # Global styles
```

## Key Components

### Header
- Global search functionality
- User profile and notifications
- Mobile navigation toggle

### Sidebar
- Real-time statistics (dynamically calculated)
- Content filtering options
- Quick action buttons

### Content List
- Paginated content display with sorting
- Quick moderation actions
- Batch operation controls
- Status and priority indicators

### Content Preview
- Full content display with navigation
- Media support (images, videos)
- Detailed moderation actions
- User information panel

### Toast System *(NEW)*
- Non-intrusive notifications
- Undo functionality with countdown
- Multiple notification types
- Responsive design and animations

## Technologies Used

- **React 18**: Modern React with hooks and state management
- **Lucide React**: Beautiful, customizable icons
- **CSS Grid & Flexbox**: Responsive layout system
- **CSS Custom Properties**: Consistent theming
- **Media Queries**: Responsive design
- **Toast Notifications**: Custom notification system
- **Undo State Management**: Action history tracking

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Features

- **Optimized Rendering**: Efficient list virtualization
- **Smart State Management**: Minimal re-renders with useCallback
- **Responsive Images**: Optimized media display
- **CSS Optimization**: Minimal bundle size
- **Modern JavaScript**: ES6+ features
- **Memory Management**: Automatic cleanup of timers and listeners

## Customization

### Styling
- Modify CSS custom properties in `index.css`
- Component-specific styles in individual CSS files
- Responsive breakpoints defined in media queries
- Toast notification themes and timing

### Data
- Update sample data in `src/data/sampleData.js`
- Modify content categories and status options
- Add new content types as needed
- Adjust undo timeout duration (default: 5 seconds)

### Toast Configuration
- Change auto-dismiss duration (default: 5000ms)
- Modify toast position and animations
- Customize notification types and styling
- Adjust undo window timing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (especially undo functionality)
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please refer to the documentation or create an issue in the project repository.

## Changelog

### v2.0.0 - Undo Functionality Release
- ✅ Added toast notification system
- ✅ Implemented undo functionality for all moderation actions
- ✅ Added visual progress indicators for undo timing
- ✅ Enhanced batch operations with undo support
- ✅ Improved user feedback and error handling
- ✅ Added responsive toast design for mobile devices 