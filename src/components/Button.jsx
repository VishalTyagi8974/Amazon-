import { forwardRef } from 'react';

const Button = forwardRef(({ type = "button", children, className = '', variant = 'primary', ...props }, ref) => {
    return (
        <button
            ref={ref}
            type={type}
            className={`btn btn-${variant} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
});

export default Button;
