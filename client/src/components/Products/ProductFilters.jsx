import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Slider,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Divider,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Rating,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import api from '../../services/api';

const ProductFilters = ({ filters, onFilterChange }) => {
  const [filtersData, setFiltersData] = useState({
    categories: [],
    brands: [],
    tags: [],
    priceRange: { minPrice: 0, maxPrice: 1000 },
  });

  useEffect(() => {
    fetchFiltersData();
  }, []);

  const fetchFiltersData = async () => {
    try {
      const response = await api.get('/products/filters/data');
      setFiltersData(response.data);
    } catch (error) {
      console.error('Failed to load filters');
    }
  };

  const handlePriceChange = (event, newValue) => {
    onFilterChange({ ...filters, minPrice: newValue[0], maxPrice: newValue[1] });
  };

  const handleCategoryChange = (categoryId) => {
    onFilterChange({ ...filters, category: categoryId });
  };

  const handleRatingChange = (rating) => {
    onFilterChange({ ...filters, rating });
  };

  const handleSortChange = (event) => {
    onFilterChange({ ...filters, sort: event.target.value });
  };

  const handleClearFilters = () => {
    onFilterChange({
      search: '',
      category: '',
      minPrice: filtersData.priceRange.minPrice,
      maxPrice: filtersData.priceRange.maxPrice,
      rating: 0,
      sort: 'newest',
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Filters</Typography>
        <Button size="small" onClick={handleClearFilters}>
          Clear All
        </Button>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Sort */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Sort By</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl component="fieldset">
            <RadioGroup value={filters.sort || 'newest'} onChange={handleSortChange}>
              <FormControlLabel value="newest" control={<Radio />} label="Newest" />
              <FormControlLabel value="popular" control={<Radio />} label="Most Popular" />
              <FormControlLabel value="price-asc" control={<Radio />} label="Price: Low to High" />
              <FormControlLabel value="price-desc" control={<Radio />} label="Price: High to Low" />
              <FormControlLabel value="rating" control={<Radio />} label="Highest Rated" />
            </RadioGroup>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      {/* Categories */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Categories</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl component="fieldset">
            <RadioGroup
              value={filters.category || ''}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <FormControlLabel value="" control={<Radio />} label="All Categories" />
              {filtersData.categories.map((category) => (
                <FormControlLabel
                  key={category._id}
                  value={category._id}
                  control={<Radio />}
                  label={category.name}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      {/* Price Range */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Price Range</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ px: 1 }}>
            <Slider
              value={[filters.minPrice || filtersData.priceRange.minPrice, filters.maxPrice || filtersData.priceRange.maxPrice]}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={filtersData.priceRange.minPrice}
              max={filtersData.priceRange.maxPrice}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2">${filters.minPrice || filtersData.priceRange.minPrice}</Typography>
              <Typography variant="body2">${filters.maxPrice || filtersData.priceRange.maxPrice}</Typography>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Rating */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Rating</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl component="fieldset">
            <RadioGroup
              value={filters.rating || 0}
              onChange={(e) => handleRatingChange(Number(e.target.value))}
            >
              <FormControlLabel
                value={0}
                control={<Radio />}
                label="All Ratings"
              />
              {[4, 3, 2, 1].map((rating) => (
                <FormControlLabel
                  key={rating}
                  value={rating}
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating value={rating} readOnly size="small" />
                      <Typography variant="body2">& Up</Typography>
                    </Box>
                  }
                />
              ))}
            </RadioGroup>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      {/* Brands */}
      {filtersData.brands.length > 0 && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Brands</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              {filtersData.brands.map((brand) => (
                <FormControlLabel
                  key={brand}
                  control={<Checkbox />}
                  label={brand}
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
};

export default ProductFilters;
