# Pokémon Explorer App 🎮

A modern React Native mobile application built with Expo that allows users to explore, search, and favorite Pokémon using the PokéAPI. Features beautiful animations, type-based color coding, and a comprehensive authentication system.

## 📱 Features

### Core Functionality
- **Pokémon Discovery**: Browse through 151 original Pokémon with detailed information
- **Advanced Search**: Real-time search functionality with instant results
- **Favorites System**: Save and manage your favorite Pokémon locally
- **Type-Based Design**: Dynamic color coding based on Pokémon types
- **Detailed Views**: Comprehensive Pokémon stats, types, and artwork

### User Experience
- **Authentication Flow**: Complete login and signup system
- **Tab Navigation**: Intuitive bottom tab navigation
- **Responsive Design**: Optimized for all mobile screen sizes
- **Smooth Animations**: Micro-interactions and loading states
- **Profile Management**: User profile with editable information

### Technical Features
- **Offline Support**: Local data persistence with AsyncStorage
- **Error Handling**: Graceful error states and user feedback
- **Loading States**: Skeleton screens and activity indicators
- **Performance Optimized**: Efficient list rendering and image loading

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator or Android Emulator (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pokemon-explorer-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Run on device/simulator**
   - Scan the QR code with Expo Go app (iOS/Android)
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator

## 📁 Project Structure

```
pokemon-explorer-app/
├── app/                          # App Router directory
│   ├── (tabs)/                   # Tab navigation group
│   │   ├── index.tsx            # Pokémon list screen
│   │   ├── favorites.tsx        # Favorites screen
│   │   ├── profile.tsx          # User profile screen
│   │   └── _layout.tsx          # Tab layout configuration
│   ├── auth/                     # Authentication screens
│   │   ├── login.tsx            # Login screen
│   │   ├── signup.tsx           # Signup screen
│   │   └── _layout.tsx          # Auth layout
│   ├── _layout.tsx              # Root layout
│   └── +not-found.tsx           # 404 screen
├── hooks/                        # Custom React hooks
│   └── useFrameworkReady.ts     # Framework initialization hook
├── assets/                       # Static assets
│   └── images/                  # App icons and images
├── app.json                     # Expo configuration
├── package.json                 # Dependencies and scripts
└── tsconfig.json               # TypeScript configuration
```

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#3B82F6` - Main brand color
- **Secondary Blue**: `#1D4ED8` - Darker accent
- **Success Green**: `#10B981` - Success states
- **Warning Yellow**: `#F59E0B` - Warning states
- **Error Red**: `#EF4444` - Error states

### Type Colors
Each Pokémon type has its own color scheme:
- Fire: `#FF6B47`
- Water: `#4A90E2`
- Grass: `#7ED321`
- Electric: `#F5A623`
- Psychic: `#BD10E0`
- And more...

### Typography
- **Headers**: Bold, 24-32px
- **Body Text**: Regular, 16px
- **Captions**: Medium, 12-14px
- **Line Height**: 150% for body, 120% for headers

## 🔧 Configuration

### Environment Setup
The app uses Expo's built-in environment system. No additional configuration needed for basic functionality.

### Customization
- **App Name**: Update in `app.json`
- **Icons**: Replace files in `assets/images/`
- **Colors**: Modify color constants in component files
- **API Endpoints**: Currently uses PokéAPI (no API key required)

## 📱 Screens Overview

### Authentication
- **Login Screen**: Email/password authentication with validation
- **Signup Screen**: User registration with form validation

### Main App
- **Pokémon List**: Grid view of all Pokémon with search functionality
- **Favorites**: Personal collection of favorite Pokémon
- **Profile**: User information and app settings

## 🔌 Integration Guides

### Clerk Authentication Integration

To integrate Clerk for production authentication:

1. **Install Clerk**
   ```bash
   npm install @clerk/expo
   ```

2. **Setup Clerk Provider**
   ```tsx
   // app/_layout.tsx
   import { ClerkProvider } from '@clerk/expo'
   
   export default function RootLayout() {
     return (
       <ClerkProvider publishableKey="your-publishable-key">
         {/* Your app content */}
       </ClerkProvider>
     )
   }
   ```

3. **Replace Auth Screens**
   ```tsx
   // app/auth/login.tsx
   import { useSignIn } from '@clerk/expo'
   
   const { signIn, setActive } = useSignIn()
   // Replace custom auth logic with Clerk methods
   ```

### Convex Database Integration

To integrate Convex for real-time database:

1. **Install Convex**
   ```bash
   npm install convex
   npx convex dev
   ```

2. **Setup Convex Provider**
   ```tsx
   // app/_layout.tsx
   import { ConvexProvider, ConvexReactClient } from 'convex/react'
   
   const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!)
   
   export default function RootLayout() {
     return (
       <ConvexProvider client={convex}>
         {/* Your app content */}
       </ConvexProvider>
     )
   }
   ```

3. **Create Database Schema**
   ```typescript
   // convex/schema.ts
   import { defineSchema, defineTable } from 'convex/server'
   import { v } from 'convex/values'
   
   export default defineSchema({
     users: defineTable({
       name: v.string(),
       email: v.string(),
       favorites: v.array(v.number()),
     }),
   })
   ```

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build:web` - Build for web deployment
- `npm run lint` - Run ESLint

### Code Style
- TypeScript for type safety
- Functional components with hooks
- Consistent naming conventions
- Proper error handling

### Testing
Currently uses manual testing. To add automated testing:

```bash
npm install --save-dev jest @testing-library/react-native
```

## 📦 Dependencies

### Core Dependencies
- **expo**: ~53.0.0 - Expo SDK
- **react**: 19.0.0 - React library
- **react-native**: 0.79.1 - React Native framework
- **expo-router**: ~5.0.2 - File-based routing

### UI & Navigation
- **@react-navigation/bottom-tabs**: Tab navigation
- **expo-linear-gradient**: Gradient backgrounds
- **lucide-react-native**: Icon library

### Storage & State
- **@react-native-async-storage/async-storage**: Local storage
- **expo-constants**: App constants

### Utilities
- **expo-haptics**: Haptic feedback
- **expo-web-browser**: In-app browser

## 🚀 Deployment

### Expo Application Services (EAS)
1. Install EAS CLI: `npm install -g eas-cli`
2. Configure: `eas build:configure`
3. Build: `eas build --platform all`

### Web Deployment
```bash
npm run build:web
# Deploy the web-build folder to your hosting service
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Add proper error handling
- Include loading states for async operations
- Test on both iOS and Android
- Maintain consistent code style

## 🙏 Acknowledgments

- **PokéAPI**: Free RESTful API for Pokémon data
- **Expo Team**: Amazing React Native framework
- **Lucide**: Beautiful icon library
- **React Native Community**: Excellent ecosystem

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the [Expo Documentation](https://docs.expo.dev/)
- Visit [React Native Documentation](https://reactnative.dev/)

## 🔄 Changelog

### v1.0.0 (Current)
- Initial release with core Pokémon browsing functionality
- Authentication system with login/signup
- Favorites management
- Profile customization
- Search and filter capabilities
- Responsive design for all screen sizes

---

**Built with ❤️ using React Native and Expo**
