import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Error = ({ 
  message = "Something went wrong", 
  onRetry, 
  showRetry = true,
  type = 'general' 
}) => {
  const getErrorIcon = () => {
    switch (type) {
      case 'network':
        return 'WifiOff';
      case 'not-found':
        return 'Search';
      case 'cart':
        return 'ShoppingCart';
      default:
        return 'AlertCircle';
    }
  };

  const getErrorTitle = () => {
    switch (type) {
      case 'network':
        return 'Connection Error';
      case 'not-found':
        return 'Nothing Found';
      case 'cart':
        return 'Cart Error';
      default:
        return 'Oops! Something went wrong';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-20 h-20 rounded-full bg-gradient-to-br from-error-100 to-error-200 flex items-center justify-center mb-6"
      >
        <ApperIcon 
          name={getErrorIcon()} 
          size={40} 
          className="text-error-500" 
        />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-display font-bold text-secondary-800 mb-3"
      >
        {getErrorTitle()}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-secondary-600 text-lg mb-8 max-w-md leading-relaxed"
      >
        {message}
      </motion.p>

      {showRetry && onRetry && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={onRetry}
            className="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <ApperIcon name="RefreshCw" size={20} className="mr-2" />
            Try Again
          </Button>
        </motion.div>
      )}

      {type === 'not-found' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6"
        >
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="px-6 py-2 border-2 border-secondary-300 text-secondary-700 hover:border-primary-500 hover:text-primary-600 rounded-xl transition-all duration-300"
          >
            <ApperIcon name="ArrowLeft" size={18} className="mr-2" />
            Go Back
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Error;