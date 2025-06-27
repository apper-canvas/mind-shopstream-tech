import { motion } from 'framer-motion';

const Badge = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  count = null,
  showZero = false,
  animate = true,
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-semibold rounded-full";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-500 to-primary-600 text-white",
    secondary: "bg-gradient-to-r from-secondary-500 to-secondary-600 text-white",
    success: "bg-gradient-to-r from-success-500 to-success-600 text-white",
    warning: "bg-gradient-to-r from-warning-500 to-warning-600 text-white",
    error: "bg-gradient-to-r from-error-500 to-error-600 text-white",
    outline: "border-2 border-primary-500 text-primary-600 bg-white",
    light: "bg-primary-100 text-primary-700"
  };

  const sizes = {
    sm: "px-2 py-1 text-xs min-w-[20px] h-5",
    md: "px-3 py-1 text-sm min-w-[24px] h-6",
    lg: "px-4 py-2 text-base min-w-[32px] h-8"
  };

  // Handle count display
  if (count !== null) {
    if (count === 0 && !showZero) {
      return null;
    }
    
    const displayCount = count > 99 ? '99+' : count.toString();
    
    const Component = animate ? motion.span : 'span';
    const animationProps = animate ? {
      initial: { scale: 0 },
      animate: { scale: 1 },
      key: count,
      transition: { type: "spring", stiffness: 500, damping: 25 }
    } : {};

    return (
      <Component
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
        {...animationProps}
        {...props}
      >
        {displayCount}
      </Component>
    );
  }

  // Regular badge
  const Component = animate ? motion.span : 'span';
  const animationProps = animate ? {
    initial: { scale: 0 },
    animate: { scale: 1 },
    transition: { type: "spring", stiffness: 500, damping: 25 }
  } : {};

  return (
    <Component
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Badge;