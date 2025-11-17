import { Skeleton, Card, CardContent, Grid, Box } from '@mui/material';

export const ProductCardSkeleton = () => (
  <Card>
    <Skeleton variant="rectangular" height={250} />
    <CardContent>
      <Skeleton variant="text" width="60%" height={30} />
      <Skeleton variant="text" width="40%" />
      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
        <Skeleton variant="rectangular" width="70%" height={40} />
        <Skeleton variant="circular" width={40} height={40} />
      </Box>
    </CardContent>
  </Card>
);

export const ProductGridSkeleton = ({ count = 6 }) => (
  <Grid container spacing={3}>
    {Array.from({ length: count }).map((_, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <ProductCardSkeleton />
      </Grid>
    ))}
  </Grid>
);

export const TableSkeleton = ({ rows = 5, columns = 5 }) => (
  <Box>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <Box key={rowIndex} sx={{ display: 'flex', gap: 2, mb: 2 }}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton key={colIndex} variant="rectangular" height={40} sx={{ flex: 1 }} />
        ))}
      </Box>
    ))}
  </Box>
);

export const DetailPageSkeleton = () => (
  <Grid container spacing={4}>
    <Grid item xs={12} md={6}>
      <Skeleton variant="rectangular" height={500} />
    </Grid>
    <Grid item xs={12} md={6}>
      <Skeleton variant="text" width="80%" height={50} />
      <Skeleton variant="text" width="60%" height={30} sx={{ mt: 2 }} />
      <Skeleton variant="rectangular" height={100} sx={{ mt: 2 }} />
      <Skeleton variant="rectangular" height={60} sx={{ mt: 2 }} />
    </Grid>
  </Grid>
);

export const DashboardCardSkeleton = () => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" height={40} />
        </Box>
        <Skeleton variant="circular" width={56} height={56} />
      </Box>
    </CardContent>
  </Card>
);
