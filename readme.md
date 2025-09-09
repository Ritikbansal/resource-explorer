# Pokemon Resource Explorer

A modern React/Next.js application that lets users explore Pokemon data from the PokéAPI. Features include search, filtering, sorting, favorites management, and detailed Pokemon views with stats and abilities.

## 🚀 Live Demo

**Hosted Preview:** [https://resource.ritik.fyi](https://resource.ritik.fyi)

**GitHub Repository:** [https://github.com/Ritikbansal/resource-explorer](https://github.com/Ritikbansal/resource-explorer)

## ✨ Features

- **Pokemon List View** - Browse Pokemon with pagination and responsive card layout
- **Advanced Search & Filtering** - Search by name, filter by type, sort by various criteria
- **Detailed Pokemon View** - View stats, abilities, types, height, and weight
- **Favorites System** - Save favorite Pokemon with localStorage persistence
- **Theme Toggle** - Light/dark mode with persistent preference
- **Optimistic UI** - Instant feedback for favorite toggles
- **Error Handling** - Graceful error states with retry functionality
- **Loading States** - Skeleton loaders and proper loading indicators
- **Responsive Design** - Mobile-first design that works on all devices

## 🛠️ How to Run

### Prerequisites

- Node.js 18+ 
- npm or yarn or pnpm (preffered)

### Installation

1. Clone the repository:
git clone https://github.com/Ritikbansal/resource-explorer.git
cd resource-explorer

2. Install dependencies:
npm install
# or
yarn install

3. Run the development server:
npm run dev
# or
yarn dev

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

npm run build
npm start

## 🏗️ Architecture & Trade-offs

### Technology Stack

- **Next.js 14** - React framework with App Router for file-based routing
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **shadcn/ui** - High-quality, accessible UI components
- **PokéAPI** - RESTful API for Pokemon data (no authentication required)

### Key Architectural Decisions

#### 1. **Client-Side Data Fetching**
- **Choice:** Used native `fetch` with client-side state management
- **Trade-off:** Simpler implementation vs. advanced caching/synchronization
- **Rationale:** For this scope, client-side fetching provides adequate performance while keeping the codebase simple

#### 2. **Component Structure**
- **Choice:** Modular component architecture with clear separation of concerns
- **Trade-off:** More files vs. easier maintenance and testing
- **Rationale:** Improves code reusability and makes the app easier to extend

#### 3. **State Management**
- **Choice:** React hooks + localStorage for favorites, URL state for filters
- **Trade-off:** No global state library vs. simpler mental model
- **Rationale:** The app's state requirements are straightforward enough that React's built-in state management suffices

#### 4. **Styling Approach**
- **Choice:** Tailwind CSS with design tokens
- **Trade-off:** Utility classes vs. component-scoped CSS
- **Rationale:** Faster development, consistent design system, and smaller bundle size

#### 5. **Error Handling Strategy**
- **Choice:** Custom error classes with user-friendly error boundaries
- **Trade-off:** More boilerplate vs. better user experience
- **Rationale:** Provides clear feedback to users and helps with debugging

### Performance Considerations

- **Image Optimization:** Next.js automatic image optimization for Pokemon sprites
- **Debounced Search:** 300ms debounce to reduce API calls during typing
- **Pagination:** Limits data fetching to manageable chunks
- **Optimistic UI:** Immediate feedback for user interactions

## 🚧 What I'd Ship Next

If I had more time, here's what I would prioritize:

### High Priority
1. **React Query Integration** - Better caching, background refetch, and offline support
2. **Advanced Filtering** - Filter by stats ranges, abilities, and generation
3. **Pokemon Comparison** - Side-by-side stat comparison feature

### Nice to Have
9. **E2E Testing** - Playwright tests for critical user flows
10. **Analytics** - Track user behavior and popular Pokemon
11. **Social Features** - Share favorite Pokemon lists
12. **Accessibility Improvements** - Enhanced keyboard navigation and screen reader support

### Why This Priority Order?

- **React Query** would significantly improve the user experience with better caching and offline support
- **Virtualization** becomes critical as the dataset grows beyond the current ~1000 Pokemon
- **Advanced filtering** addresses the most common user need for finding specific Pokemon
- **Code splitting** improves initial load time, which affects user retention

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 🙏 Acknowledgments

- [PokéAPI](https://pokeapi.co/) for providing the Pokemon data
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Render](https://render.com/) for hosting and deployment
