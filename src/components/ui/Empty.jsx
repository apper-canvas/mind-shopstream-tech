import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Empty = ({ 
  type = 'products',
  title,
  message,
  actionLabel,
  onAction,
  showAction = true 
}) => {
  const getEmptyConfig = () => {
    switch (type) {
      case 'cart':
        return {
          icon: 'ShoppingCart',
          title: title || 'Your cart is empty',
          message: message || 'Discover amazing products and start shopping to fill your cart with items you love.',
          actionLabel: actionLabel || 'Start Shopping',
          gradient: 'from-primary-100 to-accent-100',
          iconColor: 'text-primary-500'
        };
      case 'search':
        return {
          icon: 'Search',
          title: title || 'No results found',
          message: message || 'We couldn\'t find any products matching your search. Try different keywords or browse our categories.',
          actionLabel: actionLabel || 'Browse Categories',
          gradient: 'from-secondary-100 to-primary-100',
          iconColor: 'text-secondary-500'
        };
      case 'wishlist':
        return {
          icon: 'Heart',
          title: title || 'No favorites yet',
          message: message || 'Save products you love to easily find them later and never miss out on great deals.',
          actionLabel: actionLabel || 'Explore Products',
          gradient: 'from-accent-100 to-primary-100',
          iconColor: 'text-accent-500'
        };
      default:
        return {
          icon: 'Package',
          title: title || 'No products available',
          message: message || 'We\'re working hard to bring you amazing products. Check back soon for new arrivals!',
          actionLabel: actionLabel || 'Explore Other Categories',
          gradient: 'from-primary-100 to-secondary-100',
          iconColor: 'text-primary-500'
        };
    }
  };

  const config = getEmptyConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className={`w-32 h-32 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center mb-8 shadow-lg`}
      >
        <ApperIcon 
          name={config.icon} 
          size={60} 
          className={config.iconColor} 
        />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-3xl font-display font-bold gradient-text mb-4"
      >
        {config.title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-secondary-600 text-lg mb-10 max-w-lg leading-relaxed"
      >
        {config.message}
      </motion.p>

      {showAction && onAction && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={onAction}
            className="px-10 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <ApperIcon name="ArrowRight" size={20} className="mr-2" />
            {config.actionLabel}
          </Button>
        </motion.div>
      )}

      {type === 'cart' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-md"
        >
          {['Electronics', 'Fashion', 'Home', 'Sports'].map((category, index) => (
            <motion.button
              key={category}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="p-3 bg-white rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 hover:scale-105 text-sm font-medium text-secondary-700 hover:text-primary-600"
            >
              {category}
            </motion.button>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Empty;