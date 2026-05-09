import type { LucideIcon } from 'lucide-react';
import React from 'react';

type props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon: LucideIcon;
  suffix?: React.ReactNode;
  error?: string;
};

export const InputField = ({
  label,
  icon: Icon,
  suffix,
  error,
  ...inputProps
}: props) => {
  return (
    <section className="flex flex-col">
      <label
        className="text-[#43474F] font-semibold mb-2"
        htmlFor={inputProps.id}
      >
        {label}
      </label>
      <div className="flex items-center gap-2 border border-[#C3C6D0] rounded-lg h-11 px-4 bg-[#F8F9FA]">
        <Icon className="text-[#6B7280] w-5 h-5 shrink-0" />
        <input
          className="flex-1 min-w-0 truncate outline-none bg-transparent text-[#6B7280] placeholder:text-[#9CA3AF]"
          {...inputProps}
        />
        {suffix}
      </div>
      {error && <p className="text-sm text-red-500 pt-0.5">{error}</p>}
    </section>
  );
};
