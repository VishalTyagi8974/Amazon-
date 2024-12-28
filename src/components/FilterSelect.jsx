import { forwardRef } from "react";
import replaceDashesWithSpaces from "../../utils/replaceDashesWithSpaces";

function FilterSelect({ label, placeholder = "", className = "", category = "", options = [], ...props }, ref) {
    const defCat = replaceDashesWithSpaces(category);

    return (
        <div className={`form-group ${className}`}>
            {label && <label htmlFor={label} className="form-label">{label}</label>}
            <select
                id={label}
                className="form-control"
                placeholder={placeholder}
                ref={ref}
                defaultValue={category ? defCat : options[0]} // Correctly sets the default selected option
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

