# MALABRO eShop - Frontend

A modern Vue.js e-commerce frontend for MALABRO organic produce marketplace with integrated payment systems and AI assistant.

## 🚀 Features

- **Modern Vue 3 + TypeScript** with Composition API
- **Earthy Elegance Design System** - Premium organic produce branding
- **Multi-Payment Integration** - Wave and Orange Money support
- **AI Shopping Assistant** - Groq-powered chatbot for inventory queries
- **Responsive Design** - Mobile-first approach with PrimeVue components
- **Real-time Cart Management** - Pinia state management
- **Order Management** - Complete checkout and order tracking
- **Admin Dashboard** - Order management and payment verification

## 🛠️ Tech Stack

- **Framework**: Vue 3 + TypeScript + Vite
- **UI Library**: PrimeVue + Tailwind CSS
- **State Management**: Pinia
- **HTTP Client**: Axios
- **Routing**: Vue Router
- **Build Tool**: Vite
- **Testing**: Playwright (E2E)
- **Deployment**: Docker + Nginx

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Backend API running on port 8000

### Setup
```bash
# Clone repository
git clone https://github.com/eworkforce/malabro_eshop_frontend.git
cd malabro_eshop_frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔧 Environment Configuration

Create `.env.local` file:
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_GROQ_API_KEY=your_groq_api_key_here
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable Vue components
│   ├── AppHeader.vue   # Navigation header
│   ├── ProductCard.vue # Product display card
│   └── ...
├── views/              # Page components
│   ├── Home.vue        # Homepage with hero section
│   ├── Products.vue    # Product catalog
│   ├── Cart.vue        # Shopping cart
│   ├── Checkout.vue    # Payment flow
│   └── Admin.vue       # Admin dashboard
├── stores/             # Pinia state stores
│   ├── auth.ts         # Authentication state
│   ├── cart.ts         # Shopping cart state
│   └── products.ts     # Product catalog state
├── composables/        # Vue composables
│   └── useGroqChat.js  # AI assistant integration
├── router/             # Vue Router configuration
└── assets/             # Static assets and styles
```

## 💳 Payment Integration

### Wave Payment
- QR code generation for mobile payments
- Automatic order notifications
- Payment status tracking

### Orange Money
- Direct payment link integration
- Branded payment experience
- Email notifications with payment method

## 🤖 AI Assistant Features

- **Product Search**: Natural language product queries
- **Inventory Status**: Real-time stock information
- **Order History**: Recent order tracking
- **Business Analytics**: Sales summaries and insights

## 📱 Key Pages

- **Homepage** (`/`) - Hero section with seasonal favorites
- **Products** (`/products`) - Full product catalog with search
- **Cart** (`/cart`) - Shopping cart with delivery fee breakdown
- **Checkout** (`/checkout`) - Payment method selection and order creation
- **Admin** (`/admin`) - Order management and payment verification

## 🎨 Design System

### Color Palette
- **Primary**: Beetroot Purple (#8A307F)
- **Secondary**: Carrot Orange (#F28C28)
- **Background**: Off-white (#F9F9F9) and Light Beige (#F5F0E8)
- **Text**: Deep Olive (#3D403A)

### Typography
- **Headings**: Lora serif font
- **Body**: Inter sans-serif font

## 🚀 Deployment

### Docker Deployment
```bash
# Build Docker image
docker build -t malabro-frontend .

# Run container
docker run -p 80:80 malabro-frontend
```

### Manual Deployment
```bash
# Build for production
npm run build

# Serve dist/ directory with your web server
```

## 🧪 Testing

```bash
# Run E2E tests
npm run test:e2e

# Run tests in headless mode
npm run test:e2e:headless
```

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test:e2e` - Run Playwright E2E tests
- `npm run lint` - Run ESLint

## 🔗 API Integration

The frontend connects to the MALABRO backend API:
- **Base URL**: `http://localhost:8000/api/v1`
- **Authentication**: JWT tokens
- **Key Endpoints**:
  - `/products` - Product catalog
  - `/orders` - Order management
  - `/auth` - Authentication
  - `/ai-tools` - AI assistant endpoints
  - `/notifications` - Payment notifications

## 🛡️ Security

- JWT token authentication
- Secure payment processing
- Input validation and sanitization
- CORS configuration for API access

## 📞 Support

For technical support or questions:
- Backend Repository: [malabro_eshop_backend](https://github.com/eworkforce/malabro_eshop_backend)
- Issues: Create GitHub issues for bug reports
- Documentation: See backend README for API documentation

## 📄 License

This project is part of the MALABRO eShop platform.
