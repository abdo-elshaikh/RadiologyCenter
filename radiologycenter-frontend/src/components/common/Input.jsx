import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

/**
 * Reusable Input component
 */
const Input = React.forwardRef(({
  type = 'text',
  name,
  value,
  onChange,
  placeholder = '',
  required = false,
  disabled = false,
  className = '',
  error = '',
  ...props
}, ref) => (
  <>
    <input
      ref={ref}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      className={clsx('input input-bordered', { 'input-error': !!error }, className)}
      aria-invalid={!!error}
      aria-describedby={error ? `${name}-error` : undefined}
      {...props}
    />
    {error && (
      <span id={`${name}-error`} className="text-error text-xs mt-1 block">
        {error}
      </span>
    )}
  </>
));

Input.displayName = 'Input';

Input.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  error: PropTypes.string,
};

export default Input; 