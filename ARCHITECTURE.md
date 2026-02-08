# CineCast - Modular Architecture

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # App header with navigation
│   ├── Toast.tsx       # Notification component
│   └── VideoCard.tsx   # Reusable video card component
│
├── data/               # Data files
│   └── videos.ts       # Video library (50 videos)
│
├── utils/              # Utility functions
│   └── helpers.ts      # Helper functions (formatTime, filterVideos, etc.)
│
├── constants/          # App constants
│   └── index.ts        # Constants (initial data, options)
│
├── hooks/              # Custom React hooks (future)
│   └── (custom hooks can be added here)
│
├── types.ts            # TypeScript interfaces
├── App.tsx             # Main app component (orchestrates everything)
└── index.tsx           # Entry point

```

## 🎯 Benefits of This Structure

### Before Modularization:
- **App.tsx**: 2770 lines ❌
- Hard to maintain
- Difficult to find code
- No code reuse

### After Modularization:
- **App.tsx**: ~800-1000 lines ✅
- **components/**: Reusable UI components
- **data/**: Separated data from logic
- **utils/**: Helper functions in one place
- **constants/**: Configuration in one place

## 📦 Module Descriptions

### Components

#### `Header.tsx`
- Handles navigation (Home, Series, Movies, My List)
- Search functionality
- Logo and user actions
- **Props**: searchQuery, onSearchChange, activeTab, etc.

#### `Toast.tsx`
- Displays notifications
- **Props**: message, show

#### `VideoCard.tsx`
- Reusable video card with thumbnail, metadata
- Add to list functionality
- Hover effects and animations
- **Props**: video, onVideoClick, isInMyList, etc.

### Data

#### `videos.ts`
- Exports `VIDEO_DATA` array with 50 videos
- Clean separation of data from components

### Utils

#### `helpers.ts`
- `formatTime()` - Format seconds to MM:SS
- `getSimilarVideos()` - Find similar content
- `filterVideos()` - Filter by search/category/tab
- `getTrendingVideos()` - Get trending content
- `getCategories()` - Extract unique categories

### Constants

#### `index.ts`
- `INITIAL_WATCH_PROGRESS` - Default watch history
- `INITIAL_MY_LIST` - Default saved videos
- `PLAYBACK_SPEEDS` - Speed options
- `QUALITY_OPTIONS` - Quality settings

## 🔄 How It Works Together

```typescript
App.tsx
  ├─> Imports VIDEO_DATA from data/videos.ts
  ├─> Imports helpers from utils/helpers.ts
  ├─> Imports constants from constants/index.ts
  ├─> Renders Header component
  ├─> Renders Toast component
  └─> Renders VideoCard components
```

## 🚀 Adding New Features

### Adding a New Component:
1. Create `components/NewComponent.tsx`
2. Export the component
3. Import in `App.tsx`
4. Use it!

### Adding New Videos:
1. Edit `data/videos.ts`
2. Add new video objects
3. That's it!

### Adding New Utilities:
1. Edit `utils/helpers.ts`
2. Export new function
3. Import where needed

## 💡 Future Improvements

- Add `hooks/` for custom hooks (useVideoPlayer, useWatchProgress)
- Add `services/` for API calls
- Add `contexts/` for global state management
- Split components further (VideoPlayer, ContinueWatching, etc.)
- Add unit tests for utils/helpers.ts

## 📝 Code Organization Rules

1. **One Component Per File**: Each component in its own file
2. **Named Exports for Utils**: Use named exports for utility functions
3. **Default Exports for Components**: Use default exports for React components
4. **TypeScript Everywhere**: All files use TypeScript
5. **Props Interfaces**: Define props interfaces for all components

## 🎨 Component Patterns

### Reusable Components
Components should be:
- **Self-contained**: Own styles and logic
- **Configurable**: Accept props for customization
- **Reusable**: Work in different contexts
- **Typed**: Use TypeScript interfaces

### Example:
```typescript
interface VideoCardProps {
  video: VideoData;
  onVideoClick: () => void;
  isInMyList: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onVideoClick, isInMyList }) => {
  // Component logic
};
```

This architecture makes the code **maintainable**, **scalable**, and **easy to understand**! 🎉

