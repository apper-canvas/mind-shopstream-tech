import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import ProductCard from '@/components/molecules/ProductCard';
import SearchBar from '@/components/molecules/SearchBar';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { productService } from '@/services/api/productService';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid');

  const query = searchParams.get('q') || '';

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Customer Rating' },
    { value: 'newest', label: 'Newest First' },
  ];

  useEffect(() => {
    if (query) {
      searchProducts();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    applySorting();
  }, [sortBy]);

  const searchProducts = async () => {
    setLoading(true);
    setError('');
    
    try {
      const allProducts = await productService.getAll();
      
      // Filter products based on search query
      const searchTerms = query.toLowerCase().split(' ');
      const filtered = allProducts.filter(product => {
        const searchableText = `${product.name} ${product.description} ${product.category}`.toLowerCase();
        return searchTerms.some(term => searchableText.includes(term));
      });
      
      setProducts(filtered);
    } catch (err) {
      setError('Failed to search products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applySorting = () => {
    if (products.length === 0) return;

    let sorted = [...products];
    
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        sorted.sort((a, b) => b.id - a.id);
        break;
      default:
        // Keep relevance order (search result order)
        break;
    }

    setProducts(sorted);
  };

  const handleNewSearch = (newQuery) => {
    setSearchParams({ q: newQuery });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="shimmer h-8 bg-gray-200 rounded w-64 mb-4"></div>
            <div className="shimmer h-6 bg-gray-200 rounded w-48"></div>
          </div>
          <Loading type="products" count={12} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Error message={error} onRetry={searchProducts} />
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
          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar 
              onSearch={handleNewSearch}
              placeholder="Search for products..."
              className="max-w-4xl mx-auto"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold gradient-text">
                {query ? `Search Results for "${query}"` : 'Search Products'}
              </h1>
              {query && (
                <p className="text-secondary-600 mt-1">
                  {products.length} {products.length === 1 ? 'product' : 'products'} found
                </p>
              )}
            </div>

            {query && products.length > 0 && (
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
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!query ? (
          // No search query - show popular categories or suggestions
          <div className="text-center py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ApperIcon name="Search" size={64} className="text-secondary-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-secondary-800 mb-4">
                Find What You're Looking For
              </h2>
              <p className="text-secondary-600 mb-8 max-w-lg mx-auto">
                Enter a search term above to discover amazing products, or browse our popular categories below.
              </p>
              
              {/* Popular Categories */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
                {[
                  { name: 'Electronics', icon: 'Smartphone' },
                  { name: 'Fashion', icon: 'Shirt' },
                  { name: 'Home', icon: 'Home' },
                  { name: 'Sports', icon: 'Dumbbell' },
                  { name: 'Books', icon: 'Book' },
                  { name: 'Beauty', icon: 'Heart' }
                ].map((category, index) => (
                  <motion.button
                    key={category.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -2 }}
                    onClick={() => handleNewSearch(category.name)}
                    className="p-4 bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 text-center"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <ApperIcon name={category.icon} size={24} className="text-white" />
                    </div>
                    <span className="text-sm font-medium text-secondary-800">
                      {category.name}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        ) : products.length === 0 ? (
          <Empty
            type="search"
            title="No results found"
            message={`We couldn't find any products matching "${query}". Try different keywords or check the spelling.`}
            actionLabel="Browse Categories"
            onAction={() => setSearchParams({})}
          />
        ) : (
          <>
            {/* Search Results */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {products.map((product, index) => (
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

            {/* Load More Button (for future pagination) */}
            {products.length > 0 && products.length % 12 === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mt-12"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-3"
                >
                  Load More Products
                </Button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default SearchPage;