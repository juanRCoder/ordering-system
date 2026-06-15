import { ListPlus } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import type { OrderListResponseType } from '@/interfaces/orders.interface';
import { dayTime, relativeTime } from '@/lib/time';

type props = {
  data: OrderListResponseType;
  handlerEvents: () => void;
};

export const OrderCard = ({ data, handlerEvents }: props) => {
  const isOrderCompleted = data.status === 'FINISHED';

  return (
    <Card className="rounded-sm p-3 gap-2">
      <div className="flex justify-between items-center flex-wrap-reverse gap-0.5 uppercase text-[#42474F] text-xs font-medium">
        <p>ORDEN #{data.id?.slice(0, 6)}</p>
        <span
          className={`
          text-xs px-2 py-1 rounded-sm font-medium
          ${isOrderCompleted ? 'bg-primary text-white' : 'bg-[#DAE0E6] text-[#5D6369]'}
        `}
        >
          {isOrderCompleted ? 'FINALIZADO' : 'PENDIENTE'}
        </span>
      </div>
      <div className="flex justify-between items-center flex-wrap gap-0.5">
        <p className="text-[#151C23] text-xl font-semibold">
          {data.guest_name}
        </p>
        <p className="font-semibold text-[#5D6369] text-sm">EN LOCAL</p>
      </div>
      <div className="flex flex-col justify-between bg-[#EFF4FF] p-2 rounded-sm gap-0.5">
        <div className="flex items-center flex-wrap justify-between gap-0.5">
          <p className="font-mediun text-sm">MONTO TOTAL</p>
          <p className="font-semibold text-xl">S/ {data.total.toFixed(2)}</p>
        </div>
        <p className="text-[#5D6369] text-xs">
          {dayTime(data.created_at)} - Hace {relativeTime(data.created_at)}
        </p>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Button
          variant="outline"
          onClick={handlerEvents}
          className="text-[#151C23] flex-1 rounded-sm cursor-pointer"
        >
          Detalles del pedido
        </Button>
        <Button className="px-3 rounded-sm cursor-pointer">
          <ListPlus className="h-6! w-6!" strokeWidth={1.5} />
        </Button>
      </div>
    </Card>
  );
};
