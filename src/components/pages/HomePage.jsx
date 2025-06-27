import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import ProductCard from '@/components/molecules/ProductCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { productService } from '@/services/api/productService';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categories = [
    {
      name: 'Electronics',
      icon: 'Smartphone',
      color: 'from-blue-500 to-purple-600',
      href: '/category/electronics'
    },
    {
      name: 'Fashion',
      icon: 'Shirt',
      color: 'from-pink-500 to-red-600',
      href: '/category/fashion'
    },
    {
      name: 'Home & Garden',
      icon: 'Home',
      color: 'from-green-500 to-teal-600',
      href: '/category/home-garden'
    },
    {
      name: 'Sports',
      icon: 'Dumbbell',
      color: 'from-orange-500 to-yellow-600',
      href: '/category/sports'
    },
    {
      name: 'Books',
      icon: 'Book',
      color: 'from-indigo-500 to-blue-600',
      href: '/category/books'
    },
    {
      name: 'Health & Beauty',
      icon: 'Heart',
      color: 'from-pink-500 to-purple-600',
      href: '/category/health-beauty'
    },
  ];

  const deals = [
    {
      title: 'Flash Sale',
      description: 'Up to 70% off on selected items',
      icon: 'Zap',
      color: 'from-red-500 to-pink-600',
      badge: 'Limited Time'
    },
    {
      title: 'Free Shipping',
      description: 'On orders over $50',
      icon: 'Truck',
      color: 'from-blue-500 to-indigo-600',
      badge: 'All Orders'
    },
    {
      title: 'Bundle Deals',
      description: 'Buy 2 get 1 free on accessories',
      icon: 'Package',
      color: 'from-green-500 to-emerald-600',
      badge: 'Save More'
    }
  ];

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const products = await productService.getAll();
      
      // Get featured products (highest rated)
      const featured = products
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 8);
      
      // Get new arrivals (most recent)
      const newItems = products
        .sort((a, b) => b.id - a.id)
        .slice(0, 6);
      
      setFeaturedProducts(featured);
      setNewArrivals(newItems);
    } catch (err) {
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Loading type="hero" />
          <div className="mt-16">
            <Loading type="products" count={8} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Error message={error} onRetry={loadHomeData} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen"
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-700">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6"
            >
              Premium Shopping
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-accent-300 to-accent-500">
                Made Simple
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl sm:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Discover amazing products at unbeatable prices. From electronics to fashion, we have everything you need.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Button 
                size="xl"
                className="bg-white text-primary-600 hover:bg-gray-100 shadow-2xl transform hover:scale-105"
              >
                <ApperIcon name="ShoppingBag" size={24} className="mr-3" />
                Start Shopping
              </Button>
              
              <Button 
                size="xl"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary-600 shadow-2xl"
              >
                <ApperIcon name="Play" size={24} className="mr-3" />
                Watch Demo
              </Button>
            </motion.div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 opacity-20">
          <motion.div
            animate={{ y: [-20, 20, -20] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-32 h-32 bg-white rounded-full"
          />
        </div>
        <div className="absolute bottom-20 right-10 opacity-20">
          <motion.div
            animate={{ y: [20, -20, 20] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-24 h-24 bg-accent-400 rounded-full"
          />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold gradient-text mb-6">
              Shop by Category
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Explore our diverse range of products across multiple categories
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="hover-lift"
              >
                <Link
                  to={category.href}
                  className="block bg-white rounded-2xl shadow-card hover:shadow-card-hover p-6 text-center transition-all duration-300"
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${category.color} flex items-center justify-center shadow-lg`}>
                    <ApperIcon name={category.icon} size={32} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-secondary-800 group-hover:text-primary-600">
                    {category.name}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Deals Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Amazing Deals
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Don't miss out on these incredible offers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {deals.map((deal, index) => (
              <motion.div
                key={deal.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="glass rounded-2xl p-8 text-center"
              >
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${deal.color} flex items-center justify-center shadow-lg`}>
                  <ApperIcon name={deal.icon} size={40} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{deal.title}</h3>
                <p className="text-white/90 mb-4">{deal.description}</p>
                <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-white">
                  {deal.badge}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-16"
          >
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold gradient-text mb-4">
                Featured Products
              </h2>
              <p className="text-xl text-secondary-600">
                Handpicked products with the highest ratings
              </p>
            </div>
            <Link to="/category/all">
              <Button variant="outline" className="hidden sm:flex">
                View All
                <ApperIcon name="ArrowRight" size={18} className="ml-2" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12 sm:hidden">
            <Link to="/category/all">
              <Button>
                View All Products
                <ApperIcon name="ArrowRight" size={18} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold gradient-text mb-6">
              New Arrivals
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Fresh products just added to our collection
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {newArrivals.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default HomePage;