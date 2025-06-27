import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import ProductCard from '@/components/molecules/ProductCard';
import FilterSidebar from '@/components/molecules/FilterSidebar';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { productService } from '@/services/api/productService';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Customer Rating' },
    { value: 'newest', label: 'Newest First' },
  ];

  useEffect(() => {
    loadProducts();
  }, [categoryName]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [products, filters, sortBy]);

  const loadProducts = async () => {
    setLoading(true);
    setError('');
    
    try {
      const allProducts = await productService.getAll();
      
      // Filter by category if specified
      let categoryProducts = allProducts;
      if (categoryName && categoryName !== 'all') {
        const categoryFilter = categoryName.replace('-', ' ').toLowerCase();
        categoryProducts = allProducts.filter(product => 
          product.category.toLowerCase().includes(categoryFilter)
        );
      }
      
      setProducts(categoryProducts);
    } catch (err) {
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...products];

    // Apply filters
    if (filters.category?.length > 0) {
      filtered = filtered.filter(product =>
        filters.category.includes(product.category)
      );
    }

    if (filters.priceRange?.length > 0) {
      filtered = filtered.filter(product => {
        return filters.priceRange.some(range => {
          if (range === 'Under $25') return product.price < 25;
          if (range === '$25 - $50') return product.price >= 25 && product.price <= 50;
          if (range === '$50 - $100') return product.price >= 50 && product.price <= 100;
          if (range === '$100 - $200') return product.price >= 100 && product.price <= 200;
          if (range === 'Over $200') return product.price > 200;
          return false;
        });
      });
    }

    if (filters.rating?.length > 0) {
      filtered = filtered.filter(product => {
        return filters.rating.some(rating => product.rating >= rating);
      });
    }

    if (filters.brand?.length > 0) {
      filtered = filtered.filter(product =>
        filters.brand.includes(product.brand)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        // Keep original order for featured
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const getCategoryTitle = () => {
    if (!categoryName || categoryName === 'all') return 'All Products';
    return categoryName.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getPaginatedProducts = () => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(filteredProducts.length / productsPerPage);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            <div className="hidden lg:block w-80">
              <div className="bg-white rounded-xl shadow-card p-6">
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="shimmer h-8 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex-1">
              <Loading type="products" count={12} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Error message={error} onRetry={loadProducts} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background"
    >
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold gradient-text">
                {getCategoryTitle()}
              </h1>
              <p className="text-secondary-600 mt-1">
                {filteredProducts.length} products found
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="hidden sm:flex items-center bg-secondary-100 rounded-lg p-1">
                <Button
                  size="sm"
                  variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                  onClick={() => setViewMode('grid')}
                  className="p-2"
                >
                  <ApperIcon name="Grid3X3" size={16} />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'list' ? 'primary' : 'ghost'}
                  onClick={() => setViewMode('list')}
                  className="p-2"
                >
                  <ApperIcon name="List" size={16} />
                </Button>
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Filter Button (Mobile) */}
              <Button
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden"
                variant="outline"
              >
                <ApperIcon name="Filter" size={16} className="mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />

          {/* Products */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <Empty
                type="search"
                title="No products found"
                message="Try adjusting your filters or search terms to find what you're looking for."
                actionLabel="Clear Filters"
                onAction={() => setFilters({})}
              />
            ) : (
              <>
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1'
                }`}>
                  {getPaginatedProducts().map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ProductCard 
                        product={product} 
                        className={viewMode === 'list' ? 'flex flex-row' : ''}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {getTotalPages() > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-12 flex justify-center"
                  >
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className="p-2"
                      >
                        <ApperIcon name="ChevronLeft" size={16} />
                      </Button>

                      {[...Array(getTotalPages())].map((_, index) => {
                        const pageNumber = index + 1;
                        return (
                          <Button
                            key={pageNumber}
                            variant={currentPage === pageNumber ? 'primary' : 'outline'}
                            onClick={() => setCurrentPage(pageNumber)}
                            className="min-w-[40px]"
                          >
                            {pageNumber}
                          </Button>
                        );
                      })}

                      <Button
                        variant="outline"
                        disabled={currentPage === getTotalPages()}
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className="p-2"
                      >
                        <ApperIcon name="ChevronRight" size={16} />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryPage;