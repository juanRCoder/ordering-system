import { ScrollText } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import type { OrderListResponseType } from '@/interfaces/orders.interface';
import { relativeTime } from '@/lib/time';

type props = {
  data: OrderListResponseType;
  handlerEvents: () => void;
};

export const OrderCard = ({ data, handlerEvents }: props) => {
  const isOrderCompleted = data.status === 'FINISHED';

  return (
    <Card className="relative p-4 gap-3">
      <div>
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold">{data.guest_name}</h2>
          <p className="text-muted-foreground text-sm">
            Order #{data.id?.slice(0, 6)} • Hace {relativeTime(data.created_at)}
          </p>
        </div>
        <span
          className={`absolute top-5 right-4 text-xs font-medium px-3 py-1 rounded-full 
					${isOrderCompleted ? 'bg-primary text-white outline-0' : 'text-[#43474F] outline'}`}
        >
          {isOrderCompleted ? 'Finalizado' : 'Pendiente'}
        </span>
      </div>
      <hr />
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-lg text-muted-foreground">
            Monto Total:
          </p>
          <p
            className={`font-bold text-xl text-primary ${isOrderCompleted && 'line-through'}`}
          >
            S/ {data.total.toFixed(2)}
          </p>
        </div>
        <Button
          onClick={handlerEvents}
          className={`w-full cursor-pointer rounded-[12px] py-6 flex justify-center items-center gap-3
						${isOrderCompleted && 'bg-muted-foreground/20 text-[#42474F]/70 font-bold hover:bg-muted-foreground/10 hover:text-[#42474F]/70 hover:font-bold'}
						`}
        >
          <ScrollText
            className={`h-6! w-6! ${isOrderCompleted && 'text-[#42474F]/70'}`}
            strokeWidth={1.5}
          />
          <p className="text-[17px]">Detalles del pedido</p>
        </Button>
      </div>
    </Card>
  );
};
