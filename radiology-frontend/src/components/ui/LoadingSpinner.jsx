import { cn } from '../../lib/utils';

export default function LoadingSpinner({ className, size = 'default' }) {
  const sizes = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  return (
    <div className={cn('loading', sizes[size], className)} />
  );
}