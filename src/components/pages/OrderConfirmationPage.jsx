import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { orderService } from '@/services/api/orderService';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    setLoading(true);
    setError('');
    
    try {
      const orderData = await orderService.getById(parseInt(orderId));
      setOrder(orderData);
    } catch (err) {
      setError('Order not found or failed to load.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'success';
      case 'processing':
        return 'warning';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const getEstimatedDelivery = () => {
    const orderDate = new Date(order.createdAt);
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + 7); // Add 7 days
    return deliveryDate;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Loading type="detail" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Error 
          message={error || "Order not found"} 
          onRetry={loadOrder}
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-gradient-to-br from-success-500 to-success-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <ApperIcon name="CheckCircle" size={40} className="text-white" />
          </motion.div>
          
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Order Confirmed!
          </h1>
          
          <p className="text-xl text-secondary-600 mb-2">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
          
          <p className="text-lg text-secondary-500">
            Order #{order.id} • Placed on {formatDate(order.createdAt)}
          </p>
        </motion.div>

        {/* Order Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-card p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-2xl font-bold text-secondary-800 mb-2">
                Order Status
              </h2>
              <div className="flex items-center space-x-3">
                <Badge variant={getStatusColor(order.status)} size="lg">
                  {order.status}
                </Badge>
                <span className="text-secondary-600">
                  Expected delivery: {formatDate(getEstimatedDelivery())}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline">
                <ApperIcon name="Truck" size={18} className="mr-2" />
                Track Order
              </Button>
              <Button variant="outline">
                <ApperIcon name="Download" size={18} className="mr-2" />
                Invoice
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-card p-6"
            >
              <h3 className="text-2xl font-bold text-secondary-800 mb-6">
                Order Items
              </h3>
              
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <motion.div
                    key={`${item.productId}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center space-x-4 p-4 bg-secondary-50 rounded-xl"
                  >
                    <img
                      src={item.image || '/placeholder-product.jpg'}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-secondary-800 mb-1">
                        {item.name}
                      </h4>
                      <p className="text-secondary-600">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold gradient-text">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                      <div className="text-sm text-secondary-600">
                        {formatPrice(item.price)} each
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Shipping Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl shadow-card p-6"
            >
              <h3 className="text-2xl font-bold text-secondary-800 mb-6">
                Shipping Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-secondary-800 mb-3">
                    Delivery Address
                  </h4>
                  <div className="space-y-1 text-secondary-600">
                    <p className="font-medium text-secondary-800">
                      {order.shipping.firstName} {order.shipping.lastName}
                    </p>
                    <p>{order.shipping.address}</p>
                    <p>
                      {order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}
                    </p>
                    <p>{order.shipping.country}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-secondary-800 mb-3">
                    Contact Information
                  </h4>
                  <div className="space-y-2 text-secondary-600">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Mail" size={16} />
                      <span>{order.shipping.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Phone" size={16} />
                      <span>{order.shipping.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-2xl shadow-card p-6 sticky top-6"
            >
              <h3 className="text-2xl font-bold text-secondary-800 mb-6">
                Order Summary
              </h3>

              <div className="space-y-3 border-t border-secondary-200 pt-6">
                <div className="flex justify-between text-secondary-700">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal || order.total * 0.85)}</span>
                </div>
                
                <div className="flex justify-between text-secondary-700">
                  <span>Shipping</span>
                  <span>{formatPrice(order.shipping_cost || 9.99)}</span>
                </div>
                
                <div className="flex justify-between text-secondary-700">
                  <span>Tax</span>
                  <span>{formatPrice(order.tax || order.total * 0.08)}</span>
                </div>
                
                <div className="border-t border-secondary-200 pt-3 flex justify-between items-center">
                  <span className="text-xl font-bold text-secondary-800">Total</span>
                  <span className="text-2xl font-bold gradient-text">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 space-y-3">
                <Link to="/">
                  <Button className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700">
                    <ApperIcon name="ShoppingBag" size={18} className="mr-2" />
                    Continue Shopping
                  </Button>
                </Link>
                
                <Button variant="outline" className="w-full">
                  <ApperIcon name="MessageSquare" size={18} className="mr-2" />
                  Contact Support
                </Button>
              </div>

              {/* Order Timeline */}
              <div className="mt-8 p-4 bg-secondary-50 rounded-lg">
                <h4 className="font-semibold text-secondary-800 mb-4">
                  What's Next?
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                    <span className="text-sm text-secondary-600">
                      Order confirmed
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                    <span className="text-sm text-secondary-600">
                      Processing (1-2 days)
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-secondary-300 rounded-full"></div>
                    <span className="text-sm text-secondary-600">
                      Shipped (5-7 days)
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-secondary-300 rounded-full"></div>
                    <span className="text-sm text-secondary-600">
                      Delivered
                    </span>
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

export default OrderConfirmationPage;