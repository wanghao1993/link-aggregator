# Link Aggregator App

A React Native mobile application for collecting, organizing, and sharing links. Think of it as your personal Pocket, Raindrop.io, or Linktree - all in one app.

## Features

- **Save Links**: Quickly save URLs with titles, descriptions, and tags
- **Organize**: Categorize links with folders and tags
- **Search**: Full-text search across your saved links
- **Share**: Share individual links or collections
- **Offline Access**: All links stored locally with cloud sync option
- **Dark Mode**: Full light/dark theme support
- **Cross-platform**: iOS, Android, and Web

## Tech Stack

- **React Native** with **Expo** for cross-platform development
- **TypeScript** for type safety
- **React Navigation** for routing and navigation
- **NativeWind** for styling (Tailwind CSS for React Native)
- **Zustand** for state management
- **React Hook Form + Zod** for form validation
- **Async Storage** for local data persistence
- **Expo Sharing** for sharing functionality
- **Expo Clipboard** for copy/paste operations
- **Expo Web Browser** for in-app browsing

## Project Structure

```
src/
├── components/     # Reusable UI components
├── screens/        # App screens (Home, AddLink, Settings, etc.)
├── navigation/     # Navigation configuration
├── stores/         # Zustand stores for state management
├── utils/          # Helper functions and utilities
├── hooks/          # Custom React hooks
├── types/          # TypeScript type definitions
├── constants/      # App constants and configuration
└── assets/         # Images, icons, fonts
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac only) or Android Studio for emulation
- Expo Go app on physical device for testing

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd link-aggregator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on specific platform:
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## Development

### Adding a New Screen

1. Create a new file in `src/screens/`
2. Add the screen to the navigation stack in `src/navigation/`
3. Export the screen component

### Adding a New Component

1. Create a new file in `src/components/`
2. Follow the existing component patterns
3. Add PropTypes or TypeScript interfaces
4. Export the component

### State Management

We use Zustand for state management. Create a new store in `src/stores/` when you need to manage global state.

## Design System

- **Colors**: Defined in `src/constants/colors.ts`
- **Typography**: Defined in `src/constants/typography.ts`
- **Spacing**: 4px base unit (NativeWind spacing scale)
- **Components**: Reusable components in `src/components/`

## Future Enhancements

- [ ] Cloud synchronization (Firebase/Supabase)
- [ ] Browser extension for one-click saving
- [ ] Link preview generation
- [ ] Automatic tagging with AI
- [ ] Collaboration features
- [ ] Import/export functionality
- [ ] Statistics and analytics
- [ ] Custom themes
- [ ] Widget support for home screen

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

## Acknowledgements

- Icons from [@expo/vector-icons](https://icons.expo.fyi/)
- UI inspiration from [Pocket](https://getpocket.com/), [Raindrop.io](https://raindrop.io/), and [Linktree](https://linktr.ee/)
- Built with [Expo](https://expo.dev/) and [React Native](https://reactnative.dev/)