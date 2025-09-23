# MALABRO eSHOP - Frontend

<div align="center">

![MALABRO eSHOP](https://img.shields.io/badge/MALABRO-eSHOP-green?style=for-the-badge&logo=vue.js)
![Vue.js](https://img.shields.io/badge/Vue.js-3.4.21-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4.0-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Hosting-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

**🌍 Modern E-commerce Platform for African Marketplace**

[🚀 Live Demo](https://malabroeshop.web.app) • [📚 Documentation](./WARP.md) • [🐛 Report Bug](https://github.com/eworkforce/malabroeshop_frontend/issues) • [✨ Request Feature](https://github.com/eworkforce/malabroeshop_frontend/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Live Demo](#-live-demo)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Deployment](#-deployment)
- [API Integration](#-api-integration)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

---

## 🌟 Overview

MALABRO eSHOP is a modern, responsive e-commerce frontend built with Vue.js 3 and TypeScript. Designed specifically for the African marketplace, it provides a comprehensive shopping experience with French localization and XOF currency support.

### 🎯 Key Highlights

- **🛒 Complete E-commerce Solution**: Full shopping cart, checkout, and order management
- **👥 Multi-role System**: Customer and admin interfaces
- **📱 Mobile-First Design**: Optimized for all devices with touch-friendly interactions
- **🌍 Localized Experience**: French language support with West African CFA Franc (XOF)
- **⚡ High Performance**: Fast loading with optimized builds and caching
- **🔐 Secure & Scalable**: JWT authentication with role-based access control

---

## ✨ Features

### 🛍️ **Customer Features**
- **Product Browsing**: Advanced search and category filtering
- **Shopping Cart**: Persistent cart with real-time stock validation
- **User Authentication**: Secure registration and login system
- **Responsive Design**: Seamless experience across all devices
- **Order Management**: Complete checkout process with order confirmation

### 🔧 **Admin Features**
- **Product Management**: CRUD operations with image upload
- **Inventory Control**: Real-time stock tracking and low-stock alerts
- **Category Management**: Organize products with categories and units
- **Order Processing**: Manage orders and update payment status
- **Analytics Dashboard**: Sales overview and inventory reports
- **User Management**: View and manage customer accounts

### 🎨 **UI/UX Features**
- **Modern Interface**: Clean, intuitive design with Radix Vue components
- **Dark/Light Theme**: Automatic theme adaptation
- **Touch Optimized**: Large touch targets for mobile users
- **Loading States**: Smooth loading animations and skeleton screens
- **Error Handling**: Graceful error states with user-friendly messages

---

## 🛠️ Tech Stack

### **Core Framework**
- **[Vue.js 3.4.21](https://vuejs.org/)** - Progressive JavaScript framework
- **[TypeScript 5.4.0](https://www.typescriptlang.org/)** - Type-safe development
- **[Vite 4.5.0](https://vitejs.dev/)** - Fast build tool and development server

### **State Management & Routing**
- **[Pinia 2.3.1](https://pinia.vuejs.org/)** - Modern state management
- **[Vue Router 4.3.0](https://router.vuejs.org/)** - Official Vue.js router

### **UI Components & Styling**
- **[Tailwind CSS 3.4.3](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix Vue 1.8.1](https://www.radix-vue.com/)** - Unstyled, accessible components
- **[Lucide Vue Next](https://lucide.dev/)** - Beautiful & consistent icons
- **[Class Variance Authority](https://cva.style/)** - Component variant management

### **HTTP & Utilities**
- **[Axios 1.11.0](https://axios-http.com/)** - Promise-based HTTP client
- **[VueUse 13.9.0](https://vueuse.org/)** - Collection of Vue composition utilities

### **Development Tools**
- **[ESLint 8.57.0](https://eslint.org/)** - Code linting and quality
- **[Prettier 3.2.5](https://prettier.io/)** - Code formatting
- **[PostCSS](https://postcss.org/)** - CSS processing with autoprefixer

---

## 🚀 Live Demo

### **🌐 Production Deployment**
- **Live URL**: [https://malabroeshop.web.app](https://malabroeshop.web.app)
- **Firebase Project**: `malabroeshop` (ID: 255424894390)
- **Backend API**: `https://malabro.ishopinafrica.com/api/v1`

### **👤 Test Accounts**
- **Customer Account**: Create new account via registration
- **Admin Access**: Contact admin for demo credentials

---

## ⚡ Quick Start

### **Prerequisites**
- **Node.js**: 18.x or later (LTS recommended)
- **npm**: 9.x or later
- **Git**: Latest version

### **🔧 Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/eworkforce/malabroeshop_frontend.git
   cd malabroeshop_frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   # Create local environment file (optional for development)
   cp .env.production .env.local
   
   # Edit .env.local for local development
   echo "VITE_API_URL=http://localhost:8000/api/v1" > .env.local
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:5173
   ```

### **🏗️ Build for Production**
```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Project Structure

```
src/
├── 📂 assets/           # Static assets (images, styles)
├── 📂 components/       # Reusable Vue components
│   ├── 📂 admin/       # Admin-specific components
│   │   ├── AdminLayout.vue
│   │   ├── AdminOrders.vue
│   │   └── ...
│   └── 📂 ui/          # Base UI components (Radix Vue)
│       ├── 📂 button/
│       ├── 📂 card/
│       └── ...
├── 📂 composables/     # Vue composition functions
├── 📂 lib/             # Utility functions
├── 📂 router/          # Vue Router configuration
├── 📂 services/        # API services and HTTP client
│   ├── api.ts          # Axios configuration
│   ├── ProductService.ts
│   └── ...
├── 📂 stores/          # Pinia stores
│   ├── auth.ts         # Authentication store
│   ├── cart.ts         # Shopping cart store
│   └── user.ts         # User management store
└── 📂 views/           # Page components
    ├── 📂 admin/       # Admin dashboard pages
    │   ├── AdminOverview.vue
    │   ├── ProductManager.vue
    │   └── ...
    ├── HomeView.vue
    ├── ProductDetail.vue
    ├── Cart.vue
    └── ...
```

---

## 💻 Development

### **🔧 Available Scripts**

```bash
# Development
npm run dev                    # Start dev server with hot reload
npm run build                  # Build for production
npm run preview                # Preview production build

# Code Quality
npm run lint                   # Run ESLint with auto-fix
npm run format                 # Format code with Prettier
npm run type-check             # TypeScript type checking

# Maintenance
npm audit                      # Check for security vulnerabilities
npm outdated                   # Check for outdated packages
```

### **🎯 Development Guidelines**

1. **Code Style**
   - Use Composition API for new components
   - Follow existing TypeScript patterns
   - Add proper type definitions for all props and emits
   - Include loading states and error handling

2. **Component Structure**
   ```vue
   <script setup lang="ts">
   // Imports
   import { ref, computed, onMounted } from 'vue'
   
   // Props & Emits
   interface Props {
     // Define props with types
   }
   const props = defineProps<Props>()
   
   // Reactive state
   const loading = ref(false)
   
   // Computed properties
   const computedValue = computed(() => {
     // Logic here
   })
   
   // Methods
   const handleAction = async () => {
     // Implementation
   }
   
   // Lifecycle
   onMounted(() => {
     // Initialization
   })
   </script>
   
   <template>
     <!-- Template with proper accessibility -->
   </template>
   
   <style scoped>
     /* Component-specific styles */
   </style>
   ```

3. **State Management**
   - Use Pinia stores for global state
   - Keep component state local when possible
   - Implement proper error handling in stores

---

## 🚀 Deployment

### **🔥 Firebase Hosting**

The application is deployed using Firebase Hosting with automatic builds.

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy to production
npm run build
firebase deploy --only hosting
```

### **🐳 Docker Deployment** (Alternative)

```bash
# Build Docker image
docker build -t malabro-frontend .

# Run container
docker run -p 80:80 malabro-frontend
```

### **📋 Environment Variables**

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `https://malabro.ishopinafrica.com/api/v1` |

---

## 🔌 API Integration

### **🌐 Backend Connection**
- **Production API**: `https://malabro.ishopinafrica.com/api/v1`
- **Authentication**: JWT Bearer tokens
- **Storage**: localStorage for session persistence

### **📡 Key Endpoints**
- `GET /products/` - Fetch products
- `POST /auth/login` - User authentication
- `GET /auth/me` - Get current user
- `POST /orders/` - Create order
- `GET /admin/orders` - Admin order management

### **🔒 Authentication Flow**
1. User submits login credentials
2. Backend validates and returns JWT token
3. Frontend stores token in localStorage
4. Axios automatically adds Authorization header
5. Protected routes verify user authentication

---

## 🤝 Contributing

We welcome contributions to MALABRO eSHOP! Here's how you can help:

### **🔄 Development Process**
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Make** your changes with proper tests
4. **Commit** with conventional commit messages
5. **Push** to your branch (`git push origin feature/amazing-feature`)
6. **Open** a Pull Request

### **📝 Commit Convention**
```
feat: add amazing new feature
fix: resolve critical bug in cart
docs: update API documentation
style: improve component styling
refactor: optimize state management
test: add unit tests for auth
chore: update dependencies
```

### **🐛 Bug Reports**
Please use the [GitHub Issues](https://github.com/eworkforce/malabroeshop_frontend/issues) to report bugs with:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Browser/device information

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 💬 Support

### **📞 Getting Help**
- **Documentation**: [WARP.md](./WARP.md) - Comprehensive project guide
- **Issues**: [GitHub Issues](https://github.com/eworkforce/malabroeshop_frontend/issues)
- **Discussions**: [GitHub Discussions](https://github.com/eworkforce/malabroeshop_frontend/discussions)

### **🏢 Commercial Support**
For commercial support and custom development:
- **Organization**: [eWorkforce Africa](https://eworkforce.africa)
- **Email**: Contact through organization website

---

## 🙏 Acknowledgments

- **Vue.js Community** - For the amazing framework and ecosystem
- **Tailwind CSS** - For the utility-first CSS framework
- **Radix UI** - For accessible, unstyled components
- **Firebase** - For reliable hosting and deployment
- **African Tech Community** - For inspiration and support

---

<div align="center">

**Made with ❤️ for the African Tech Community**

[![GitHub stars](https://img.shields.io/github/stars/eworkforce/malabroeshop_frontend?style=social)](https://github.com/eworkforce/malabroeshop_frontend/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/eworkforce/malabroeshop_frontend?style=social)](https://github.com/eworkforce/malabroeshop_frontend/network/members)

[⬆ Back to Top](#malabro-eshop---frontend)

</div>