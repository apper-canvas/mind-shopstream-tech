import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ProductCard from '@/components/molecules/ProductCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { productService } from '@/services/api/productService';
import { useCart } from '@/hooks/useCart';
import { toast } from 'react-toastify';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    loadProductDetail();
  }, [productId]);

  const loadProductDetail = async () => {
    setLoading(true);
    setError('');
    
    try {
      const productData = await productService.getById(parseInt(productId));
      setProduct(productData);
      setSelectedImage(0);
      
      // Load related products
      const allProducts = await productService.getAll();
      const related = allProducts
        .filter(p => p.id !== productData.id && p.category === productData.category)
        .slice(0, 4);
      setRelatedProducts(related);
      
    } catch (err) {
      setError('Product not found or failed to load.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product.inStock) {
      toast.error('This product is currently out of stock');
      return;
    }
    
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    
    toast.success(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart`);
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
          <ApperIcon key={i} name="Star" size={20} className="text-accent-500 fill-current" />
        ))}
        {hasHalfStar && (
          <ApperIcon name="Star" size={20} className="text-accent-500 fill-current opacity-50" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <ApperIcon key={i} name="Star" size={20} className="text-secondary-300" />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Loading type="detail" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Error 
          message={error || "Product not found"} 
          onRetry={loadProductDetail}
          type="not-found"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-secondary-600 mb-8">
          <Link to="/" className="hover:text-primary-600 transition-colors">
            Home
          </Link>
          <ApperIcon name="ChevronRight" size={16} />
          <Link 
            to={`/category/${product.category.toLowerCase().replace(' ', '-')}`}
            className="hover:text-primary-600 transition-colors"
          >
            {product.category}
          </Link>
          <ApperIcon name="ChevronRight" size={16} />
          <span className="text-secondary-800 font-medium truncate">
            {product.name}
          </span>
        </nav>

        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square bg-white rounded-2xl shadow-card overflow-hidden"
            >
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            {/* Thumbnail Navigation */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === index 
                        ? 'border-primary-500 shadow-lg' 
                        : 'border-secondary-200 hover:border-primary-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl sm:text-4xl font-bold text-secondary-800 mb-4"
              >
                {product.name}
              </motion.h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  {renderStars(product.rating)}
                  <span className="text-lg font-medium text-secondary-700">
                    {product.rating}
                  </span>
                </div>
                <span className="text-secondary-600">
                  ({product.reviews} reviews)
                </span>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                {product.originalPrice && (
                  <span className="text-2xl text-secondary-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                <span className="text-4xl font-bold gradient-text">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <Badge variant="success" size="md">
                    Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </Badge>
                )}
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <Badge 
                  variant={product.inStock ? 'success' : 'error'}
                  size="md"
                >
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </Badge>
                {product.isNew && (
                  <Badge variant="primary" size="md">
                    New Arrival
                  </Badge>
                )}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-secondary-700">
                  Quantity:
                </label>
                <div className="flex items-center space-x-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-2 w-10 h-10"
                  >
                    <ApperIcon name="Minus" size={16} />
                  </Button>
                  
                  <span className="text-xl font-semibold text-secondary-800 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 w-10 h-10"
                  >
                    <ApperIcon name="Plus" size={16} />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white py-4 text-lg font-semibold"
                >
                  <ApperIcon name="ShoppingCart" size={20} className="mr-2" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  className="px-6 py-4 border-2 border-error-500 text-error-600 hover:bg-error-500 hover:text-white"
                >
                  <ApperIcon name="Heart" size={20} />
                </Button>
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-secondary-50 rounded-xl p-6 space-y-3">
              <div className="flex items-center space-x-3">
                <ApperIcon name="Truck" size={20} className="text-success-600" />
                <span className="text-secondary-700">Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center space-x-3">
                <ApperIcon name="RotateCcw" size={20} className="text-primary-600" />
                <span className="text-secondary-700">30-day return policy</span>
              </div>
              <div className="flex items-center space-x-3">
                <ApperIcon name="Shield" size={20} className="text-warning-600" />
                <span className="text-secondary-700">2-year warranty included</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden mb-16">
          <div className="flex border-b border-secondary-200">
            {[
              { id: 'description', label: 'Description', icon: 'FileText' },
              { id: 'specifications', label: 'Specifications', icon: 'Settings' },
              { id: 'reviews', label: 'Reviews', icon: 'Star' },
              { id: 'shipping', label: 'Shipping', icon: 'Truck' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white'
                    : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
                }`}
              >
                <ApperIcon name={tab.icon} size={18} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {activeTab === 'description' && (
                <motion.div
                  key="description"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="prose max-w-none"
                >
                  <p className="text-lg text-secondary-700 leading-relaxed">
                    {product.description}
                  </p>
                </motion.div>
              )}
              
              {activeTab === 'specifications' && (
                <motion.div
                  key="specifications"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-secondary-800 mb-3">General</h4>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-secondary-600">Brand</dt>
                          <dd className="text-secondary-800 font-medium">{product.brand || 'Generic'}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-secondary-600">Category</dt>
                          <dd className="text-secondary-800 font-medium">{product.category}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-secondary-600">SKU</dt>
                          <dd className="text-secondary-800 font-medium">SKU-{product.id}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {activeTab === 'reviews' && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="text-center py-12">
                    <ApperIcon name="Star" size={48} className="text-accent-500 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold text-secondary-800 mb-2">
                      Customer Reviews Coming Soon
                    </h4>
                    <p className="text-secondary-600">
                      Be the first to review this product and help other customers make informed decisions.
                    </p>
                  </div>
                </motion.div>
              )}
              
              {activeTab === 'shipping' && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold text-secondary-800 mb-4">Shipping Options</h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 bg-success-50 rounded-lg">
                          <ApperIcon name="Truck" size={20} className="text-success-600" />
                          <div>
                            <p className="font-medium text-success-800">Free Standard Shipping</p>
                            <p className="text-sm text-success-600">5-7 business days</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-primary-50 rounded-lg">
                          <ApperIcon name="Zap" size={20} className="text-primary-600" />
                          <div>
                            <p className="font-medium text-primary-800">Express Shipping - $9.99</p>
                            <p className="text-sm text-primary-600">2-3 business days</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-secondary-800 mb-4">Return Policy</h4>
                      <p className="text-secondary-600 leading-relaxed">
                        Not satisfied? Return your item within 30 days for a full refund. 
                        Items must be in original condition with all packaging.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold gradient-text mb-8"
            >
              Related Products
            </motion.h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard product={relatedProduct} />
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </motion.div>
  );
};

export default ProductDetailPage;