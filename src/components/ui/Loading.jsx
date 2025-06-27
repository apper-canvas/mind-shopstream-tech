import { motion } from 'framer-motion';

const Loading = ({ type = 'products', count = 12 }) => {
  const renderProductSkeleton = () => (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      <div className="shimmer h-48 bg-gray-200"></div>
      <div className="p-4">
        <div className="shimmer h-4 bg-gray-200 rounded mb-2"></div>
        <div className="shimmer h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="flex items-center justify-between">
          <div className="shimmer h-6 bg-gray-200 rounded w-20"></div>
          <div className="shimmer h-8 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    </div>
  );

  const renderCartSkeleton = () => (
    <div className="bg-white rounded-xl shadow-card p-4 mb-4">
      <div className="flex items-center space-x-4">
        <div className="shimmer h-16 w-16 bg-gray-200 rounded-lg"></div>
        <div className="flex-1">
          <div className="shimmer h-4 bg-gray-200 rounded mb-2"></div>
          <div className="shimmer h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="shimmer h-8 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  );

  const renderDetailSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="shimmer h-96 bg-gray-200 rounded-xl"></div>
      <div className="space-y-4">
        <div className="shimmer h-8 bg-gray-200 rounded"></div>
        <div className="shimmer h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="shimmer h-4 bg-gray-200 rounded"></div>
        <div className="shimmer h-4 bg-gray-200 rounded w-2/3"></div>
        <div className="shimmer h-12 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full"
    >
      {type === 'products' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: count }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {renderProductSkeleton()}
            </motion.div>
          ))}
        </div>
      )}

      {type === 'cart' && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {renderCartSkeleton()}
            </motion.div>
          ))}
        </div>
      )}

      {type === 'detail' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {renderDetailSkeleton()}
        </motion.div>
      )}

      {type === 'hero' && (
        <div className="relative h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden">
          <div className="shimmer h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center space-y-4">
            <div className="shimmer h-8 bg-gray-300 rounded w-64"></div>
            <div className="shimmer h-6 bg-gray-300 rounded w-48"></div>
            <div className="shimmer h-12 bg-gray-300 rounded w-32"></div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Loading;