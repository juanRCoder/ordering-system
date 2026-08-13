import { useState } from 'react';
import { InputField } from '@/components/InputField';
import { useBusinessStore } from '@/stores/business.store';
import { User } from 'lucide-react';

type props = {
  value: string;
  onChange: (value: string) => void;
  onTakeawayChange?: (isTakeaway: boolean) => void;
  error?: string;
};

export const GuestSelector = ({
  value,
  onChange,
  onTakeawayChange,
  error,
}: props) => {
  const [showCustom, setShowCustom] = useState(false);
  const [isTakeaway, setIsTakeaway] = useState(false);

  const tableCount = useBusinessStore((s) => s.table_count);
  const tableNumbers = Array.from(
    { length: tableCount ?? 10 },
    (_, i) => i + 1
  );

  const selectTable = (table: number) => {
    setShowCustom(false);
    setIsTakeaway(false);
    onTakeawayChange?.(false);
    onChange(`Mesa ${table}`);
  };

  const selectTakeaway = () => {
    setShowCustom(true);
    setIsTakeaway(true);
    onTakeawayChange?.(true);
    onChange('');
  };

  return (
    <section>
      <label className="block text-[#43474F] font-semibold mb-1 text-sm">
        Identifica el pedido
      </label>
      <p className="text-xs text-[#6B7280] mb-3">
        Toca la mesa o "Para llevar"
      </p>

      {/* Table Grid */}
      <div className="grid grid-cols-5 gap-2">
        {tableNumbers.map((table) => {
          const isSelected = value === `Mesa ${table}`;
          return (
            <button
              key={table}
              type="button"
              onClick={() => selectTable(table)}
              className="h-11 rounded-sm text-sm font-semibold cursor-pointer border-none outline-none transition-all duration-150 active:scale-95"
              style={{
                backgroundColor: isSelected ? '#0F2A4A' : '#FFFFFF',
                color: isSelected ? '#FFFFFF' : '#0F2A4A',
                border: `1px solid ${isSelected ? '#0F2A4A' : '#C3C6D0'}`,
                boxShadow: isSelected
                  ? '0 3px 10px rgba(15,42,74,0.3)'
                  : 'none',
              }}
            >
              {table}
            </button>
          );
        })}
      </div>

      {/* Options */}
      <div className="flex gap-2 mt-2">
        <button
          type="button"
          onClick={selectTakeaway}
          className="flex-1 h-11 rounded-sm text-sm font-semibold cursor-pointer border-none outline-none transition-all duration-150 active:scale-95"
          style={{
            backgroundColor: isTakeaway ? '#0F2A4A' : '#FFFFFF',
            color: isTakeaway ? '#FFFFFF' : '#0F2A4A',
            border: `1px solid ${isTakeaway ? '#0F2A4A' : '#C3C6D0'}`,
            boxShadow: isTakeaway ? '0 3px 10px rgba(15,42,74,0.3)' : 'none',
          }}
        >
          Para llevar
        </button>
      </div>

      {/* Custom Name Input */}
      {showCustom && (
        <div className="mt-3">
          <InputField
            label="Nombre del cliente"
            icon={User}
            placeholder="Ej: Alejo Diaz"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            error={error}
          />
        </div>
      )}

      {error && !showCustom && (
        <p className="text-sm text-red-500 pt-0.5">{error}</p>
      )}
    </section>
  );
};
