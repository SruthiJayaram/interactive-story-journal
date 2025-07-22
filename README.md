# AI Interactive Storybook

## Overview

This is a fully functional React-based 3D interactive storybook application titled "AI Interactive Storybook – A Journey Through Choices". The app combines storytelling with immersive 3D environments, featuring a full-stack architecture with Express backend and React Three Fiber frontend for 3D rendering. Users navigate through story pages by making choices that affect the narrative path while experiencing visually rich 3D scenes with animated characters, ambient sound, and multiple branching storylines leading to different endings.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a monorepo structure with clear separation between client and server code:

- **Frontend**: React 18 with TypeScript, React Three Fiber for 3D graphics
- **Backend**: Express.js server with TypeScript 
- **Database**: PostgreSQL with Drizzle ORM (configured but not actively used)
- **Build System**: Vite for client bundling, ESBuild for server
- **Styling**: Tailwind CSS with shadcn/ui components

## Key Components

### Frontend Architecture
- **3D Rendering**: React Three Fiber with Three.js for WebGL scenes
- **State Management**: Zustand stores for game state, audio, and storybook navigation  
- **UI Framework**: Radix UI primitives with Tailwind CSS styling
- **Component Structure**: 
  - `StoryScene` - Main 3D scene orchestrator
  - Environment components (Forest, Cave, Castle scenes)
  - Interactive 3D elements (Character, ChoiceButton, NarrationText)
  - shadcn/ui components for traditional UI elements

### Backend Architecture
- **Server Framework**: Express.js with TypeScript
- **Database Layer**: Drizzle ORM with PostgreSQL support
- **Storage Interface**: Abstracted storage layer with in-memory implementation
- **Development Setup**: Vite integration for hot module replacement

### State Management
Three main Zustand stores handle application state:
- **useStorybook**: Story navigation, page management, choice history
- **useAudio**: Sound effects and background music control
- **useGame**: Game phase management (ready/playing/ended)

## Data Flow

1. **Story Loading**: JSON story data loaded into Zustand store on app initialization
2. **Scene Rendering**: Current page data drives 3D scene selection and character positioning
3. **User Interaction**: 3D choice buttons trigger state changes via Zustand actions
4. **Navigation**: Story progression handled through page ID navigation system
5. **Audio Management**: Centralized audio control with mute/unmute functionality

The app uses a choice-driven narrative structure where each story page contains:
- Scene environment type (forest/cave/castle)
- Character positioning and animation state
- Narrative text and title
- Available choices linking to next pages

## External Dependencies

### Key Frontend Libraries
- **@react-three/fiber**: Core React Three.js renderer
- **@react-three/drei**: Three.js helpers and abstractions
- **@tanstack/react-query**: Server state management (configured but unused)
- **Radix UI**: Accessible component primitives
- **Zustand**: Lightweight state management
- **Tailwind CSS**: Utility-first styling

### Backend Dependencies  
- **Express.js**: Web application framework
- **Drizzle ORM**: Type-safe database toolkit
- **@neondatabase/serverless**: PostgreSQL driver

### Development Tools
- **Vite**: Build tool and dev server
- **TypeScript**: Static type checking
- **ESBuild**: Server bundling

## Deployment Strategy

The application is configured for Node.js deployment with:

- **Production Build**: `npm run build` creates optimized client bundle and server executable
- **Development Mode**: Vite dev server with Express integration for hot reloading
- **Database Setup**: Drizzle migrations ready for PostgreSQL deployment
- **Asset Handling**: Support for 3D models (.gltf, .glb) and audio files
- **Environment Variables**: Database URL configuration through environment

The build process:
1. Vite builds the React client to `dist/public`
2. ESBuild bundles the Express server to `dist/index.js`
3. Static assets served from built client directory
4. Database migrations can be applied with `npm run db:push`

The architecture supports both development and production environments with appropriate tooling for each context.

## Recent Changes (January 22, 2025)

### Major Features Implemented:
- **Complete Interactive Story System**: 12+ story pages with branching narratives and multiple endings
- **3D Environment Rendering**: Three distinct scenes (forest, cave, castle) with animated backgrounds
- **Character Animation System**: Animated 3D character with different poses (idle, walking, talking) that moves between story scenes
- **Interactive Choice Buttons**: Bright green 3D buttons with hover effects and click interactions
- **Audio System**: Background music and narration sounds with mute/unmute functionality
- **User Interface**: Clear status indicators, instructions, and restart functionality
- **Visual Effects**: Floating text, glowing buttons, animated environments, and atmospheric lighting

### Technical Improvements:
- Fixed font loading issues that prevented 3D text rendering
- Enhanced button visibility with brighter colors and better positioning
- Implemented character position updates between story scenes  
- Added comprehensive debug logging for troubleshooting
- Integrated audio context for modern browser compatibility
- Optimized 3D scene performance with proper lighting and fog effects

### User Experience:
- Intuitive mouse-click interactions with visual feedback
- Clear instructions and status indicators
- Smooth transitions between story scenes
- Audio feedback during narration
- Easy story restart functionality
- Responsive 3D environments with animated elements

The application now provides a complete interactive storytelling experience with full 3D immersion, working audio, animated characters, and a compelling branching narrative structure.