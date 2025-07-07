import { VStack, HStack, Stack } from '@chakra-ui/react';

/**
 * ResponsiveStack - A stack component that changes direction based on screen size
 */
export const ResponsiveStack = ({ 
  children, 
  direction = { base: 'column', md: 'row' },
  spacing = { base: 4, md: 6 },
  align = 'stretch',
  justify = 'flex-start',
  wrap = 'nowrap',
  ...props 
}) => {
  return (
    <Stack
      direction={direction}
      spacing={spacing}
      align={align}
      justify={justify}
      wrap={wrap}
      w="full"
      {...props}
    >
      {children}
    </Stack>
  );
};

/**
 * ResponsiveVStack - Vertical stack with responsive spacing
 */
export const ResponsiveVStack = ({ 
  children, 
  spacing = { base: 4, md: 6, lg: 8 },
  align = 'stretch',
  ...props 
}) => {
  return (
    <VStack
      spacing={spacing}
      align={align}
      w="full"
      {...props}
    >
      {children}
    </VStack>
  );
};

/**
 * ResponsiveHStack - Horizontal stack with responsive spacing and wrapping
 */
export const ResponsiveHStack = ({ 
  children, 
  spacing = { base: 4, md: 6 },
  wrap = { base: 'wrap', md: 'nowrap' },
  justify = 'flex-start',
  align = 'center',
  ...props 
}) => {
  return (
    <HStack
      spacing={spacing}
      wrap={wrap}
      justify={justify}
      align={align}
      w="full"
      {...props}
    >
      {children}
    </HStack>
  );
};

/**
 * Predefined responsive stack configurations
 */
export const stackConfigs = {
  // Navigation items - horizontal on desktop, vertical on mobile
  navigation: {
    direction: { base: 'column', md: 'row' },
    spacing: { base: 2, md: 6 },
    align: { base: 'stretch', md: 'center' },
  },
  
  // Feature cards - stack vertically on mobile, horizontally on tablet+
  features: {
    direction: { base: 'column', md: 'row' },
    spacing: { base: 6, md: 8 },
    align: 'stretch',
  },
  
  // Form layout - single column on mobile, two columns on desktop
  form: {
    direction: { base: 'column', lg: 'row' },
    spacing: { base: 4, lg: 8 },
    align: { base: 'stretch', lg: 'flex-start' },
  },
  
  // Content with sidebar
  sidebar: {
    direction: { base: 'column', lg: 'row' },
    spacing: { base: 6, lg: 8 },
    align: 'flex-start',
  },
  
  // Action buttons
  actions: {
    direction: { base: 'column', sm: 'row' },
    spacing: { base: 3, sm: 4 },
    justify: { base: 'stretch', sm: 'flex-end' },
  },
};

export default ResponsiveStack;
