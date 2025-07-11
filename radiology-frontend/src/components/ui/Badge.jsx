import { cn } from '../../lib/utils';

export default function Badge({ 
  children, 
  variant = 'primary', 
  size = 'default',
  className 
}) {
  const variants = {
    primary: 'badge-primary',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    gray: 'badge-gray',
  };
  
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    default: 'text-xs px-2.5 py-0.5',
    lg: 'text-sm px-3 py-1',
  };

  return (
    <span className={cn('badge', variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
}