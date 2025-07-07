// Export existing components
export { default as AppContainer } from './AppContainer';

// Export new responsive components
export { default as ResponsiveContainer } from './ResponsiveContainer';
export { 
  ResponsiveGrid, 
  ResponsiveGridLayout, 
  ResponsiveGridItem, 
  gridConfigs 
} from './ResponsiveGrid';
export { 
  ResponsiveStack, 
  ResponsiveVStack, 
  ResponsiveHStack, 
  stackConfigs 
} from './ResponsiveStack';

// Responsive layout utilities
export const breakpoints = {
  mobile: '0px',
  tablet: '768px', 
  desktop: '1024px',
  wide: '1440px',
};

export const containerSizes = {
  mobile: '450px',
  tablet: '768px',
  desktop: '1200px',
  wide: '1440px',
};

// Common responsive props patterns
export const responsiveProps = {
  // Padding patterns
  padding: {
    small: { base: 4, md: 6 },
    medium: { base: 6, md: 8, lg: 10 },
    large: { base: 8, md: 12, lg: 16 },
  },
  
  // Margin patterns
  margin: {
    small: { base: 2, md: 4 },
    medium: { base: 4, md: 6, lg: 8 },
    large: { base: 6, md: 8, lg: 12 },
  },
  
  // Font size patterns
  fontSize: {
    small: { base: 'sm', md: 'md' },
    medium: { base: 'md', md: 'lg', lg: 'xl' },
    large: { base: 'lg', md: 'xl', lg: '2xl' },
    heading: { base: 'xl', md: '2xl', lg: '3xl' },
  },
  
  // Spacing patterns
  spacing: {
    tight: { base: 2, md: 3 },
    normal: { base: 4, md: 6 },
    loose: { base: 6, md: 8, lg: 10 },
  },
};
