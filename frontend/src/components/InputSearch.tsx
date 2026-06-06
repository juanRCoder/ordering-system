import { Search } from 'lucide-react';

type props = {
  placeholder?: string;
};

export const InputSearch = ({ placeholder = 'Buscar' }: props) => {
  return (
    <div className="flex items-center w-full bg-white border border-border rounded-sm h-14 px-4 gap-3">
      <Search className="text-[#6B7280] w-5 h-5 shrink-0" />
      <input
        type="search"
        placeholder={placeholder}
        className="w-full  outline-none text-[#737780] bg-transparent"
      />
    </div>
  );
};
