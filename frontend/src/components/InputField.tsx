import type { LucideIcon } from 'lucide-react';
import React from 'react';

type props = {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  icon: LucideIcon;
  suffix?: React.ReactNode;
};

export const InputField = ({
  id,
  label,
  type,
  placeholder,
  icon: Icon,
  suffix,
}: props) => {
  return (
    <section className="flex flex-col gap-2">
      <label className="text-[#43474F] font-semibold" htmlFor={id}>
        {label}
      </label>
      <div className="flex items-center gap-2 border border-[#C3C6D0] rounded-lg h-11 px-4 bg-[#F8F9FA]">
        <Icon className="text-[#6B7280] w-5 h-5 shrink-0" />
        <input
          className="flex-1 min-w-0 truncate outline-none bg-transparent text-[#6B7280] placeholder:text-[#9CA3AF]"
          type={type}
          id={id}
          placeholder={placeholder}
        />
        {suffix}
      </div>
    </section>
  );
};
