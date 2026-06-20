import { Card } from '@/components/ui/card';
import type { SupplyResponse } from '@/interfaces/supplies.interface';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { useUpdateSupplyStatus } from '@/hooks/useSupplies';
import { Button } from '../ui/button';

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
    <Card key={data.id} className="rounded-sm p-2 flex gap-2">
      <section className="flex flex-row flex-wrap items-start gap-2">
        <div className="shrink-0 w-20 h-20 rounded-sm overflow-hidden">
          <img
            src={data.imagen_url || '/no_image.webp'}
            alt={data.name}
            className="w-full h-full object-cover aspect-square"
          />
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex flex-col flex-wrap">
            <h2 className="text-card-foreground text-lg font-semibold leading-6">
              {data.name}
            </h2>
            {data.description && (
              <p className="text-xs text-muted-foreground">
                {data.description}
              </p>
            )}
          </div>
          <p className="text-primary text-lg">
            S/ {Number(data.price).toFixed(2)}
          </p>
        </div>
      </section>
      <div className="shrink-0 flex items-center gap-2 flex-wrap">
        <Button
          variant="outline"
          onClick={handlerEvents}
          className="text-[#151C23] flex-1 rounded-sm cursor-pointer min-w-32"
        >
          Editar
        </Button>
        <span
          className={cn(
            'flex flex-col items-center gap-0 justify-center shrink-0 w-[74px]',
            enabled ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          <p className="font-bold text-xs">
            {enabled ? 'HABILITADO' : 'HABILITAR'}
          </p>
          <Switch
            size="default"
            checked={enabled}
            onCheckedChange={handleUpdateStatus}
          />
        </span>
      </div>
    </Card>
  );
};
