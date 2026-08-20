import { SelectHTMLAttributes, forwardRef } from "react";
import { ChevronDown, Info } from "lucide-react";
import { SelectOption } from "@/types";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  showInfoIcon?: boolean;
  error?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, showInfoIcon, error, id, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="flex items-center gap-1 text-sm font-medium text-gray-900"
          >
            {label}
            {showInfoIcon && (
              <Info className="h-3.5 w-3.5 text-gray-400" aria-hidden="true" />
            )}
          </label>
        )}
        <div className="relative">
          <select
            id={id}
            ref={ref}
            aria-invalid={!!error}
            className={`w-full appearance-none rounded-lg border ${
              error ? "border-red-400" : "border-gray-300"
            } bg-white px-3.5 py-2.5 pr-9 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
