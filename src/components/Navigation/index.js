// Export navigation components
export { default as BottomNavigation } from './BottomNavigation';
export { default as SideNavigation } from './SideNavigation';
export { default as ResponsiveNavigation } from './ResponsiveNavigation';

// Navigation configuration
export const navigationItems = [
  {
    id: 'home',
    label: 'Home',
    path: '/home',
  },
  {
    id: 'community',
    label: 'Community',
    path: '/community',
  },
  {
    id: 'progress',
    label: 'Progress',
    path: '/progress',
  },
  {
    id: 'profile',
    label: 'Profile',
    path: '/profile',
  },
];
