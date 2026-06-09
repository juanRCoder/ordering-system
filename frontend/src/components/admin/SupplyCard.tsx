import { Card } from '@/components/ui/card';
import type { SupplyResponse } from '@/interfaces/supplies.interface';
import { cn } from '@/lib/utils';
import { Pencil } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { useUpdateSupplyStatus } from '@/hooks/useSupplies';

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

  return (
    <Card
      key={data.id}
      className="rounded-sm px-2 py-1 flex flex-row items-center gap-4"
    >
      <div className="shrink-0 w-20 h-20 rounded-[8px] overflow-hidden">
        <img
          src={data.imagen_url || '/insumo.jpg'}
          alt={data.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1">
        <h2 className="text-card-foreground text-lg font-semibold leading-6">
          {data.name}
        </h2>
        <p className="text-primary text-base font-semibold pb-1">
          S/ {Number(data.price).toFixed(2)}
        </p>
        {data.description && (
          <p className="text-[13px] text-muted-foreground line-clamp-2">
            {data.description}
          </p>
        )}
      </div>
      <div className="shrink-0 flex flex-col items-center gap-2.5">
        <span
          onClick={handlerEvents}
          className="bg-[#EFF6FF] cursor-pointer rounded-full w-12 h-12 flex items-center justify-center"
        >
          <Pencil className="text-primary" />
        </span>
        <span
          className={cn(
            'flex flex-col items-center gap-0 justify-center w-18 shrink-0',
            enabled ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          <p className="font-bold text-[13px]">
            {enabled ? 'HABILITADO' : 'HABILITAR'}
          </p>
          <Switch checked={enabled} onCheckedChange={handleUpdateStatus} />
        </span>
      </div>
    </Card>
  );
};
