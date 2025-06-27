import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { useCart } from '@/hooks/useCart';

const CartItem = ({ item, className = '' }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(item.id);
    } else {
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`bg-white rounded-xl shadow-card p-4 hover:shadow-card-hover transition-all duration-300 ${className}`}
    >
      <div className="flex items-center space-x-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-secondary-800 truncate">
            {item.name}
          </h3>
          <p className="text-sm text-secondary-600 mt-1">
            {formatPrice(item.price)} each
          </p>
          
          {/* Mobile: Stack quantity and total */}
          <div className="sm:hidden mt-2 space-y-2">
            <div className="flex items-center space-x-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleQuantityChange(item.quantity - 1)}
                className="p-2 w-8 h-8 flex items-center justify-center"
              >
                <ApperIcon name="Minus" size={14} />
              </Button>
              
              <span className="font-semibold text-secondary-800 min-w-[2rem] text-center">
                {item.quantity}
              </span>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleQuantityChange(item.quantity + 1)}
                className="p-2 w-8 h-8 flex items-center justify-center"
              >
                <ApperIcon name="Plus" size={14} />
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold gradient-text">
                {formatPrice(item.price * item.quantity)}
              </div>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={handleRemove}
                className="text-error-600 hover:text-error-700 hover:bg-error-50 p-2"
              >
                <ApperIcon name="Trash2" size={16} />
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop: Quantity Controls */}
        <div className="hidden sm:flex items-center space-x-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className="p-2 w-10 h-10 flex items-center justify-center"
          >
            <ApperIcon name="Minus" size={16} />
          </Button>
          
          <span className="font-semibold text-secondary-800 min-w-[3rem] text-center text-lg">
            {item.quantity}
          </span>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="p-2 w-10 h-10 flex items-center justify-center"
          >
            <ApperIcon name="Plus" size={16} />
          </Button>
        </div>

        {/* Desktop: Price and Remove */}
        <div className="hidden sm:flex items-center space-x-6">
          <div className="text-right">
            <div className="text-2xl font-bold gradient-text">
              {formatPrice(item.price * item.quantity)}
            </div>
          </div>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={handleRemove}
            className="text-error-600 hover:text-error-700 hover:bg-error-50 p-3"
          >
            <ApperIcon name="Trash2" size={18} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;