import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';

const SearchBar = ({ className = '', onSearch, placeholder = "Search products..." }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches] = useState(['iPhone', 'Nike Shoes', 'Gaming Laptop', 'Bluetooth Headphones']);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      // Mock suggestions based on query
      const mockSuggestions = [
        'iPhone 15 Pro',
        'iPad Air',
        'MacBook Pro',
        'AirPods Pro',
        'Apple Watch',
        'Nike Air Max',
        'Adidas Ultraboost',
        'Samsung Galaxy',
        'Sony Headphones',
        'Dell Laptop'
      ].filter(item => 
        item.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      
      setSuggestions(mockSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      if (onSearch) onSearch(query.trim());
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
    setIsOpen(false);
    if (onSearch) onSearch(suggestion);
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const clearSearch = () => {
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className={`relative w-full max-w-2xl ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          icon="Search"
          className="pr-12 bg-white/90 backdrop-blur-sm border-secondary-200 focus:border-primary-500 focus:bg-white shadow-lg"
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {query && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              type="button"
              onClick={clearSearch}
              className="p-1 text-secondary-400 hover:text-secondary-600 transition-colors"
            >
              <ApperIcon name="X" size={16} />
            </motion.button>
          )}
          
          <button
            type="submit"
            className="p-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <ApperIcon name="Search" size={16} />
          </button>
        </div>
      </form>

      <AnimatePresence>
        {isOpen && (query || recentSearches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-premium border border-secondary-200 z-50 max-h-80 overflow-y-auto"
          >
            {suggestions.length > 0 && (
              <div className="p-4">
                <h4 className="text-sm font-semibold text-secondary-700 mb-3 flex items-center">
                  <ApperIcon name="Search" size={16} className="mr-2" />
                  Suggestions
                </h4>
                <div className="space-y-1">
                  {suggestions.map((suggestion, index) => (
                    <motion.button
                      key={suggestion}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-3 py-2 text-secondary-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors duration-200 flex items-center"
                    >
                      <ApperIcon name="TrendingUp" size={14} className="mr-3 text-secondary-400" />
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {!query && recentSearches.length > 0 && (
              <div className="p-4 border-t border-secondary-100">
                <h4 className="text-sm font-semibold text-secondary-700 mb-3 flex items-center">
                  <ApperIcon name="Clock" size={16} className="mr-2" />
                  Recent Searches
                </h4>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <motion.button
                      key={search}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleSuggestionClick(search)}
                      className="w-full text-left px-3 py-2 text-secondary-600 hover:bg-secondary-50 hover:text-secondary-800 rounded-lg transition-colors duration-200 flex items-center"
                    >
                      <ApperIcon name="History" size={14} className="mr-3 text-secondary-400" />
                      {search}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;