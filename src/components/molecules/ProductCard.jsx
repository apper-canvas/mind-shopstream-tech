import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import { useCart } from '@/hooks/useCart';

const ProductCard = ({ product, className = '' }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center space-x-1">
        {[...Array(fullStars)].map((_, i) => (
          <ApperIcon key={i} name="Star" size={14} className="text-accent-500 fill-current" />
        ))}
        {hasHalfStar && (
          <ApperIcon name="Star" size={14} className="text-accent-500 fill-current opacity-50" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <ApperIcon key={i} name="Star" size={14} className="text-secondary-300" />
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group ${className}`}
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden">
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            src={product.images[0]}
            alt={product.name}
            className="w-full h-48 sm:h-56 object-cover"
          />
          
          {/* Overlay with quick actions */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1 }}
              className="opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  className="bg-white text-secondary-700 hover:text-primary-600 shadow-lg"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <ApperIcon name="Eye" size={16} />
                </Button>
                <Button
                  size="sm"
                  className="bg-white text-secondary-700 hover:text-error-600 shadow-lg"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <ApperIcon name="Heart" size={16} />
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col space-y-2">
            {!product.inStock && (
              <Badge variant="error" size="sm">
                Out of Stock
              </Badge>
            )}
            {product.isNew && (
              <Badge variant="success" size="sm">
                New
              </Badge>
            )}
            {product.discount && (
              <Badge variant="warning" size="sm">
                -{product.discount}%
              </Badge>
            )}
          </div>
        </div>

        <div className="p-4">
          <div className="mb-2">
            <h3 className="text-lg font-semibold text-secondary-800 group-hover:text-primary-600 transition-colors duration-300 line-clamp-2">
              {product.name}
            </h3>
            <p className="text-sm text-secondary-600 mt-1 line-clamp-2">
              {product.description}
            </p>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              {renderStars(product.rating)}
              <span className="text-sm text-secondary-600">
                ({product.reviews})
              </span>
            </div>
            <div className="text-right">
              {product.originalPrice && (
                <span className="text-sm text-secondary-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              <div className="text-xl font-bold gradient-text">
                {formatPrice(product.price)}
              </div>
            </div>
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <ApperIcon name="ShoppingCart" size={18} className="mr-2" />
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;