# RadiologyCenter Frontend

A modern, responsive frontend application for the RadiologyCenter management system built with React, Vite, and best practices.

## 🚀 Features

- **Modern React Architecture**: Built with React 18, Vite, and modern JavaScript
- **Type Safety**: Zod schemas for runtime validation
- **State Management**: TanStack Query for server state management
- **Authentication**: JWT-based authentication with automatic token refresh
- **UI Components**: Custom component library with Tailwind CSS
- **Form Handling**: React Hook Form with validation
- **Responsive Design**: Mobile-first responsive design
- **Performance**: Optimized with code splitting and lazy loading
- **Developer Experience**: Hot reload, TypeScript support, ESLint

## 🛠️ Tech Stack

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form with Zod validation
- **Routing**: React Router v6
- **HTTP Client**: Axios with interceptors
- **UI Components**: Headless UI, Lucide React icons
- **Notifications**: React Hot Toast
- **Build Tool**: Vite

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Input, etc.)
│   └── layout/         # Layout components (Header, Sidebar, etc.)
├── hooks/              # Custom React hooks
│   ├── api/           # API-specific hooks
│   └── useAuth.js     # Authentication hook
├── lib/               # Utility libraries
│   ├── api.js         # API configuration and endpoints
│   └── utils.js       # Utility functions
├── pages/             # Page components
└── App.jsx           # Main application component
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- RadiologyCenter API running on http://localhost:5103

### Installation

1. **Clone and navigate to the project**:
   ```bash
   cd radiology-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your API URL:
   ```env
   VITE_API_BASE_URL=http://localhost:5103
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:5173`

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Design System

The application uses a custom design system built on Tailwind CSS:

- **Colors**: Primary blue palette with semantic colors
- **Typography**: Inter font family with consistent sizing
- **Components**: Reusable UI components with consistent styling
- **Spacing**: 8px grid system
- **Responsive**: Mobile-first breakpoints

## 🔐 Authentication

The app uses JWT-based authentication:

- **Login**: Username/password authentication
- **Token Storage**: Supports both session and persistent storage
- **Auto Refresh**: Automatic token validation and refresh
- **Route Protection**: Protected routes with role-based access

## 📊 State Management

- **Server State**: TanStack Query for API data
- **Client State**: React hooks and context
- **Caching**: Intelligent caching with stale-while-revalidate
- **Optimistic Updates**: Immediate UI updates with rollback

## 🎯 Best Practices Implemented

### Code Organization
- **Feature-based structure** for scalability
- **Custom hooks** for reusable logic
- **Component composition** over inheritance
- **Separation of concerns** between UI and business logic

### Performance
- **Code splitting** with React.lazy()
- **Image optimization** with proper loading strategies
- **Bundle optimization** with Vite
- **Memoization** where appropriate

### Developer Experience
- **TypeScript-like validation** with Zod
- **Consistent code style** with ESLint
- **Hot module replacement** for fast development
- **Error boundaries** for graceful error handling

### Security
- **XSS protection** with proper sanitization
- **CSRF protection** with token-based auth
- **Secure token storage** with automatic cleanup
- **Input validation** on both client and server

### Accessibility
- **Semantic HTML** structure
- **ARIA labels** for screen readers
- **Keyboard navigation** support
- **Focus management** in modals and forms

## 🔌 API Integration

The frontend integrates with the RadiologyCenter API:

- **Patients Management**: CRUD operations for patient records
- **Appointments**: Scheduling and management
- **Units**: Medical unit management
- **Examinations**: Examination types and procedures
- **Authentication**: User login and session management

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Environment Variables

For production deployment, set these environment variables:

```env
VITE_API_BASE_URL=https://your-api-domain.com
VITE_APP_NAME=RadiologyCenter
VITE_DEBUG_MODE=false
VITE_ENABLE_LOGGING=false
```

## 🤝 Contributing

1. Follow the existing code style and patterns
2. Write meaningful commit messages
3. Add tests for new features
4. Update documentation as needed
5. Ensure all linting passes

## 📝 License

This project is part of the RadiologyCenter management system.