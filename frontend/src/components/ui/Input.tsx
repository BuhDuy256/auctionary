import React, { useState } from "react";
import "./Input.css";

export default function Input({
  type = "text",
  placeholder = "",
  value = "",
  onChange = () => {},
  disabled = false,
  name = "",
  required = false,
  className = "",
  ...rest
}: {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  className?: string;
  [key: string]: any;
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordType = type === "password";
  const hasValue = value && value.toString().length > 0;
  const showToggleBtn = isPasswordType && hasValue;

  const currentType = isPasswordType && showPassword ? "text" : type;

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="input-wrapper">
      <input
        type={currentType}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        name={name}
        required={required}
        className={`input-field ${className}`.trim()}
        {...rest}
      />

      {/* Nút con mắt */}
      {showToggleBtn && (
        <button
          type="button"
          className="password-toggle-btn"
          onClick={togglePasswordVisibility}
          tabIndex={-1}
        >
          {/* Thay thế SVG bằng thẻ IMG */}
          <img
            src={
              showPassword ? "/assets/eye_close.svg" : "/assets/eye_open.svg"
            }
            alt={showPassword ? "Hide password" : "Show password"}
            className="eye-icon"
          />
        </button>
      )}
    </div>
  );
}
