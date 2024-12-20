import { forwardRef } from "react";

function FilterSelect({ label, placeholder = "", className = "", options = [], ...props }, ref) {
    return (
        <div className={`form-group ${className}`}>
            {label && <label htmlFor={label} className="form-label">{label}</label>}
            <select
                id={label}
                className="form-control"
                placeholder={placeholder}
                ref={ref}
                defaultValue={options[0]} // Correctly sets the default selected option
                {...props}
            >
                {options.map((opt) => (
                    <option key={opt} value={opt}  >
                        {opt}
                    </option>
                ))}

            </select>
        </div>
    );
}

export default forwardRef(FilterSelect);
