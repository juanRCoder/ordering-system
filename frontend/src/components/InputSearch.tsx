import { Search } from 'lucide-react';

type props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};
export const InputSearch = ({
  value,
  onChange,
  placeholder = 'Buscar',
}: props) => {
  return (
    <div className="flex items-center justify-center  w-full bg-white border border-border rounded-sm h-14 px-4 gap-3">
      <Search className="text-[#737780] w-4 h-4 shrink-0" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="text-sm w-full outline-none bg-transparent"
      />
    </div>
  );
};
