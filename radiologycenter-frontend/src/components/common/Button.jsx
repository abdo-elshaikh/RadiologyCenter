import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

/**
 * Reusable Button component
 * @param {string} type - Button type (button, submit, reset)
 * @param {string} variant - Visual style (primary, secondary, outline, etc.)
 * @param {boolean} loading - Show loading spinner
 * @param {boolean} disabled - Disable the button
 * @param {function} onClick - Click handler
 * @param {string} className - Additional classes
 * @param {React.ReactNode} children - Button content
 */
const Button = ({
  type = 'button',
  variant = 'primary',
  loading = false,
  disabled = false,
  onClick,
  className = '',
  children,
  ...props
}) => {
  return (
    <button
      type={type}
      className={clsx(
        'btn',
        {
          'btn-primary': variant === 'primary',
          'btn-secondary': variant === 'secondary',
          'btn-outline': variant === 'outline',
        },
        className
      )}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && <span className="loading loading-spinner loading-xs mr-2" aria-hidden="true"></span>}
      {children}
    </button>
  );
};

Button.propTypes = {
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline']),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Button; 