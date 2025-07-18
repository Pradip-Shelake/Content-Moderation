export const sampleContent = [
  {
    id: 1,
    type: 'text',
    content: 'Just had the most amazing day at the beach! The sunset was absolutely breathtaking 🌅',
    author: {
      name: 'Sarah Johnson',
      username: 'sarah_j',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=3b82f6&color=fff'
    },
    timestamp: '2024-01-15T14:30:00Z',
    status: 'pending',
    priority: 'low',
    reportReason: null,
    reportCount: 0,
    category: 'general'
  },
  {
    id: 2,
    type: 'image',
    content: 'Check out this incredible street art I found downtown!',
    imageUrl: 'https://picsum.photos/300/200?random=1',
    author: {
      name: 'Mike Chen',
      username: 'mike_artist',
      avatar: 'https://ui-avatars.com/api/?name=Mike+Chen&background=10b981&color=fff'
    },
    timestamp: '2024-01-15T13:45:00Z',
    status: 'approved',
    priority: 'low',
    reportReason: null,
    reportCount: 0,
    category: 'art'
  },
  {
    id: 3,
    type: 'text',
    content: 'This is completely inappropriate content that should be flagged for harassment and hate speech.',
    author: {
      name: 'Anonymous User',
      username: 'anon123',
      avatar: 'https://ui-avatars.com/api/?name=Anonymous+User&background=6b7280&color=fff'
    },
    timestamp: '2024-01-15T12:20:00Z',
    status: 'flagged',
    priority: 'high',
    reportReason: 'Hate speech',
    reportCount: 5,
    category: 'violation'
  },
  {
    id: 4,
    type: 'video',
    content: 'My cat doing the funniest thing ever! 😸',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    author: {
      name: 'Emma Wilson',
      username: 'cat_lover_em',
      avatar: 'https://ui-avatars.com/api/?name=Emma+Wilson&background=f59e0b&color=fff'
    },
    timestamp: '2024-01-15T11:15:00Z',
    status: 'pending',
    priority: 'low',
    reportReason: null,
    reportCount: 0,
    category: 'entertainment'
  },
  {
    id: 5,
    type: 'text',
    content: 'Spam content with links to suspicious websites. Click here for amazing deals!',
    author: {
      name: 'Spammer Bot',
      username: 'deals_bot',
      avatar: 'https://ui-avatars.com/api/?name=Spammer+Bot&background=ef4444&color=fff'
    },
    timestamp: '2024-01-15T10:30:00Z',
    status: 'rejected',
    priority: 'medium',
    reportReason: 'Spam',
    reportCount: 3,
    category: 'spam'
  },
  {
    id: 6,
    type: 'text',
    content: 'Looking for advice on the best hiking trails in the area. Any recommendations?',
    author: {
      name: 'Alex Rodriguez',
      username: 'hiker_alex',
      avatar: 'https://ui-avatars.com/api/?name=Alex+Rodriguez&background=8b5cf6&color=fff'
    },
    timestamp: '2024-01-15T09:45:00Z',
    status: 'approved',
    priority: 'low',
    reportReason: null,
    reportCount: 0,
    category: 'discussion'
  },
  {
    id: 7,
    type: 'image',
    content: 'New product launch announcement!',
    imageUrl: 'https://picsum.photos/300/200?random=2',
    author: {
      name: 'TechCorp Inc',
      username: 'techcorp_official',
      avatar: 'https://ui-avatars.com/api/?name=TechCorp+Inc&background=06b6d4&color=fff'
    },
    timestamp: '2024-01-15T08:20:00Z',
    status: 'pending',
    priority: 'medium',
    reportReason: null,
    reportCount: 0,
    category: 'business'
  },
  {
    id: 8,
    type: 'text',
    content: 'Inappropriate content that violates community guidelines regarding explicit material.',
    author: {
      name: 'Problem User',
      username: 'problematic_user',
      avatar: 'https://ui-avatars.com/api/?name=Problem+User&background=dc2626&color=fff'
    },
    timestamp: '2024-01-15T07:10:00Z',
    status: 'flagged',
    priority: 'high',
    reportReason: 'Inappropriate content',
    reportCount: 8,
    category: 'violation'
  }
];

export const moderationStats = {
  total: 156,
  pending: 23,
  approved: 89,
  rejected: 28,
  flagged: 16
};

export const categories = [
  'all',
  'general',
  'art',
  'entertainment',
  'discussion',
  'business',
  'spam',
  'violation'
];

export const priorityLevels = [
  'all',
  'low',
  'medium',
  'high'
];

export const statusOptions = [
  'all',
  'pending',
  'approved',
  'rejected',
  'flagged'
]; 