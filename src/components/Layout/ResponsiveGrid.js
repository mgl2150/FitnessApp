import { SimpleGrid } from '@chakra-ui/react';

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

export default ResponsiveGrid;
