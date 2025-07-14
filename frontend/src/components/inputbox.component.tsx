'use client';

import React, { useState } from 'react';

interface InputBoxProps {
  type?: string;
  label?: string;
  name: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
}

const InputBox: React.FC<InputBoxProps> = ({
  type = '',
  label = 'Enter value',
  name,
  value = '',
  onChange,
  placeholder = ' ',
  required = false,
  className = '',
  labelClassName = '',
  inputClassName = '',
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className={`relative w-full ${className}`}>
      <input
        type={isPassword ? (showPassword ? 'text' : 'password') : type}
        name={name}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`peer w-full border-2 border-gray-300 bg-transparent shadow-[inset_0_0_0_1000px_white] text-gray-700 px-6 py-2 rounded-lg text-[15px] outline-none transition duration-100 focus:border-blue-600 valid:border-blue-600 ${inputClassName}`}
      />

      {label && (
        <label
          htmlFor={name}
          className={`absolute left-6 top-0 text-gray-500 text-[15px] bg-white px-2 transition-all duration-200 transform scale-100 translate-y-2 peer-focus:scale-90 peer-valid:scale-90 peer-valid:-translate-y-[10px] peer-focus:-translate-y-[10px] peer-focus:-translate-x-4 peer-valid:-translate-x-4 peer-focus:text-gray-500 peer-focus:font-normal peer-focus:text-[14px] peer-valid:font-normal peer-valid:text-[14px] pointer-events-none z-30 ${labelClassName}`}
        >
          {label}
        </label>
      )}

      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-4 top-1/2 mt-1 -translate-y-1/2 z-40"
          tabIndex={-1}
        >
          <i className={`fi fi-sr-eye${showPassword ? '-crossed' : ''}`}></i>
        </button>
      )}
    </div>
  );
};

export default InputBox;