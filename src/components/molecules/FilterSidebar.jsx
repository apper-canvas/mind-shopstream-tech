import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';

const FilterSidebar = ({ 
  filters, 
  onFiltersChange, 
  isOpen, 
  onClose,
  className = '' 
}) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    rating: true,
    brand: false
  });

  const categories = [
    'Electronics',
    'Clothing & Fashion',
    'Home & Garden',
    'Sports & Outdoors',
    'Books & Media',
    'Health & Beauty',
    'Toys & Games',
    'Automotive'
  ];

  const brands = [
    'Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'LG', 'Dell', 'HP'
  ];

  const priceRanges = [
    { label: 'Under $25', min: 0, max: 25 },
    { label: '$25 - $50', min: 25, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100 - $200', min: 100, max: 200 },
    { label: 'Over $200', min: 200, max: Infinity }
  ];

  const ratings = [5, 4, 3, 2, 1];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (type, value, checked) => {
    const newFilters = { ...filters };
    
    if (!newFilters[type]) {
      newFilters[type] = [];
    }

    if (checked) {
      newFilters[type] = [...newFilters[type], value];
    } else {
      newFilters[type] = newFilters[type].filter(item => item !== value);
    }

    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).reduce((count, filterArray) => {
      return count + (filterArray?.length || 0);
    }, 0);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <ApperIcon 
            key={i} 
            name="Star" 
            size={12} 
            className={i < rating ? 'text-accent-500 fill-current' : 'text-secondary-300'} 
          />
        ))}
      </div>
    );
  };

  const FilterSection = ({ title, sectionKey, children }) => (
    <div className="border-b border-secondary-200 pb-4">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between py-3 text-left"
      >
        <h3 className="font-semibold text-secondary-800">{title}</h3>
        <motion.div
          animate={{ rotate: expandedSections[sectionKey] ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ApperIcon name="ChevronDown" size={18} className="text-secondary-600" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {expandedSections[sectionKey] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-2 space-y-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const sidebarContent = (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-secondary-200">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-bold text-secondary-800">Filters</h2>
          {getActiveFilterCount() > 0 && (
            <Badge count={getActiveFilterCount()} variant="primary" size="sm" />
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {getActiveFilterCount() > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={clearAllFilters}
              className="text-error-600 hover:text-error-700"
            >
              Clear All
            </Button>
          )}
          
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="lg:hidden"
          >
            <ApperIcon name="X" size={18} />
          </Button>
        </div>
      </div>

      {/* Filter Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Categories */}
        <FilterSection title="Categories" sectionKey="category">
          {categories.map(category => (
            <label key={category} className="flex items-center space-x-3 cursor-pointer hover:bg-secondary-50 p-2 rounded-lg transition-colors">
              <input
                type="checkbox"
                checked={filters.category?.includes(category) || false}
                onChange={(e) => handleFilterChange('category', category, e.target.checked)}
                className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-secondary-700">{category}</span>
            </label>
          ))}
        </FilterSection>

        {/* Price Range */}
        <FilterSection title="Price Range" sectionKey="price">
          {priceRanges.map(range => (
            <label key={range.label} className="flex items-center space-x-3 cursor-pointer hover:bg-secondary-50 p-2 rounded-lg transition-colors">
              <input
                type="checkbox"
                checked={filters.priceRange?.includes(range.label) || false}
                onChange={(e) => handleFilterChange('priceRange', range.label, e.target.checked)}
                className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-secondary-700">{range.label}</span>
            </label>
          ))}
        </FilterSection>

        {/* Rating */}
        <FilterSection title="Customer Rating" sectionKey="rating">
          {ratings.map(rating => (
            <label key={rating} className="flex items-center space-x-3 cursor-pointer hover:bg-secondary-50 p-2 rounded-lg transition-colors">
              <input
                type="checkbox"
                checked={filters.rating?.includes(rating) || false}
                onChange={(e) => handleFilterChange('rating', rating, e.target.checked)}
                className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
              />
              <div className="flex items-center space-x-2">
                {renderStars(rating)}
                <span className="text-secondary-700">& Up</span>
              </div>
            </label>
          ))}
        </FilterSection>

        {/* Brands */}
        <FilterSection title="Brands" sectionKey="brand">
          {brands.map(brand => (
            <label key={brand} className="flex items-center space-x-3 cursor-pointer hover:bg-secondary-50 p-2 rounded-lg transition-colors">
              <input
                type="checkbox"
                checked={filters.brand?.includes(brand) || false}
                onChange={(e) => handleFilterChange('brand', brand, e.target.checked)}
                className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-secondary-700">{brand}</span>
            </label>
          ))}
        </FilterSection>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`lg:relative lg:translate-x-0 fixed top-0 left-0 h-full w-80 bg-white shadow-premium z-50 ${className}`}
      >
        {sidebarContent}
      </motion.div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 bg-white rounded-xl shadow-card sticky top-6 h-fit">
        {sidebarContent}
      </div>
    </>
  );
};

export default FilterSidebar;