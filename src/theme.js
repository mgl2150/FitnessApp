import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  // Responsive breakpoints
  breakpoints: {
    base: '0px',      // Mobile: 0px - 767px
    sm: '320px',      // Small mobile: 320px+
    md: '768px',      // Tablet: 768px - 1023px
    lg: '1024px',     // Desktop: 1024px - 1439px
    xl: '1440px',     // Large desktop: 1440px+
    '2xl': '1920px',  // Extra large: 1920px+
  },
  colors: {
    brand: {
      50: '#E6F7FF',
      100: '#BAE7FF',
      200: '#91D5FF',
      300: '#69C0FF',
      400: '#40A9FF',
      500: '#1890FF',
      600: '#096DD9',
      700: '#0050B3',
      800: '#003A8C',
      900: '#002766',
    },
    primary: {
      50: '#F0F9FF',
      100: '#E0F2FE',
      200: '#BAE6FD',
      300: '#7DD3FC',
      400: '#38BDF8',
      500: '#0EA5E9',
      600: '#0284C7',
      700: '#0369A1',
      800: '#075985',
      900: '#0C4A6E',
    },
    secondary: {
      50: '#FDF4FF',
      100: '#FAE8FF',
      200: '#F5D0FE',
      300: '#F0ABFC',
      400: '#E879F9',
      500: '#D946EF',
      600: '#C026D3',
      700: '#A21CAF',
      800: '#86198F',
      900: '#701A75',
    },
    success: {
      50: '#F0FDF4',
      100: '#DCFCE7',
      200: '#BBF7D0',
      300: '#86EFAC',
      400: '#4ADE80',
      500: '#22C55E',
      600: '#16A34A',
      700: '#15803D',
      800: '#166534',
      900: '#14532D',
    },
    warning: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      200: '#FDE68A',
      300: '#FCD34D',
      400: '#FBBF24',
      500: '#F59E0B',
      600: '#D97706',
      700: '#B45309',
      800: '#92400E',
      900: '#78350F',
    },
    error: {
      50: '#FEF2F2',
      100: '#FEE2E2',
      200: '#FECACA',
      300: '#FCA5A5',
      400: '#F87171',
      500: '#EF4444',
      600: '#DC2626',
      700: '#B91C1C',
      800: '#991B1B',
      900: '#7F1D1D',
    },
  },
  fonts: {
    heading: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem',
    '8xl': '6rem',
    '9xl': '8rem',
  },
  // Responsive spacing scale
  space: {
    px: '1px',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    28: '7rem',
    32: '8rem',
    36: '9rem',
    40: '10rem',
    44: '11rem',
    48: '12rem',
    52: '13rem',
    56: '14rem',
    60: '15rem',
    64: '16rem',
    72: '18rem',
    80: '20rem',
    96: '24rem',
  },
  // Responsive container sizes
  sizes: {
    container: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    // App-specific container sizes
    app: {
      mobile: '450px',
      tablet: '768px',
      desktop: '1200px',
      wide: '1440px',
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'lg',
      },
      sizes: {
        sm: {
          fontSize: 'sm',
          px: 4,
          py: 3,
        },
        md: {
          fontSize: 'md',
          px: 6,
          py: 4,
        },
        lg: {
          fontSize: 'lg',
          px: 8,
          py: 5,
        },
        // Responsive button sizes
        responsive: {
          fontSize: { base: 'sm', md: 'md', lg: 'lg' },
          px: { base: 4, md: 6, lg: 8 },
          py: { base: 3, md: 4, lg: 5 },
        },
      },
      variants: {
        solid: {
          bg: 'primary.500',
          color: 'white',
          _hover: {
            bg: 'primary.600',
          },
          _active: {
            bg: 'primary.700',
          },
        },
        outline: {
          border: '2px solid',
          borderColor: 'primary.500',
          color: 'primary.500',
          _hover: {
            bg: 'primary.50',
          },
          _active: {
            bg: 'primary.100',
          },
        },
        ghost: {
          color: 'primary.500',
          _hover: {
            bg: 'primary.50',
          },
          _active: {
            bg: 'primary.100',
          },
        },
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            borderColor: 'gray.300',
            _hover: {
              borderColor: 'primary.300',
            },
            _focus: {
              borderColor: 'primary.500',
              boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
            },
          },
        },
      },
    },
    // Responsive Container component
    Container: {
      baseStyle: {
        maxW: '100%',
        mx: 'auto',
        px: { base: 4, md: 6, lg: 8 },
      },
      variants: {
        // App-specific container variants
        app: {
          maxW: { base: 'app.mobile', md: 'app.tablet', lg: 'app.desktop', xl: 'app.wide' },
          bg: '#232323',
          minH: { base: '100vh', md: 'auto' },
          border: { base: '1px solid white', md: 'none' },
          borderRadius: { base: 'xl', md: 'none' },
          overflow: 'hidden',
        },
        content: {
          maxW: { base: '100%', md: 'container.md', lg: 'container.lg', xl: 'container.xl' },
          px: { base: 4, md: 6, lg: 8 },
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: '#232323',
        color: 'white',
        // Smooth transitions for responsive changes
        transition: 'all 0.2s ease-in-out',
      },
      '*': {
        borderColor: 'gray.600 !important',
      },
      // Responsive text utility class
      '.responsive-text': {
        fontSize: { base: 'md', md: 'lg', lg: 'xl' },
      },
    },
  },
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
    // Performance optimizations
    cssVarPrefix: 'chakra',
    disableGlobalStyle: false,
  },
});

export default theme;
