import { SimpleGrid, Grid, GridItem } from '@chakra-ui/react';

/**
 * ResponsiveGrid - A responsive grid component that adapts column count based on screen size
 */
export const ResponsiveGrid = ({ 
  children, 
  minChildWidth = "250px",
  spacing = 4,
  columns = { base: 1, md: 2, lg: 3, xl: 4 },
  ...props 
}) => {
  return (
    <SimpleGrid
      columns={columns}
      spacing={spacing}
      minChildWidth={minChildWidth}
      w="full"
      {...props}
    >
      {children}
    </SimpleGrid>
  );
};

/**
 * ResponsiveGridLayout - A more complex grid layout with defined areas
 */
export const ResponsiveGridLayout = ({ 
  children, 
  templateAreas,
  templateColumns,
  templateRows,
  gap = 4,
  ...props 
}) => {
  return (
    <Grid
      templateAreas={templateAreas}
      templateColumns={templateColumns}
      templateRows={templateRows}
      gap={gap}
      w="full"
      h="full"
      {...props}
    >
      {children}
    </Grid>
  );
};

/**
 * ResponsiveGridItem - Grid item with responsive properties
 */
export const ResponsiveGridItem = ({ 
  children, 
  area,
  colSpan = { base: 1, md: 'auto' },
  rowSpan = { base: 1, md: 'auto' },
  ...props 
}) => {
  return (
    <GridItem
      area={area}
      colSpan={colSpan}
      rowSpan={rowSpan}
      {...props}
    >
      {children}
    </GridItem>
  );
};

/**
 * Predefined responsive grid configurations
 */
export const gridConfigs = {
  // Two column layout for tablets and up
  twoColumn: {
    columns: { base: 1, md: 2 },
    spacing: { base: 4, md: 6 },
  },
  
  // Three column layout for desktop
  threeColumn: {
    columns: { base: 1, md: 2, lg: 3 },
    spacing: { base: 4, md: 6, lg: 8 },
  },
  
  // Four column layout for large screens
  fourColumn: {
    columns: { base: 1, sm: 2, md: 3, lg: 4 },
    spacing: { base: 4, md: 6, lg: 8 },
  },
  
  // Card grid with responsive sizing
  cardGrid: {
    minChildWidth: { base: "280px", md: "320px", lg: "350px" },
    spacing: { base: 4, md: 6, lg: 8 },
  },
  
  // Icon grid for navigation or features
  iconGrid: {
    columns: { base: 2, sm: 3, md: 4, lg: 6 },
    spacing: { base: 4, md: 6 },
  },
};

export default ResponsiveGrid;
