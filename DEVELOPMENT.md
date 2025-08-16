# Rawgle Frontend Development Guide

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to production
./deploy.sh
```

## 📁 Project Structure

```
src/
├── App.jsx         # Main Rawgle component
├── index.css       # Tailwind CSS imports
└── main.jsx        # React entry point
```

## 🎨 Design System

### Colors
- Primary: Emerald/Green (`emerald-600`, `green-500`)
- PAWS Rewards: Amber/Yellow (`amber-400`, `yellow-500`)
- Text: Gray scale (`gray-900`, `gray-600`, `gray-500`)

### Components
- **Navigation**: Logo, PAWS balance, user menu
- **HeroSearch**: Main search with category filters
- **SupplierCard**: Individual supplier listings
- **FilterSidebar**: Advanced filtering options

## 🔄 Development Workflow

1. **Make Changes**: Edit components in `src/App.jsx`
2. **Test Locally**: `npm run dev` (http://localhost:5173)
3. **Deploy**: `./deploy.sh`
4. **Live instantly** at Cloudflare Pages URL

## 🐾 PAWS Integration

The PAWS rewards system is built into supplier cards:
- Displays earning rate per order
- Shows current balance in navigation
- Ready for backend API integration

## 📱 Mobile Responsive

All components use Tailwind's responsive classes:
- `sm:` (640px+)
- `md:` (768px+) 
- `lg:` (1024px+)
- `xl:` (1280px+)

## 🔗 Backend Integration Ready

Components are structured for easy API integration:
- User authentication hooks
- Supplier search/filter functions
- PAWS balance management
- Review and rating systems