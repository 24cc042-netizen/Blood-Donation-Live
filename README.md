# 🩸 BloodConnect - Real-Time Blood Donation Network

A comprehensive React Native + Expo application connecting blood donors, hospitals, blood banks, and labs in real-time. Built with **cross-platform support** (Web, Android, iOS) and modern features including **dark mode**, **animations**, **settings panel**, and **multi-role dashboards**.

## ✨ Features

### 🎯 Core Features
- **Multi-role Dashboard**: Support for Donors, Hospitals, Blood Banks, and Blood Labs
- **Real-time Search**: Find blood inventory across the network
- **Dark Mode**: Full dark theme support with smooth transitions
- **Animated UI**: Medium-level animations for smooth transitions and interactions
- **Settings Panel**: Manage app preferences, notifications, and theme
- **Phone Authentication**: OTP-based login with Firebase
- **Responsive Design**: Optimized for mobile and web browsers
- **Online-Only Mode**: No offline caching - real-time data only

### 👥 Role-Specific Features

**🩸 Blood Donor / Patient**
- Search for available blood types and components
- Filter by blood type and component (Whole Blood, Platelets, Plasma)
- View nearby institutions and contact details
- Browse upcoming blood drives
- Quick contact functionality

**🏥 Hospital**
- Manage blood inventory (add/remove items)
- Track blood units by type and component
- Post urgent blood requests
- View request status and urgency levels
- Monitor stock levels in real-time

**🩹 Blood Bank**
- Manage blood stock
- Schedule blood drives
- Track upcoming donation events
- Manage collections and supplies
- Organize community donation events

**🔬 Blood Lab**
- Track lab inventory
- Search blood from other institutions
- Manage testing and analysis workflows
- Network search capabilities

### ⚙️ Settings & Customization
- **Dark Mode Toggle** with confirmation dialog
- **Notifications Control** (toggle on/off)
- **App Version** tracking
- **Privacy Policy** access
- **User Profile** management

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- For Android: Expo Go app on your device or Android emulator

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/Blood-Donation-Live.git
cd Blood-Donation-Live

# Install dependencies
npm install

# Install web-specific dependencies (if not already installed)
npm install react-native-web react-dom @expo/webpack-config
```

### Running the App

#### 🌐 Web Browser
```bash
npm run web
```
Opens automatically at `http://localhost:19006`

#### 📱 Android Device/Emulator
```bash
npm run start
```
Then:
- Scan QR code with **Expo Go** app (on physical device)
- Or press `a` for Android emulator

#### 🍎 iOS Device/Simulator
```bash
npm run ios
```

## 📱 Navigation & UI Flow

### Login Flow
1. **Phone Authentication** → Enter phone number → Receive OTP
2. **Profile Setup** → Enter name and blood type
3. **Main Dashboard** → Select your role

### Main Dashboard
- Welcome message with user name
- Settings icon (⚙️) in top-right
- Logout icon (🚪) in top-right
- Quick stats cards (Blood Inventory, Blood Drives, Urgent Requests)
- Application information and features
- Role selection grid (4 roles)

### Role-Specific Pages
Each role (Donor, Hospital, Bank, Lab) has its own dedicated screen with role-specific operations.

## 🎨 Design & Animations

- **Fade Animations**: Login and profile screens fade in smoothly
- **Slide Animations**: Settings modal slides up from bottom
- **Dark Mode Animations**: Smooth theme transitions
- **Card Animations**: Dashboard cards animate in on load
- **Button Feedback**: Interactive touch responses

## 🔧 Key Technologies

- **Expo ~48.0.0**: Managed React Native framework
- **React Native 0.71.14**: Native UI components
- **Firebase 10.9.0**: Backend services (Auth, Firestore, Storage)
- **React Navigation 6.1.6**: Tab and stack navigation
- **Animated API**: Smooth transitions and interactions
- **StyleSheet**: Performance-optimized styling

## 📁 Project Structure

```
Blood-Donation-Live/
├── App.tsx              # Main app with all screens
├── app/                 # Nested route files (optional)
│   └── (tabs)/         # Tab-based screens
├── lib/
│   ├── firebase.ts     # Firebase configuration
│   ├── offlineCache.ts # (Removed - online only)
├── package.json        # Dependencies
├── app.json            # Expo config
├── babel.config.js     # Babel config
├── tsconfig.json       # TypeScript config
└── README.md          # This file
```

## 🔐 Authentication

Currently using **phone OTP authentication** placeholder. To enable real Firebase Auth:

1. Create a Firebase project
2. Add Firebase credentials to `lib/firebase.ts`:
```typescript
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID'
};
```

## 🌙 Dark Mode Implementation

The app includes full dark mode support:
- Toggle from ⚙️ Settings button
- Confirmation dialog before switching
- All colors adapt to dark theme
- Smooth transitions between modes
- Persists user preference

## 📊 Mock Data

The app includes mock data for testing:
- 4 institutions with blood inventory
- 2 upcoming blood drives
- 2 urgent blood requests

Replace with real Firebase Firestore data by connecting the app to your Firebase project.

## 🛠️ Development Tips

### Adding New Features
1. Create new screen component
2. Add to App.tsx state management
3. Update navigation logic
4. Test on both web and mobile

### Styling
- Use `createStyles(isDark)` function for theme-aware styling
- All colors automatically adapt to dark/light mode
- Maximum width 800px for optimal web display

### Testing Navigation
- Web: Click buttons directly
- Mobile: Use device/emulator touch

## 🚀 Performance Optimizations

- ScrollView for scrollable content
- FlatList for long lists (scrollEnabled={false} for nested lists)
- Animated API for smooth 60fps animations
- Minimal re-renders with proper state management

## 📦 Dependencies

**Core**
- expo ~48.0.0
- react 18.2.0
- react-native 0.71.14

**Navigation**
- @react-navigation/native
- @react-navigation/native-stack
- @react-navigation/bottom-tabs

**Backend**
- firebase ^10.9.0
- expo-firebase-recaptcha ^2.2.1

**Utilities**
- react-native-reanimated ~2.14.4
- react-native-maps 1.3.2
- expo-location ~15.1.1
- expo-notifications ~0.18.1
- geolib ^3.3.3

**Web Support**
- react-native-web ~0.18.10
- react-dom 18.2.0
- @expo/webpack-config ^18.0.1

## 🐛 Troubleshooting

### Web App Shows Blank Screen
- Clear browser cache: `Ctrl+Shift+Delete`
- Reload: `Ctrl+F5` (hard refresh)
- Check browser console for errors

### Android Expo Go Won't Connect
- Ensure device and computer on same network
- Try tunnel mode: `expo start --tunnel`
- Or use Android emulator

### TypeScript Errors
- Run `npm install` to ensure all types are installed
- Check tsconfig.json configuration

## 📝 Environment Setup

**.env** (optional - for Firebase config)
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test on web and mobile
4. Submit pull request

## 📄 License

MIT License - See LICENSE file for details

## 📞 Support

For issues, feature requests, or feedback:
- Open an issue on GitHub
- Check existing documentation
- Review code comments

## 🔄 Version History

**v1.0.0** (Current)
- Multi-role dashboard
- Dark mode with animations
- Settings panel
- Authentication flow
- Cross-platform support (Web, Android, iOS)
- Online-only mode

---

**Made with ❤️ for blood donors and healthcare providers worldwide**

A cross-platform mobile and web application built with Expo & React Native to connect blood donors, hospitals, blood banks, and blood labs in real-time.

## ✨ Features

- ✅ **Multi-role support**: Donor/Patient, Hospital, Blood Bank, Blood Lab
- ✅ **Real-time inventory management**: Post, search, and manage blood inventory
- ✅ **OTP-based authentication**: Phone number verification for secure sign-in
- ✅ **Cross-platform**: Works seamlessly on Web, Android, and iOS
- ✅ **Responsive design**: Clean, intuitive UI for all device sizes
- ✅ **Online-only**: No offline caching (production-ready)
- ✅ **TypeScript**: Full type safety for reliability
- ✅ **Navigation**: Multi-page app with proper state management

## 🛠 Tech Stack

- **Expo** (~48.0.0) - Managed React Native framework
- **React Native** (0.71.14) - Cross-platform UI framework
- **Firebase** (^10.9.0) - Backend (Firestore, Auth, Storage)
- **React Navigation** (^6.1.6) - Navigation management
- **TypeScript** (4.9.5) - Type safety
- **React Native Web** (~0.18.10) - Web platform support

## 📁 Project Structure

```
BloodConnect/
├── App.tsx                      # Root component with app state & navigation
├── app/
│   └── (tabs)/
│       ├── (user)/              # Donor screens
│       │   ├── find.tsx         # Search blood inventory
│       │   └── map.tsx          # Map view of institutions
│       ├── (hospital)/          # Hospital screens
│       │   ├── index.tsx        # Hospital dashboard
│       │   ├── inventory.tsx    # Inventory management
│       │   └── requests.tsx     # Blood requests
│       ├── (bank)/              # Blood bank screens
│       │   └── index.tsx        # Bank dashboard
│       └── (lab)/               # Lab screens
│           └── index.tsx        # Lab dashboard
├── lib/
│   └── firebase.ts              # Firebase configuration & helpers
├── package.json                 # Dependencies
├── app.json                     # Expo configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Expo CLI: `npm install -g expo-cli`
- For Android: Android emulator or physical device with Expo Go app
- For iOS: Xcode and iPhone simulator (macOS only)

### Installation

1. **Clone or navigate to project**:
   ```bash
   cd /workspaces/Blood-Donation-Live
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

### Running the App

#### **Web (Recommended for Testing)** ⭐
```bash
npm run web
```
- Opens at `http://localhost:19006`
- Hot reload enabled - changes auto-refresh
- Works on all modern browsers
- **Best for development and testing**

#### **Android Emulator or Physical Device**
```bash
npm run android
```

**For physical Android device via Expo Go**:
1. Install [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent) from Google Play Store
2. Run: `npm start`
3. Press `a` in terminal to open on Android
4. Scan QR code with Expo Go app or press `w` for web

#### **iOS (macOS only)**
```bash
npm run ios
```

## 🔐 Authentication Flow

### Step 1: Login (Phone OTP)
- Enter phone number (e.g., `+1 555-0100`)
- Click "Send OTP"
- Enter verification code
- Click "Verify OTP"

### Step 2: Profile Setup
- Enter full name
- Select blood type
- Click "Continue"

### Step 3: Role Selection
Choose one of four roles:
- 🩸 **Donor/Patient** - Find & request blood
- 🏥 **Hospital** - Manage inventory & post requests
- 🩹 **Blood Bank** - Manage stock & organize drives
- 🔬 **Blood Lab** - Manage lab inventory

### Step 4: Dashboard
- Access role-specific features
- Click "Logout" to return to login

## 👥 User Roles & Features

### 👨‍⚕️ Donor/Patient Dashboard
- 🔍 **Search**: Find blood by type & component
- 📞 **Contact**: Call institutions directly
- 🗺️ **Nearby**: View institutions by distance
- 📅 **Drives**: View upcoming blood donation drives

### 🏥 Hospital Dashboard
- **Inventory Tab**:
  - Add blood items with blood type, component, units
  - Remove items from stock
  - View current stock levels
  
- **Requests Tab**:
  - Post urgent blood requests
  - View pending requests with urgency level
  - Mark requests as critical/high/medium

### 🩹 Blood Bank Dashboard
- **Inventory Tab**:
  - Track blood stock by type & component
  - View unit quantities
  - Real-time stock updates
  
- **Drives Tab**:
  - Create blood donation drives
  - Schedule donation events
  - Manage drive locations & dates

### 🔬 Blood Lab Dashboard
- View lab inventory
- Search network for components
- Manage lab stock levels
- Network coordination with other institutions

## ⚙️ Configuration

### Firebase Setup (Required for Production)

1. **Create Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project

2. **Get Firebase Config**:
   - Project Settings → Web App
   - Copy config object

3. **Update `lib/firebase.ts`**:
   ```typescript
   const firebaseConfig = {
     apiKey: 'YOUR_API_KEY',
     authDomain: 'YOUR_AUTH_DOMAIN',
     projectId: 'YOUR_PROJECT_ID',
     storageBucket: 'YOUR_STORAGE_BUCKET',
     messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
     appId: 'YOUR_APP_ID'
   };
   ```

4. **Enable Services in Firebase**:
   - **Authentication** → Phone (enable)
   - **Firestore Database** → Create database
   - **Storage** → Create bucket
   - **Security Rules** → Deploy rules from `firebase.rules`

### Environment Variables (Optional)

Create `.env.local`:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_key
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

## 🧪 Mock Data

The app includes mock data for testing:
- 4 institutions (hospitals, blood bank, lab)
- 2 blood drives
- 2 blood requests
- 4 inventory items

Replace with real Firestore data by importing institutions from Firebase in `App.tsx`.

## ⌨️ Keyboard Controls (Web)

From terminal during `npm start`:
- `w` - Open web view
- `a` - Open Android emulator
- `i` - Open iOS simulator
- `r` - Reload app
- `j` - Open debugger
- `m` - Toggle menu

## 🐛 Troubleshooting

### **Web App Shows Login → OTP → Profile → Roles**
✅ Navigation works correctly! All pages are functional.

### **Android Emulator Connection Hangs**
**Solutions**:
- Use Expo Go app on physical Android device
- Check WiFi connectivity (same network required)
- Run: `npx expo start --tunnel` for tunnel mode
- Use web version for testing

### **Firebase Errors**
**Solution**: Ensure Firebase config is correct in `lib/firebase.ts` and services are enabled.

### **TypeScript Errors**
**Status**: All TypeScript errors are fixed (strict types implemented).

### **Web Port Already in Use**
```bash
# Kill process on port 19006
lsof -ti:19006 | xargs kill -9
npm run web
```

### **Module Not Found**
```bash
npm install
npx expo install
```

## 🗂️ Database Schema

### Firestore Collections
```
institutions/
  ├── hospitals/{hospital_id}/
  │   ├── name: string
  │   ├── phone: string
  │   └── inventory/
  │       └── {item_id}
  │           ├── bloodType: string
  │           ├── component: string
  │           └── units: number
  │
  ├── blood_banks/{bank_id}/
  │   ├── name: string
  │   ├── stock/...
  │   └── drives/...
  │
  └── labs/{lab_id}/
      ├── name: string
      └── inventory/...

blood_requests/
  ├── {request_id}
  │   ├── institution: string
  │   ├── bloodType: string
  │   ├── component: string
  │   ├── units: number
  │   ├── urgency: 'critical' | 'high' | 'medium'
  │   └── timestamp: number

blood_drives/
  ├── {drive_id}
  │   ├── name: string
  │   ├── date: string (ISO 8601)
  │   ├── location: string
  │   └── organizer: string

users/
  ├── {uid}
  │   ├── phone: string
  │   ├── fullName: string
  │   ├── bloodType: string
  │   ├── role: 'donor' | 'hospital' | 'bank' | 'lab'
  │   ├── fcmToken: string (notifications)
  │   └── createdAt: number
```

## 🔒 Security Rules

See `firebase.rules` for Firestore security ensuring:
- Users can only read/write their own data
- Public search of institutions
- Role-based access control
- Write verification for requests

## ⚡ Performance Tips

1. **Lazy load screens** - Only load data on demand
2. **Use FlatList** - For long lists instead of ScrollView
3. **Memoize components** - Use `React.memo()` for pure components
4. **Optimize images** - Use appropriate sizes for web & mobile
5. **Enable Hermes** - In app.json for faster JS execution
6. **Batch updates** - Combine multiple setState calls

## 🌐 Deployment

### Web (Vercel/Netlify)
```bash
npm run web
# Build for production
npx expo export --platform web
# Deploy dist/ folder
```

### Mobile (EAS Build)
```bash
npm install -g eas-cli
eas login
eas build --platform android
eas build --platform ios
eas submit
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 19006
CMD ["npm", "run", "web"]
```

## 📱 Testing Checklist

- [ ] Web app opens without errors
- [ ] Login screen displays correctly
- [ ] OTP verification works
- [ ] Profile setup accepts input
- [ ] Role selection navigates to dashboards
- [ ] Donor dashboard shows search & results
- [ ] Hospital dashboard shows inventory & requests
- [ ] Bank dashboard shows stock & drives
- [ ] Lab dashboard shows inventory
- [ ] Logout returns to login
- [ ] Responsive on mobile screen sizes
- [ ] TypeScript compiles without errors

## 🤝 Contributing

To add new features:
1. Create feature branch: `git checkout -b feature/name`
2. Update `App.tsx` with new screens
3. Add TypeScript types for all props
4. Test on web first: `npm run web`
5. Verify on Android/iOS
6. Create pull request

## 📄 License

MIT - See LICENSE file

## 💬 Support

For issues:
1. Check **Troubleshooting** section
2. Review Firebase Console logs
3. Check browser Developer Tools (F12)
4. Enable debugger: Press `j` in terminal during `npm start`

---

**Built with ❤️ for blood donation networks**

Last updated: December 2024
