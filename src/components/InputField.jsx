import { forwardRef } from "react"

function InputField({ label, type = "text", placeholder = "", className, ...props }, ref) {
    return (
        <div className={`form-group ${className}`}>
            {label && <label htmlFor={label} className="form-label">{label}</label>}
            <input
                id={label}
                type={type}
                className="form-control"
                placeholder={placeholder}
                ref={ref}
                {...props}
            />
        </div>
    )
}

export default forwardRef(InputField);