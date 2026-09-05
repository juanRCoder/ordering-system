import { ListPlus, Check, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import type { OrderListResponseType } from '@/interfaces/orders.interface';
import { dayTime, relativeTime } from '@/lib/time';
import { DM_SANS_STYLE } from '@/lib/constants';
import { useNavigate } from 'react-router-dom';
import { useBusinessStore } from '@/stores/business.store';
// import { useDeleteOrder } from '@/hooks/useOrders';

type props = {
  data: OrderListResponseType;
  handlerEvents: () => void;
};

export const OrderCard = ({ data, handlerEvents }: props) => {
  const navigate = useNavigate();
  const slug = useBusinessStore((s) => s.slug);
  const setOrder = useBusinessStore((s) => s.setOrder);
  // const deleteOrder = useDeleteOrder();

  const isOrderCompleted = data.status === 'FINISHED';
  const isTakeawayOrder = data.order_type === 'TAKEAWAY';
  // const showTakeawayDelete = isTakeawayOrder && !isOrderCompleted;

  const handlerAddNewSupply = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOrder({ order_id: data.id, guest_name: data.guest_name });
    navigate(`/${slug}/menu`);
  };

  return (
    <Card
      className="rounded-lg p-0! gap-0! transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer active:scale-[0.97]"
      onClick={handlerEvents}
    >
      <div
        className={`flex items-center justify-between px-3 py-1.5 ${
          isOrderCompleted ? 'bg-[#16A34A]' : 'bg-[#0F2A4A]'
        }`}
      >
        <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white">
          {isOrderCompleted ? (
            <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
          ) : (
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
            </span>
          )}
          {isOrderCompleted ? 'Finalizado' : 'Pendiente'}
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-white/80">
          #{data.id?.slice(0, 6)}
        </span>
      </div>

      <div className="flex flex-col gap-2 p-3">
        <div className="flex items-center justify-between gap-2">
          <h3
            className="truncate text-base font-bold leading-snug text-[#0F2A4A]"
            style={DM_SANS_STYLE}
          >
            {data.guest_name}
          </h3>
          <Button
            onClick={handlerAddNewSupply}
            size="icon-sm"
            className="shrink-0 cursor-pointer rounded-md bg-[#0F2A4A] hover:bg-[#164069]"
          >
            <ListPlus strokeWidth={2} />
          </Button>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
          <span
            className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
              isTakeawayOrder
                ? 'bg-[#DCFCE7] text-[#15803D]'
                : 'bg-[#E2E8F0] text-[#475569]'
            }`}
          >
            {data.order_type === 'TAKEAWAY' ? 'PARA LLEVAR' : 'EN LOCAL'}
          </span>
          <Clock className="h-3 w-3" strokeWidth={2} />
          <span>
            {dayTime(data.created_at)} · hace {relativeTime(data.created_at)}
          </span>
        </div>

        <div className="h-0 border-t border-dashed border-[#CBD5E1]" />

        {data.supplies?.length > 0 && (
          <div className="flex flex-col gap-1">
            {data.supplies?.slice(0, 3).map((supply) => (
              <div
                key={`${supply.name}-${supply.quantity}`}
                className="flex items-center justify-between text-xs"
              >
                <span className="flex items-center gap-1.5 text-[#475569]">
                  <span className="grid h-4.5 w-4.5 shrink-0 place-items-center rounded bg-[#E0E7FF] text-[10px] font-bold text-[#3B5BDB]">
                    {supply.quantity}
                  </span>
                  <span className="truncate">{supply.name}</span>
                </span>
              </div>
            ))}
            {data.supplies.length > 3 && (
              <span className="text-[11px] font-semibold text-[#3B5BDB]">
                +{data.supplies.length - 3} más
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between rounded-md bg-[#E0E7FF]/40 px-2.5 py-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#475569]">
            Monto total
          </span>
          <span className="text-base font-bold text-[#0F2A4A]">
            S/ {data.total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* {showTakeawayDelete && (
        <div className="flex gap-2 px-3 pb-3">
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              deleteOrder.mutate(data.id!);
            }}
            className="flex-1 cursor-pointer rounded-md px-3 text-red-500 hover:bg-red-50"
          >
            <Trash2 className="h-4.5 w-4.5" strokeWidth={1.5} />
          </Button>
        </div>
      )} */}
    </Card>
  );
};
