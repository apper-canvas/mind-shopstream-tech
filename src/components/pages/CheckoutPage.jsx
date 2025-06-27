import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { useCart } from '@/hooks/useCart';
import { orderService } from '@/services/api/orderService';
import { toast } from 'react-toastify';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Shipping Information
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  // Payment Information
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardName: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZipCode: '',
    sameAsShipping: true
  });

  const [errors, setErrors] = useState({});

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const validateShipping = () => {
    const newErrors = {};
    
    if (!shippingInfo.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!shippingInfo.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!shippingInfo.email.trim()) newErrors.email = 'Email is required';
    if (!shippingInfo.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!shippingInfo.address.trim()) newErrors.address = 'Address is required';
    if (!shippingInfo.city.trim()) newErrors.city = 'City is required';
    if (!shippingInfo.state.trim()) newErrors.state = 'State is required';
    if (!shippingInfo.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (shippingInfo.email && !emailRegex.test(shippingInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    const newErrors = {};
    
    if (!paymentInfo.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
    if (!paymentInfo.expiryMonth.trim()) newErrors.expiryMonth = 'Expiry month is required';
    if (!paymentInfo.expiryYear.trim()) newErrors.expiryYear = 'Expiry year is required';
    if (!paymentInfo.cvv.trim()) newErrors.cvv = 'CVV is required';
    if (!paymentInfo.cardName.trim()) newErrors.cardName = 'Cardholder name is required';
    
    // Card number validation (basic)
    if (paymentInfo.cardNumber && paymentInfo.cardNumber.replace(/\s/g, '').length < 13) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleShippingChange = (field, value) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePaymentChange = (field, value) => {
    // Format card number
    if (field === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
    }
    
    setPaymentInfo(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateShipping()) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (validatePayment()) {
        setCurrentStep(3);
      }
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    
    try {
      const orderData = {
        items: cartItems,
        shipping: shippingInfo,
        payment: paymentInfo,
        total: getTotalPrice()
      };
      
      const order = await orderService.create(orderData);
      clearCart();
      navigate(`/order-confirmation/${order.id}`);
      toast.success('Order placed successfully!');
      
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getTotalPrice();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const steps = [
    { number: 1, title: 'Shipping', icon: 'Truck' },
    { number: 2, title: 'Payment', icon: 'CreditCard' },
    { number: 3, title: 'Review', icon: 'Check' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">Checkout</h1>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-8 mb-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center space-x-3 ${
                  currentStep >= step.number ? 'text-primary-600' : 'text-secondary-400'
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold border-2 transition-all duration-300 ${
                    currentStep >= step.number 
                      ? 'bg-primary-500 border-primary-500 text-white' 
                      : 'border-secondary-300 text-secondary-500'
                  }`}>
                    {currentStep > step.number ? (
                      <ApperIcon name="Check" size={18} />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span className="font-medium hidden sm:inline">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 transition-all duration-300 ${
                    currentStep > step.number ? 'bg-primary-500' : 'bg-secondary-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-card p-6">
              {/* Step 1: Shipping Information */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h2 className="text-2xl font-bold text-secondary-800 mb-6">
                    Shipping Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        First Name
                      </label>
                      <Input
                        value={shippingInfo.firstName}
                        onChange={(e) => handleShippingChange('firstName', e.target.value)}
                        error={errors.firstName}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Last Name
                      </label>
                      <Input
                        value={shippingInfo.lastName}
                        onChange={(e) => handleShippingChange('lastName', e.target.value)}
                        error={errors.lastName}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => handleShippingChange('email', e.target.value)}
                        error={errors.email}
                        icon="Mail"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) => handleShippingChange('phone', e.target.value)}
                        error={errors.phone}
                        icon="Phone"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Street Address
                      </label>
                      <Input
                        value={shippingInfo.address}
                        onChange={(e) => handleShippingChange('address', e.target.value)}
                        error={errors.address}
                        icon="MapPin"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        City
                      </label>
                      <Input
                        value={shippingInfo.city}
                        onChange={(e) => handleShippingChange('city', e.target.value)}
                        error={errors.city}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        State
                      </label>
                      <Input
                        value={shippingInfo.state}
                        onChange={(e) => handleShippingChange('state', e.target.value)}
                        error={errors.state}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        ZIP Code
                      </label>
                      <Input
                        value={shippingInfo.zipCode}
                        onChange={(e) => handleShippingChange('zipCode', e.target.value)}
                        error={errors.zipCode}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Country
                      </label>
                      <select
                        value={shippingInfo.country}
                        onChange={(e) => handleShippingChange('country', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Payment Information */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h2 className="text-2xl font-bold text-secondary-800 mb-6">
                    Payment Information
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Card Number
                      </label>
                      <Input
                        value={paymentInfo.cardNumber}
                        onChange={(e) => handlePaymentChange('cardNumber', e.target.value)}
                        error={errors.cardNumber}
                        placeholder="1234 5678 9012 3456"
                        icon="CreditCard"
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Month
                        </label>
                        <select
                          value={paymentInfo.expiryMonth}
                          onChange={(e) => handlePaymentChange('expiryMonth', e.target.value)}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                            errors.expiryMonth ? 'border-error-300' : 'border-secondary-200'
                          }`}
                        >
                          <option value="">MM</option>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                            <option key={month} value={month.toString().padStart(2, '0')}>
                              {month.toString().padStart(2, '0')}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Year
                        </label>
                        <select
                          value={paymentInfo.expiryYear}
                          onChange={(e) => handlePaymentChange('expiryYear', e.target.value)}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                            errors.expiryYear ? 'border-error-300' : 'border-secondary-200'
                          }`}
                        >
                          <option value="">YYYY</option>
                          {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                            <option key={year} value={year.toString()}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          CVV
                        </label>
                        <Input
                          value={paymentInfo.cvv}
                          onChange={(e) => handlePaymentChange('cvv', e.target.value)}
                          error={errors.cvv}
                          placeholder="123"
                          maxLength={4}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Cardholder Name
                      </label>
                      <Input
                        value={paymentInfo.cardName}
                        onChange={(e) => handlePaymentChange('cardName', e.target.value)}
                        error={errors.cardName}
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Review Order */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h2 className="text-2xl font-bold text-secondary-800 mb-6">
                    Review Your Order
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Order Items */}
                    <div>
                      <h3 className="text-lg font-semibold text-secondary-800 mb-4">
                        Order Items
                      </h3>
                      <div className="space-y-3">
                        {cartItems.map((item) => (
                          <div key={`${item.id}-${item.addedAt}`} className="flex items-center space-x-4 p-4 bg-secondary-50 rounded-lg">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-secondary-800">{item.name}</h4>
                              <p className="text-secondary-600">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-lg font-semibold gradient-text">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <h3 className="text-lg font-semibold text-secondary-800 mb-3">
                        Shipping Address
                      </h3>
                      <div className="p-4 bg-secondary-50 rounded-lg">
                        <p className="font-medium">{shippingInfo.firstName} {shippingInfo.lastName}</p>
                        <p>{shippingInfo.address}</p>
                        <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                        <p>{shippingInfo.country}</p>
                        <p className="mt-2 text-secondary-600">
                          <ApperIcon name="Mail" size={16} className="inline mr-1" />
                          {shippingInfo.email}
                        </p>
                        <p className="text-secondary-600">
                          <ApperIcon name="Phone" size={16} className="inline mr-1" />
                          {shippingInfo.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-secondary-200">
                {currentStep > 1 && (
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                  >
                    <ApperIcon name="ChevronLeft" size={18} className="mr-2" />
                    Back
                  </Button>
                )}
                
                <div className="ml-auto">
                  {currentStep < 3 ? (
                    <Button onClick={handleNextStep}>
                      Continue
                      <ApperIcon name="ChevronRight" size={18} className="ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handlePlaceOrder}
                      loading={loading}
                      className="bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700"
                    >
                      <ApperIcon name="CreditCard" size={18} className="mr-2" />
                      Place Order
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-card p-6 sticky top-6"
            >
              <h3 className="text-2xl font-bold text-secondary-800 mb-6">
                Order Summary
              </h3>

              <div className="space-y-3 border-t border-secondary-200 pt-6">
                <div className="flex justify-between text-secondary-700">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                
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

              {/* Security Badge */}
              <div className="mt-6 p-4 bg-secondary-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Shield" size={24} className="text-success-600" />
                  <div>
                    <p className="text-sm font-medium text-secondary-800">
                      Secure Checkout
                    </p>
                    <p className="text-xs text-secondary-600">
                      256-bit SSL encryption
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

export default CheckoutPage;