# MALABRO eSHOP - Frontend

## Project Overview

MALABRO eSHOP is a modern e-commerce platform built with Vue.js 3 and TypeScript. This frontend application provides a responsive, user-friendly interface for an African marketplace, featuring product browsing, cart management, user authentication, and comprehensive admin tools.

### Key Features
- 🛒 **E-commerce Platform**: Complete online shopping experience with cart, checkout, and order management
- 💳 **Multiple Payment Methods**: Wave and Orange Money integration for secure mobile payments
- 📦 **Minimum Order Requirement**: 12,000 CFA minimum order amount with visual progress indicator
- 🚚 **Delivery Preparation**: Admin dashboard feature for managing order preparation and delivery
- 👤 **User Management**: Registration, authentication, and profile management
- 🔐 **Admin Dashboard**: Product, category, inventory, user, order, and payment management
- 📱 **Responsive Design**: Mobile-first approach with Tailwind CSS
- 🌍 **Internationalization**: French language support with XOF (FCFA) currency
- 🎨 **Modern UI**: Built with Radix Vue components and Lucide icons
- 🚀 **Performance**: Vite for fast development and optimized builds

## Tech Stack

### Core Framework
- **Vue.js 3.4.21** - Progressive JavaScript framework with Composition API
- **TypeScript 5.4.0** - Type-safe development
- **Vite 4.5.0** - Fast build tool and development server

### State Management & Routing
- **Pinia 2.3.1** - Modern state management for Vue
- **Vue Router 4.3.0** - Client-side routing

### UI Components & Styling
- **Tailwind CSS 3.4.3** - Utility-first CSS framework
- **Radix Vue 1.8.1** - Headless UI components
- **Lucide Vue Next 0.378.0** - Modern icon library
- **Class Variance Authority 0.7.0** - Component variant management

### HTTP Client & Utilities
- **Axios 1.11.0** - HTTP client for API communication
- **@vueuse/core 13.9.0** - Vue Composition Utilities

### Development Tools
- **ESLint 8.57.0** - Code linting
- **Prettier 3.2.5** - Code formatting
- **PostCSS 8.4.38** - CSS processing
- **Autoprefixer 10.4.19** - CSS vendor prefixes

## Project Architecture

### Directory Structure
```
src/
├── assets/           # Static assets (images, styles)
├── components/       # Reusable Vue components
│   ├── admin/       # Admin-specific components
│   └── ui/          # Base UI components (shadcn-vue)
├── composables/     # Composition functions
├── lib/             # Utility functions
├── router/          # Vue Router configuration
├── services/        # API services and HTTP client
├── stores/          # Pinia stores for state management
└── views/           # Page components
    └── admin/       # Admin dashboard pages
```

### Key Components

#### State Management (Pinia Stores)
- **`auth.ts`**: Authentication and user session management
- **`cart.ts`**: Shopping cart state and operations
- **`user.ts`**: User profile and preferences

#### Services
- **`api.ts`**: Axios configuration and base API client
- **`ProductService.ts`**: Product-related API calls
- **`CategoryService.ts`**: Category management API
- **`UnitOfMeasureService.ts`**: Units of measure management
- **`DeliveryPreparationService.ts`**: Delivery preparation and order fulfillment API

#### Core Views
- **`HomeView.vue`**: Main landing page with product grid
- **`ProductDetail.vue`**: Individual product details and purchase
- **`Cart.vue`**: Shopping cart management with minimum order validation
- **`Checkout.vue`**: Multi-step checkout with Wave and Orange Money payment
- **`OrderConfirmation.vue`**: Order confirmation page with payment instructions
- **`Login.vue`** / **`Register.vue`**: User authentication
- **`UIKitView.vue`**: UI component showcase and development tool

#### Admin Dashboard
- **`AdminLayout.vue`**: Admin dashboard layout wrapper with navigation
- **`AdminOverview.vue`**: Dashboard analytics and metrics
- **`ProductManager.vue`**: Product CRUD operations
- **`CategoryManager.vue`**: Category management
- **`UnitOfMeasureManager.vue`**: Units of measure management
- **`AdminOrders.vue`**: Order management and fulfillment
- **`AdminUsers.vue`**: User account management
- **`AdminPayments.vue`**: Payment tracking and verification
- **`InventoryReports.vue`**: Stock and inventory reporting
- **`DeliveryPreparationCard.vue`**: Delivery preparation summary widget
- **`DeliveryPreparationModal.vue`**: Detailed delivery preparation interface
- **`InventoryLedgerModal.vue`**: Inventory transaction history viewer
- **`MalaIABro.vue`**: Admin component (purpose TBD)

## Development Setup

### Prerequisites
- Node.js 18+ (recommended: 18.x LTS)
- npm or yarn package manager

### Installation
```bash
# Install dependencies
npm install

# Install with legacy peer deps if needed
npm install --legacy-peer-deps
```

### Environment Configuration

#### Development
Create `.env.local` (not tracked in git):
```bash
VITE_API_URL=http://localhost:8000/api/v1
```

#### Production
Uses `.env.production`:
```bash
VITE_API_URL=https://malabro.ishopinafrica.com/api/v1
```

### Development Commands

#### Start Development Server
```bash
# Start Vite dev server with hot reload
npm run dev

# Server will run on http://localhost:5173
```

#### Build & Preview
```bash
# Type check TypeScript files
npm run type-check

# Build for production
npm run build

# Preview production build locally
npm run preview
```

#### Code Quality
```bash
# Run ESLint with auto-fix
npm run lint

# Format code with Prettier
npm run format
```

### API Integration

### Base Configuration
- **Development**: `http://localhost:8000/api/v1`
- **Production**: `https://malabro.ishopinafrica.com/api/v1`

### Authentication
- JWT-based authentication
- Tokens stored in localStorage
- Automatic header injection via Axios interceptors

### Key Endpoints
- **Auth**: `/auth/login`, `/auth/register`, `/auth/me`
- **Products**: `/products/`, `/products/{id}`
- **Categories**: `/categories/`
- **Units of Measure**: `/units-of-measure/`
- **Cart**: Client-side cart with localStorage persistence
- **Orders**: `/orders/` - Order creation and management
- **Admin Orders**: `/admin/orders/`, `/admin/orders/preparation-summary`
- **Admin Payments**: `/admin/payments/` - Payment verification
- **Admin Users**: `/admin/users/` - User management

## Deployment

### Firebase Hosting (Primary)

The application is deployed on Firebase Hosting:
- **Live URL**: https://malabroeshop.web.app
- **Project ID**: malabroeshop
- **Project Number**: 255424894390

#### Firebase Deployment Commands
```bash
# Build the application
npm run build

# Deploy to Firebase
firebase deploy --only hosting

# Initialize Firebase (if needed)
firebase init hosting
```

#### Firebase Configuration
The `firebase.json` file includes:
- **SPA Routing**: All routes redirect to `/index.html`
- **Cache Headers**: Long-term caching for static assets
- **Security Headers**: X-Frame-Options, X-XSS-Protection, etc.
- **Gzip Compression**: Automatic compression for better performance

### Docker Deployment
```bash
# Build Docker image
docker build -t malabro-frontend .

# Run container
docker run -p 80:80 malabro-frontend
```

### Production Build
```bash
# Build with production environment
npm run build

# Files generated in /dist directory
```

### Key Features
- **Multi-stage Docker build** with nginx
- **Gzip compression** for assets
- **Security headers** configuration
- **SPA routing** support with nginx
- **Health check** endpoint at `/health`

## Testing

### Test Structure
```
tests/
├── fixtures/        # Test data and fixtures
├── admin-products/  # Admin product management tests
└── test-results/    # Playwright test results
```

### Running Tests
```bash
# Run end-to-end tests (if configured)
npx playwright test

# View test reports
npx playwright show-report
```

## Key Features Deep Dive

### User Authentication
- **Registration/Login**: Email and password based
- **Session Management**: JWT tokens with automatic refresh
- **Route Guards**: Protected routes for authenticated users
- **Admin Access**: Role-based admin dashboard access

### Shopping Cart
- **Persistent Storage**: localStorage with user-specific keys
- **Real-time Updates**: Reactive cart state with Pinia
- **Stock Validation**: Prevents over-ordering
- **Guest Cart**: Anonymous cart support before login
- **Minimum Order Enforcement**: 12,000 CFA minimum order requirement with visual progress bar
- **Dynamic Validation**: Real-time validation with user-friendly error messages

### Product Management
- **Product Grid**: Responsive card layout
- **Search & Filter**: Category and search functionality
- **Stock Tracking**: Real-time inventory display
- **Image Handling**: Optimized image loading and fallbacks

### Admin Dashboard
- **User Management**: View and manage user accounts
- **Inventory Control**: Product, category, and stock management
- **Order Processing**: Order status and fulfillment tracking
- **Payment Verification**: Wave and Orange Money payment confirmation
- **Delivery Preparation**: Order preparation summary with date filtering
- **Analytics**: Sales and inventory reporting with ledger history
- **Units Management**: Configure and manage units of measure

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Breakpoint Strategy**: Tailwind CSS responsive utilities
- **Touch Friendly**: Large touch targets and gestures
- **Progressive Enhancement**: Works across all device sizes

## Configuration Files

### Build Configuration
- **`vite.config.ts`**: Vite build configuration with Vue plugin
- **`tsconfig.json`**: TypeScript compiler configuration
- **`tailwind.config.js`**: Tailwind CSS customization
- **`postcss.config.js`**: PostCSS and Autoprefixer setup

### Code Quality
- **`.eslintrc`**: ESLint rules for Vue and TypeScript
- **`prettier.config.js`**: Code formatting preferences
- **`components.json`**: shadcn-vue component configuration

## Common Development Tasks

### Adding New Components
```bash
# Create new component in appropriate directory
touch src/components/MyComponent.vue

# Add to index.ts if creating a UI component
# Follow existing naming conventions
```

### Adding New Routes
```typescript
// In src/router/index.ts
{
  path: '/new-route',
  name: 'NewRoute',
  component: () => import('../views/NewView.vue'),
  meta: { requiresAuth: true } // if authentication required
}
```

### State Management
```typescript
// Create new store in src/stores/
export const useMyStore = defineStore('myStore', () => {
  const state = ref(initialState)
  const getter = computed(() => derivedValue)
  const action = () => { /* state mutation */ }
  
  return { state, getter, action }
})
```

### API Service Integration
```typescript
// In src/services/MyService.ts
import apiClient from './api'

class MyService {
  async getData() {
    return apiClient.get('/my-endpoint').then(response => response.data)
  }
}

export default new MyService()
```

## Performance Considerations

### Optimization Strategies
- **Code Splitting**: Lazy loading for routes and components
- **Image Optimization**: WebP format with fallbacks
- **Bundle Analysis**: Regular bundle size monitoring
- **Caching**: Aggressive caching for static assets

### Best Practices
- **Component Composition**: Reusable component patterns
- **Type Safety**: Comprehensive TypeScript usage
- **Error Handling**: Graceful error states and recovery
- **Accessibility**: ARIA labels and keyboard navigation

## Troubleshooting

### Common Issues

#### Module Resolution
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Build Errors
```bash
# Type check issues
npm run type-check

# Clear Vite cache
rm -rf node_modules/.vite
```

#### API Connection
```bash
# Check environment variables
echo $VITE_API_URL

# Verify backend is running
curl http://localhost:8000/api/v1/health

# Verify production backend
curl https://malabro.ishopinafrica.com/api/v1/products/
```

## Contributing

### Development Workflow
1. Create feature branch from `main`
2. Make changes with proper TypeScript types
3. Run linting and formatting: `npm run lint && npm run format`
4. Test changes thoroughly
5. Submit pull request with description

### Code Style
- Use Composition API for new components
- Follow existing component patterns
- Write comprehensive TypeScript interfaces
- Add proper error handling and loading states
- Include responsive design considerations

---

## Recent Updates (Latest Commit: October 8, 2025)

### Recent Features Added
1. **Delivery Preparation Feature** (Oct 6, 2025)
   - Admin dashboard widget for order preparation
   - Date-filtered preparation summary
   - Delivery management interface

2. **Minimum Order Requirement** (Oct 4, 2025)
   - 12,000 CFA minimum order enforcement
   - Visual progress indicator in cart
   - User-friendly validation messages

3. **Payment Method Integration**
   - Wave mobile money payment
   - Orange Money payment option
   - Order confirmation page

4. **Backend Migration** (Oct 3, 2025)
   - Updated to trusted SSL domain: `malabro.ishopinafrica.com`

## Quick Start Checklist

- [ ] Node.js 18+ installed
- [ ] Dependencies installed with `npm install`
- [ ] Environment variables configured (.env.local for development)
- [ ] Development server running with `npm run dev`
- [ ] Backend API accessible at production URL
- [ ] Authentication working
- [ ] Cart functionality tested with minimum order validation
- [ ] Payment methods (Wave/Orange Money) accessible
- [ ] Admin dashboard accessible (if admin user)

## Useful Commands Reference

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Build for production
npm run preview                # Preview production build

# Code Quality
npm run lint                   # Run ESLint
npm run format                 # Format with Prettier
npm run type-check             # TypeScript checking

# Deployment
npm run build                  # Build for production
firebase deploy --only hosting # Deploy to Firebase
docker build -t frontend .     # Build Docker image
docker run -p 80:80 frontend   # Run container

# Maintenance
npm outdated                   # Check for outdated packages
npm audit                      # Security audit
npm audit fix                  # Fix security issues
```