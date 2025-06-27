import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Footer = () => {
  const footerSections = [
    {
      title: 'Shop',
      links: [
        { name: 'Electronics', href: '/category/electronics' },
        { name: 'Fashion', href: '/category/fashion' },
        { name: 'Home & Garden', href: '/category/home-garden' },
        { name: 'Sports & Outdoors', href: '/category/sports' },
        { name: 'Books & Media', href: '/category/books' },
      ]
    },
    {
      title: 'Customer Service',
      links: [
        { name: 'Contact Us', href: '/contact' },
        { name: 'Help Center', href: '/help' },
        { name: 'Track Your Order', href: '/track-order' },
        { name: 'Returns & Exchanges', href: '/returns' },
        { name: 'Size Guide', href: '/size-guide' },
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About ShopStream', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press', href: '/press' },
        { name: 'Investors', href: '/investors' },
        { name: 'Sustainability', href: '/sustainability' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'Accessibility', href: '/accessibility' },
        { name: 'Sitemap', href: '/sitemap' },
      ]
    }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: 'Facebook', href: '#' },
    { name: 'Twitter', icon: 'Twitter', href: '#' },
    { name: 'Instagram', icon: 'Instagram', href: '#' },
    { name: 'YouTube', icon: 'Youtube', href: '#' },
    { name: 'LinkedIn', icon: 'Linkedin', href: '#' }
  ];

  const paymentMethods = [
    'CreditCard', 'Smartphone', 'Banknote', 'Wallet'
  ];

  return (
    <footer className="bg-gradient-to-br from-secondary-800 to-secondary-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-secondary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-bold mb-4">
                Stay in the Loop
              </h3>
              <p className="text-secondary-300 text-lg mb-8">
                Get exclusive deals, new arrivals, and insider shopping tips delivered to your inbox.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <div className="flex-1">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-6 py-4 rounded-xl bg-white text-secondary-800 placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg"
                  />
                </div>
                <Button className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  Subscribe
                </Button>
              </div>
              
              <p className="text-secondary-400 text-sm mt-4">
                By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Link to="/" className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                  <ApperIcon name="ShoppingBag" size={28} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">ShopStream</h2>
                  <p className="text-secondary-400 text-sm">Premium Shopping</p>
                </div>
              </Link>
              
              <p className="text-secondary-300 mb-6 leading-relaxed">
                Your trusted destination for premium products, exceptional service, and unbeatable prices.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 bg-secondary-700 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-all duration-300"
                  >
                    <ApperIcon name={social.icon} size={18} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={section.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="text-lg font-semibold mb-6 text-white">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-secondary-300 hover:text-primary-400 transition-colors duration-300 flex items-center group"
                      >
                        <span className="group-hover:translate-x-2 transition-transform duration-300">
                          {link.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-secondary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-secondary-400">
              <p>&copy; 2024 ShopStream. All rights reserved.</p>
              <div className="flex items-center space-x-4 text-sm">
                <span>Made with</span>
                <ApperIcon name="Heart" size={16} className="text-error-500" />
                <span>for amazing shoppers</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-secondary-400 text-sm">We accept:</span>
              <div className="flex items-center space-x-2">
                {paymentMethods.map((method, index) => (
                  <div
                    key={method}
                    className="w-8 h-8 bg-white rounded flex items-center justify-center"
                  >
                    <ApperIcon name={method} size={16} className="text-secondary-600" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;