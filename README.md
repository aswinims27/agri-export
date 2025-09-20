# AgriExport - Farmer Export Business Platform

A comprehensive web application built with React, TailwindCSS, Framer Motion, and Firebase to help farmers connect with global buyers and export their products internationally.

## Features

- **Professional Design**: Earthy theme with green and white colors, glassmorphism cards, and smooth animations
- **Dark/Light Mode**: Theme toggle with localStorage persistence
- **Authentication**: Firebase Auth with Google sign-in and email/password
- **File Upload**: Government ID document upload to Firebase Storage
- **Dashboard**: Interactive charts showing earnings and export data
- **Mobile Responsive**: Optimized for all device sizes
- **Real-time Data**: Firestore integration for user profiles and market insights

## Tech Stack

- **Frontend**: React.js, TailwindCSS, Framer Motion
- **Backend**: Firebase (Auth, Firestore, Storage, Hosting)
- **Charts**: Recharts
- **Routing**: React Router
- **Icons**: Lucide React

## Setup Instructions

1. **Clone and install dependencies**:
   ```bash
   npm install
   ```

2. **Firebase Configuration**:
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication (Email/Password and Google providers)
   - Create Firestore database
   - Enable Storage
   - Copy your Firebase config and update `src/config/firebase.js`

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Deploy to Firebase Hosting**:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init hosting
   firebase deploy
   ```

## Firebase Collections

### farmers
- `name`: User's full name
- `email`: Email address
- `mobile`: Phone number
- `exportItem`: Primary export product
- `location`: Farm location
- `idProofURL`: Government ID document URL
- `savings`: Total savings
- `monthlyEarnings`: Array of monthly earning data
- `createdAt`: Account creation date

### marketInsights
- `crop`: Crop name
- `demand`: Demand level (High/Medium/Low)
- `price`: Current market price
- `trend`: Price trend percentage

## Key Components

- **Navbar**: Navigation with theme toggle and authentication
- **Home**: Hero section with features and market highlights
- **About**: Company information, team, and values
- **Services**: Core and value-added services
- **Register**: User registration with file upload
- **Login**: Authentication with Google and email/password
- **Dashboard**: User profile, earnings chart, and recommendations
- **Footer**: Contact information and quick links

## Security Features

- Firestore security rules for user data protection
- Storage rules for file access control
- Input validation and error handling
- Secure file upload with size limits

## Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Flexible grid layouts and adaptive components

## Animations

- Framer Motion for page transitions
- Hover effects on cards and buttons
- Fade-in animations for content
- Smooth theme transitions

## Performance Optimizations

- Lazy loading of components
- Optimized bundle size
- Efficient re-rendering with React hooks
- Firebase SDK optimization

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)