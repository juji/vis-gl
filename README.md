# vis.gl Experiments

A comprehensive collection of Google Maps examples and experiments using [vis.gl/react-google-maps](https://visgl.github.io/react-google-maps/), built with Next.js 15.

🌐 **Live Demo:** [https://visgl.jujiplay.com/](https://visgl.jujiplay.com/)

![Next.js](https://img.shields.io/badge/Next.js-15.5-black) ![React](https://img.shields.io/badge/React-19.1-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## 🗺️ Live Examples

This project demonstrates various Google Maps integration patterns:

### Basic Examples
- **Simple Map** - Basic map implementation with minimal configuration
- **Tracking Changes** - Monitor and respond to map state changes

### UI Customization
- **Default UI** - Using Google Maps default UI controls
- **UI Placement** - Custom positioning of map controls
- **Custom UI** - Building completely custom map controls

### Markers
- **Simple Marker** - Basic marker implementation
- **Advanced Marker** - Enhanced markers with custom styling and behavior

### Advanced Features
- **Clustering** - Marker clustering with Supercluster
- **Drawing** - Interactive drawing tools (circles, lines, polygons, rectangles)
- **Themes** - Custom map styling and themes
- **Autocomplete** - Google Places Autocomplete integration

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ (recommended)
- pnpm (recommended package manager)
- Google Maps API Key

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the examples.

### Environment Variables

Create a `.env.local` file with your Google Maps API key:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

## 📦 Tech Stack

### Core Dependencies
- **Next.js 15.5** - React framework with App Router
- **React 19.1** - UI library
- **TypeScript 5** - Type safety
- **@vis.gl/react-google-maps 1.5.5** - Google Maps React components

### Additional Libraries
- **Supercluster** - Fast marker clustering
- **usehooks-ts** - Reusable React hooks
- **Serwist** - PWA support (Service Worker)
- **sanitize.css** - CSS normalization

### Developer Tools
- **Biome** - Fast formatter and linter (replaces ESLint + Prettier)
- **Husky** - Git hooks
- **lint-staged** - Pre-commit linting
- **Turbopack** - Next.js dev server bundler

## 🛠️ Available Scripts

```bash
pnpm dev          # Start development server with Turbopack
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Lint and fix code with Biome
pnpm format       # Format code with Biome
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page (Simple Map)
│   ├── clustering/        # Marker clustering example
│   ├── drawing/           # Drawing tools example
│   ├── autocomplete/      # Places autocomplete example
│   ├── themes/            # Map theming example
│   └── ...                # Other examples
├── components/            # Reusable React components
│   ├── sidebar/          # Navigation sidebar
│   ├── autocomplete/     # Autocomplete component
│   ├── joystick/         # Joystick control
│   ├── icon-buttons/     # Drawing tool buttons
│   └── maps/             # Map components
└── api/                  # API routes
```

## 🎨 Code Conventions

This project follows specific conventions outlined in [AGENTS.md](AGENTS.md):

- **File naming**: lowercase kebab-case for all files
- **Component structure**: Each component in its own directory with `index.tsx` and `styles.module.css`
- **CSS Modules**: Scoped styling for all components
- **TypeScript**: Strict type checking with interfaces for all props

## 🌐 Deployment

The project includes deployment configurations for:

- **Vercel** - Zero-config deployment (recommended)
- **Netlify** - Via `_headers` in public directory
- **CloudFlare Pages** - Static deployment

### CORS Headers
Proper CORS headers are configured for API routes and static assets across all platforms.

### PWA Support
Progressive Web App features enabled via Serwist for offline capability and app-like experience.

## 📝 License

This project is for learning and educational purposes.

## 🔗 Resources

- [vis.gl React Google Maps Documentation](https://visgl.github.io/react-google-maps/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [Supercluster Documentation](https://github.com/mapbox/supercluster)

