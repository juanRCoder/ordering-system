import { Card } from '@/components/ui/card';
import type { SupplyResponse } from '@/interfaces/supplies.interface';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { useUpdateSupplyStatus } from '@/hooks/useSupplies';
import { Button } from '../ui/button';
import { DM_SANS_STYLE } from '@/lib/constants';
import { Pencil } from 'lucide-react';

type props = {
  data: SupplyResponse;
  handlerEvents: () => void;
};

export const SupplyCard = ({ data, handlerEvents }: props) => {
  const [enabled, setEnabled] = useState<boolean>(data.status === 'AVAILABLE');
  const updateStatus = useUpdateSupplyStatus();

  const handleUpdateStatus = () => {
    updateStatus.mutate(data.id);
    setEnabled(!enabled);
  };

  const isPlatform = data.origin === 'PLATFORM';

  return (
    <Card
      className="group flex h-80 cursor-pointer flex-col overflow-hidden rounded-lg p-0! gap-0! bg-white ring-1 ring-foreground/10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.97]"
      onClick={handlerEvents}
    >
      <div className="relative h-1/2 w-full shrink-0 overflow-hidden bg-[#E0E7FF]">
        <img
          src={data.image_url || '/no_image.webp'}
          alt={data.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span
          className={`absolute top-2 left-2 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
            isPlatform
              ? 'bg-[#E0E7FF]/95 text-[#3B5BDB]'
              : 'bg-[#DCFCE7]/95 text-[#15803D]'
          }`}
        >
          {isPlatform ? 'Plataforma' : 'Propio'}
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col p-3">
        <h3
          className="truncate text-base font-bold leading-snug text-[#0F2A4A]"
          style={DM_SANS_STYLE}
        >
          {data.name}
        </h3>
        {data.description && (
          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-[#64748B]">
            {data.description}
          </p>
        )}
        <div className="mt-auto pt-2">
          <div className="flex items-center justify-between rounded-md bg-[#E0E7FF]/40 px-2.5 py-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#475569]">
              Precio
            </span>
            <span className="text-base font-bold text-[#0F2A4A]">
              S/ {Number(data.price).toFixed(2)}
            </span>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between gap-2 border-t border-dashed border-[#CBD5E1] pt-2">
          <span
            className={`flex items-center gap-2 text-[11px] font-semibold ${
              enabled ? 'text-[#15803D]' : 'text-[#94A3B8]'
            }`}
          >
            <span onClick={(e) => e.stopPropagation()}>
              <Switch
                size="sm"
                checked={enabled}
                onCheckedChange={handleUpdateStatus}
                className="data-checked:bg-[#0F2A4A]!"
              />
            </span>
            {enabled ? 'Habilitado' : 'Habilitar'}
          </span>
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handlerEvents();
            }}
            className="cursor-pointer rounded-md border-[#0F2A4A]/20 text-[#0F2A4A] hover:bg-[#0F2A4A] hover:text-white"
          >
            <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
            Editar
          </Button>
        </div>
      </div>
    </Card>
  );
};
