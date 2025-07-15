import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Input Component - Komponen input yang reusable dan accessible
 */
const Input = forwardRef(({ 
  className, 
  type = 'text', 
  error, 
  label, 
  required = false,
  ...props 
}, ref) => {
  return (
    <div className='space-y-2'>
      {label && (
        <label 
          htmlFor={props.id} 
          className='block text-sm font-medium text-gray-700'
        >
          {label}
          {required && <span className='text-red-500 ml-1'>*</span>}
        </label>
      )}
      
      <input
        type={type}
        className={cn(
          'w-full px-4 py-3 border rounded-lg transition-colors',
          'focus:ring-2 focus:ring-purple-500 focus:border-purple-500',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error 
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300',
          className
        )}
        ref={ref}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${props.id}-error` : undefined}
        {...props}
      />
      
      {error && (
        <p 
          id={`${props.id}-error`}
          className='text-sm text-red-600'
          role='alert'
        >
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };