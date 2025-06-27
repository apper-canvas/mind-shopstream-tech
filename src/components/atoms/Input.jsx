import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  error,
  icon,
  iconPosition = 'left',
  disabled = false,
  ...props
}) => {
  const baseClasses = "w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const stateClasses = error
    ? "border-error-300 focus:border-error-500 focus:ring-error-200"
    : "border-secondary-200 focus:border-primary-500 focus:ring-primary-200";

  const iconClasses = iconPosition === 'left' ? 'pl-12' : 'pr-12';

  return (
    <div className="relative">
      {icon && (
        <div className={`absolute top-1/2 transform -translate-y-1/2 ${
          iconPosition === 'left' ? 'left-4' : 'right-4'
        } z-10`}>
          <ApperIcon 
            name={icon} 
            size={20} 
            className={error ? 'text-error-400' : 'text-secondary-400'} 
          />
        </div>
      )}
      
      <motion.input
        whileFocus={{ scale: 1.01 }}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`${baseClasses} ${stateClasses} ${icon ? iconClasses : ''} ${className}`}
        {...props}
      />
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-error-600 flex items-center"
        >
          <ApperIcon name="AlertCircle" size={16} className="mr-1" />
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default Input;