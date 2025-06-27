import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import CartItem from '@/components/molecules/CartItem';
import Empty from '@/components/ui/Empty';
import { useCart } from '@/hooks/useCart';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalItems, getTotalPrice, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleApplyPromo = () => {
    // Mock promo code logic
    const validCodes = {
      'SAVE10': 0.10,
      'WELCOME20': 0.20,
      'FIRST15': 0.15
    };
    
    if (validCodes[promoCode.toUpperCase()]) {
      setPromoDiscount(validCodes[promoCode.toUpperCase()]);
    } else {
      setPromoDiscount(0);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const subtotal = getTotalPrice();
  const discountAmount = subtotal * promoDiscount;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = (subtotal - discountAmount) * 0.08;
  const total = subtotal - discountAmount + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Empty
            type="cart"
            onAction={() => navigate('/')}
          />
        </div>
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text">Shopping Cart</h1>
            <p className="text-secondary-600 mt-2">
              {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          
          <Button
            variant="outline"
            onClick={clearCart}
            className="text-error-600 border-error-300 hover:bg-error-50 hover:border-error-500"
          >
            <ApperIcon name="Trash2" size={18} className="mr-2" />
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <CartItem key={`${item.id}-${item.addedAt}`} item={item} />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-card p-6 sticky top-6"
            >
              <h3 className="text-2xl font-bold text-secondary-800 mb-6">
                Order Summary
              </h3>

              {/* Promo Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Promo Code
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <Button
                    variant="outline"
                    onClick={handleApplyPromo}
                    disabled={!promoCode.trim()}
                  >
                    Apply
                  </Button>
                </div>
                {promoDiscount > 0 && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-success-600 mt-2 flex items-center"
                  >
                    <ApperIcon name="CheckCircle" size={16} className="mr-1" />
                    {(promoDiscount * 100).toFixed(0)}% discount applied!
                  </motion.p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 border-t border-secondary-200 pt-6">
                <div className="flex justify-between text-secondary-700">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-success-600">
                    <span>Discount ({(promoDiscount * 100).toFixed(0)}%)</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-secondary-700">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-success-600 font-medium">Free</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between text-secondary-700">
                  <span>Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                
                <div className="border-t border-secondary-200 pt-3 flex justify-between items-center">
                  <span className="text-xl font-bold text-secondary-800">Total</span>
                  <span className="text-2xl font-bold gradient-text">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                size="lg"
                onClick={handleCheckout}
                className="w-full mt-6 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white py-4 text-lg font-semibold"
              >
                <ApperIcon name="CreditCard" size={20} className="mr-2" />
                Proceed to Checkout
              </Button>

              {/* Continue Shopping */}
              <Link to="/">
                <Button
                  variant="outline"
                  className="w-full mt-3 border-secondary-300 text-secondary-700 hover:border-primary-500 hover:text-primary-600"
                >
                  <ApperIcon name="ArrowLeft" size={18} className="mr-2" />
                  Continue Shopping
                </Button>
              </Link>

              {/* Security Badge */}
              <div className="mt-6 p-4 bg-secondary-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Shield" size={24} className="text-success-600" />
                  <div>
                    <p className="text-sm font-medium text-secondary-800">
                      Secure Checkout
                    </p>
                    <p className="text-xs text-secondary-600">
                      Your information is protected with SSL encryption
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartPage;