import { Search, X } from 'lucide-react';

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
    <div className="flex items-center w-full h-12 px-4 gap-3 rounded-lg bg-white">
      <Search className="w-5 h-5 shrink-0 text-[#94A3B8]" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="text-sm w-full outline-none bg-transparent placeholder:text-slate-400 text-[#0F2A4A]"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="flex items-center justify-center w-6 h-6 rounded-lg active:scale-90 transition-transform duration-100 cursor-pointer border-none outline-none bg-[#E2E8F0]"
          aria-label="Limpiar búsqueda"
        >
          <X className="w-3.5 h-3.5 text-[#64748B]" />
        </button>
      )}
      <style>{`
        input[type='search']::-webkit-search-cancel-button,
        input[type='search']::-webkit-search-decoration {
          -webkit-appearance: none;
          appearance: none;
        }
        input[type='search'] {
          -webkit-appearance: none;
          appearance: none;
        }
      `}</style>
    </div>
  );
};
