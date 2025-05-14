
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  id,
  type = "text",
  error,
  className,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="mb-5 form-field">
      <div className="relative">
        <input
          id={id}
          type={isPassword && showPassword ? "text" : type}
          className={cn(
            "block w-full px-4 py-3 text-gray-900 bg-transparent border rounded-lg border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-lms-primary/50 focus:border-lms-primary peer",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/50",
            className
          )}
          placeholder=" "
          {...props}
        />
        <label
          htmlFor={id}
          className="absolute text-gray-600 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-lms-primary left-3"
        >
          {label}
        </label>
        {isPassword && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500 animate-fade-in">{error}</p>
      )}
    </div>
  );
};

export default FormInput;
