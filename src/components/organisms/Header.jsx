import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import SearchBar from '@/components/molecules/SearchBar';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import { useCart } from '@/hooks/useCart';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { getTotalItems } = useCart();

  const navigation = [
    { name: 'Home', href: '/', icon: 'Home' },
    { name: 'Electronics', href: '/category/electronics', icon: 'Smartphone' },
    { name: 'Fashion', href: '/category/fashion', icon: 'Shirt' },
    { name: 'Home & Garden', href: '/category/home-garden', icon: 'Home' },
    { name: 'Sports', href: '/category/sports', icon: 'Dumbbell' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-white shadow-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg"
            >
              <ApperIcon name="ShoppingBag" size={24} className="text-white" />
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold gradient-text">ShopStream</h1>
              <p className="text-xs text-secondary-600 -mt-1">Premium Shopping</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                    : 'text-secondary-700 hover:text-primary-600 hover:bg-primary-50'
                }`}
              >
                <ApperIcon name={item.icon} size={18} />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-xl mx-8">
            <SearchBar />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-secondary-600 hover:text-primary-600"
            >
              <ApperIcon name="Search" size={20} />
            </Button>

            {/* Wishlist */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex text-secondary-600 hover:text-primary-600 relative"
            >
              <ApperIcon name="Heart" size={20} />
              <Badge count={3} className="absolute -top-2 -right-2" />
            </Button>

            {/* Cart */}
            <Link to="/cart" className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="text-secondary-600 hover:text-primary-600 relative"
              >
                <ApperIcon name="ShoppingCart" size={20} />
                <Badge 
                  count={getTotalItems()} 
                  className="absolute -top-2 -right-2"
                  variant="primary"
                />
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-secondary-600 hover:text-primary-600"
            >
              <ApperIcon name={isMenuOpen ? "X" : "Menu"} size={20} />
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <SearchBar />
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-secondary-200"
          >
            <div className="max-w-7xl mx-auto px-4 py-4">
              <nav className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                        : 'text-secondary-700 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    <ApperIcon name={item.icon} size={20} />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>

              <div className="mt-4 pt-4 border-t border-secondary-200">
                <Link
                  to="/wishlist"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-secondary-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-300"
                >
                  <ApperIcon name="Heart" size={20} />
                  <span>Wishlist</span>
                  <Badge count={3} variant="primary" size="sm" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;