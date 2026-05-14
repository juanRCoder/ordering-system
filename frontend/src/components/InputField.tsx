import { Eye, EyeOff, type LucideIcon } from 'lucide-react';
import React, { useState } from 'react';

type props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: LucideIcon;
  suffix?: React.ReactNode;
  error?: string;
};

export const InputField = ({
  label,
  icon: Icon,
  suffix,
  error,
  type,
  ...inputProps
}: props) => {
  const [isEyeOpen, setIsEyeOpen] = useState<boolean>(false);

  const toggleInputType = () => {
    if (type === 'password') {
      return isEyeOpen ? 'text' : 'password';
    } else {
      return type;
    }
  };

  return (
    <section className="flex flex-col">
      <label
        className="text-[#43474F] font-semibold mb-2"
        htmlFor={inputProps.id}
      >
        {label}
      </label>
      <div className="flex items-center gap-2 border border-[#C3C6D0] rounded-lg h-11 px-4 bg-[#F8F9FA] relative">
        {Icon && <Icon className="text-[#6B7280] w-5 h-5 shrink-0" />}
        <input
          className="flex-1 min-w-0 truncate outline-none bg-transparent text-[#6B7280] placeholder:text-[#9CA3AF]"
          type={toggleInputType()}
          {...inputProps}
        />
        {type === 'password' ? (
          <button
            type="button"
            onClick={() => setIsEyeOpen((state) => !state)}
            className="absolute z-50 right-4 top-1/2 -translate-y-1/2 text-[#6B7280]"
          >
            {isEyeOpen ? (
              <Eye className="h-6 w-6 cursor-pointer" />
            ) : (
              <EyeOff className="h-6 w-6 cursor-pointer" />
            )}
          </button>
        ) : (
          suffix
        )}
      </div>
      {error && <p className="text-sm text-red-500 pt-0.5">{error}</p>}
    </section>
  );
};
