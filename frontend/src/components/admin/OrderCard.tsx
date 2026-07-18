import { ListPlus, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import type { OrderListResponseType } from '@/interfaces/orders.interface';
import { dayTime, relativeTime } from '@/lib/time';
import { useNavigate } from 'react-router-dom';
import { useBusinessStore } from '@/stores/business.store';
import { useEffect, useState } from 'react';
import { useDeleteOrder } from '@/hooks/useOrders';

type props = {
  data: OrderListResponseType;
  handlerEvents: () => void;
};

export const OrderCard = ({ data, handlerEvents }: props) => {
  const navigate = useNavigate();
  const { slug, setOrder } = useBusinessStore();
  const deleteOrder = useDeleteOrder();

  const [confirmedOrder, setConfirmedOrder] = useState<boolean>(
    () => localStorage.getItem(`order-${data.id}-confirmed`) === 'true'
  );

  const isOrderCompleted = data.status === 'FINISHED';
  const isWhatsappOrder = data.order_type === 'WHATSAPP';
  const showWhatsappActions =
    isWhatsappOrder && !confirmedOrder && !isOrderCompleted;

  useEffect(() => {
    if (isOrderCompleted) {
      localStorage.removeItem(`order-${data.id}-confirmed`);
    }
  }, [isOrderCompleted, data.id]);

  const handlerConfirm = () => {
    localStorage.setItem(`order-${data.id}-confirmed`, 'true');
    setConfirmedOrder(true);
  };

  const handlerAddNewSupply = () => {
    setOrder({ order_id: data.id, guest_name: data.guest_name });
    navigate(`/${slug}/menu`);
  };

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
        <p
          className={`font-semibold text-sm
            ${isWhatsappOrder ? 'text-[#4FC238]' : 'text-[#5D6369]'}
          `}
        >
          {data.order_type}
        </p>
      </div>
      <div className="flex flex-col justify-between bg-[#EFF4FF] p-2 rounded-sm gap-0.5">
        <div className="flex items-center flex-wrap justify-between gap-0.5">
          <p className="font-mediun text-sm">MONTO TOTAL</p>
          <p className="font-semibold text-xl">S/ {data.total.toFixed(2)}</p>
        </div>
        <p className="text-xs">
          {dayTime(data.created_at)} - Hace {relativeTime(data.created_at)}
        </p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {showWhatsappActions ? (
          <>
            <Button
              variant="outline"
              onClick={handlerConfirm}
              className="text-[#151C23] flex-1 rounded-sm cursor-pointer"
            >
              Confirmar pedido
            </Button>
            <Button
              variant="outline"
              onClick={() => deleteOrder.mutate(data.id!)}
              className="px-3 rounded-sm cursor-pointer text-red-500 border-red-300 hover:bg-red-50"
            >
              <Trash2 className="h-6! w-6!" strokeWidth={1.5} />
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={handlerEvents}
              className="text-[#151C23] flex-1 rounded-sm cursor-pointer"
            >
              Detalles del pedido
            </Button>
            <Button
              onClick={handlerAddNewSupply}
              className="px-3 rounded-sm cursor-pointer"
            >
              <ListPlus className="h-6! w-6!" strokeWidth={1.5} />
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};
