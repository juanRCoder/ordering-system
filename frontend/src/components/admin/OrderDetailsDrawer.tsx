import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTitle,
} from '@/components/ui/drawer';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Check, Clock, Coins, CreditCard } from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { useState, useEffect } from 'react';
import { useOrderByIdQuery, useUpdateOrder } from '@/hooks/useOrders';
import { OrderDetailSkeleton } from '@/skeletons/OrderDetailSkeleton';
import type { OrderDetailSupply } from '@/interfaces/orders.interface';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { dayTime, relativeTime } from '@/lib/time';
import { DM_SANS_STYLE } from '@/lib/constants';

type props = {
  externalTrigger?: boolean;
  setExternalTrigger: (e: boolean) => void;
  selectedOrderId: string | null;
};

export const OrderDetailsDrawer = ({
  externalTrigger,
  setExternalTrigger,
  selectedOrderId,
}: props) => {
  const [selectedPaymentType, setSelectedPaymentType] = useState<
    'CASH' | 'YAPE'
  >('CASH');
  const [selectedOrderType, setSelectedOrderType] = useState<
    'LOCAL' | 'TAKEAWAY'
  >('LOCAL');
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<string[]>([
    'PENDING',
  ]);

  const orderDetail = useOrderByIdQuery(selectedOrderId!);
  const updateOrder = useUpdateOrder();

  useEffect(() => {
    if (externalTrigger && orderDetail.data?.payment_type) {
      setSelectedPaymentType(orderDetail.data.payment_type);
      setSelectedOrderStatus([orderDetail.data.status]);
      setSelectedOrderType(orderDetail.data.order_type);
    }
  }, [externalTrigger, orderDetail.data]);

  const updateOrderHandler = () => {
    updateOrder.mutate(
      {
        id: selectedOrderId!,
        status: selectedOrderStatus[0],
        payment_type: selectedPaymentType,
        order_type: selectedOrderType,
      },
      {
        onSuccess: () => setExternalTrigger(false),
      }
    );
  };

  const detail = orderDetail.data;
  const isOrderCompleted = detail?.status === 'FINISHED';
  const isTakeawayOrder = detail?.order_type === 'TAKEAWAY';

  return (
    <Drawer
      direction="bottom"
      open={externalTrigger}
      onOpenChange={setExternalTrigger}
    >
      <DrawerContent className="w-full max-w-md mx-auto bg-[#F1F5F9] pb-2">
        <DrawerTitle className="sr-only">Detalles del pedido</DrawerTitle>

        {orderDetail.isLoading ? (
          <ScrollArea className="flex-1 min-h-0 overflow-y-auto px-4 pt-8 pb-4">
            <OrderDetailSkeleton />
          </ScrollArea>
        ) : (
          <>
            <div
              className={`flex items-center justify-between px-4 py-2.5 rounded-t-[inherit] ${
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
                #{detail?.id?.slice(0, 6)}
              </span>
            </div>

            <ScrollArea className="flex-1 min-h-0 overflow-y-auto px-4 pt-4 pb-2">
              <div className="flex flex-col gap-4">
                <div
                  className="flex flex-col gap-1.5 animate-fadeIn"
                  style={{ animationDelay: '40ms' }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                        Cliente
                      </p>
                      <h2
                        className="text-xl font-bold leading-snug text-[#0F2A4A]"
                        style={DM_SANS_STYLE}
                      >
                        {detail?.guest_name}
                      </h2>
                    </div>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                        isTakeawayOrder
                          ? 'bg-[#DCFCE7] text-[#15803D]'
                          : 'bg-[#E2E8F0] text-[#475569]'
                      }`}
                    >
                      {isTakeawayOrder ? 'PARA LLEVAR' : 'EN LOCAL'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
                    <Clock className="h-3 w-3" strokeWidth={2} />
                    <span>
                      {detail?.created_at
                        ? `${dayTime(detail.created_at)} · hace ${relativeTime(
                            detail.created_at
                          )}`
                        : ''}
                    </span>
                  </div>
                </div>

                <div
                  className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-foreground/10 animate-fadeIn"
                  style={{ animationDelay: '90ms' }}
                >
                  <div className="flex items-center justify-between border-b border-dashed border-[#CBD5E1] px-3.5 py-2.5">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#475569]">
                      Resumen de insumos
                    </p>
                    {detail && detail.supplies.length > 0 && (
                      <span className="text-[11px] font-semibold text-[#3B5BDB]">
                        {detail.supplies.length}{' '}
                        {detail.supplies.length === 1 ? 'insumo' : 'insumos'}
                      </span>
                    )}
                  </div>
                  <div className="divide-y divide-dashed divide-[#CBD5E1]">
                    {detail && detail.supplies.length > 0 ? (
                      detail.supplies.map((supply: OrderDetailSupply) => (
                        <div
                          key={`${supply.name}-${supply.quantity}-${supply.price}`}
                          className="flex items-center justify-between gap-3 px-3.5 py-2.5"
                        >
                          <div className="flex min-w-0 items-center gap-2.5">
                            <span className="grid h-5 w-5 shrink-0 place-items-center rounded bg-[#E0E7FF] text-[10px] font-bold text-[#3B5BDB]">
                              {supply.quantity}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-[#1E293B]">
                                {supply.name}
                              </p>
                            </div>
                          </div>
                          <div className="flex shrink-0 flex-col items-end">
                            <span className="text-sm font-bold text-[#0F2A4A]">
                              S/ {(supply.price * supply.quantity).toFixed(2)}
                            </span>
                            <span className="text-[10px] text-[#94A3B8]">
                              S/ {supply.price.toFixed(2)} c/u
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="px-3.5 py-4 text-center text-sm text-[#94A3B8]">
                        Sin insumos registrados
                      </p>
                    )}
                  </div>
                </div>

                <div
                  className="flex flex-col gap-1.5 animate-fadeIn"
                  style={{ animationDelay: '140ms' }}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#475569]">
                    Método de pago
                  </p>
                  <RadioGroup
                    value={selectedPaymentType}
                    onValueChange={(val) =>
                      setSelectedPaymentType(val as 'CASH' | 'YAPE')
                    }
                    className="grid w-full grid-cols-2 gap-2!"
                  >
                    <label
                      htmlFor="CASH"
                      className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-[#E2E8F0] bg-white px-3 py-3 shadow-sm transition-all hover:border-[#CBD5E1] hover:shadow-md has-data-checked:border-[#0F2A4A]/25 has-data-checked:bg-[#E0E7FF]/50 has-data-checked:shadow-md"
                    >
                      <RadioGroupItem value="CASH" id="CASH" />
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-[#E0E7FF] text-[#3B5BDB]">
                        <Coins className="h-4 w-4" strokeWidth={2} />
                      </span>
                      <span className="flex flex-col leading-tight">
                        <span className="text-sm font-semibold text-[#0F2A4A]">
                          Efectivo
                        </span>
                        <span className="text-[10px] text-[#64748B]">
                          Contado
                        </span>
                      </span>
                    </label>
                    <label
                      htmlFor="YAPE"
                      className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-[#E2E8F0] bg-white px-3 py-3 shadow-sm transition-all hover:border-[#CBD5E1] hover:shadow-md has-data-checked:border-[#0F2A4A]/25 has-data-checked:bg-[#E0E7FF]/50 has-data-checked:shadow-md"
                    >
                      <RadioGroupItem value="YAPE" id="YAPE" />
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-[#E0E7FF] text-[#3B5BDB]">
                        <CreditCard className="h-4 w-4" strokeWidth={2} />
                      </span>
                      <span className="flex flex-col leading-tight">
                        <span className="text-sm font-semibold text-[#0F2A4A]">
                          Yape
                        </span>
                        <span className="text-[10px] text-[#64748B]">
                          Transferencia
                        </span>
                      </span>
                    </label>
                  </RadioGroup>
                </div>

                <div
                  className="flex flex-col gap-1.5 animate-fadeIn"
                  style={{ animationDelay: '190ms' }}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#475569]">
                    Estado del pedido
                  </p>
                  <ToggleGroup
                    value={selectedOrderStatus}
                    onValueChange={(val: string[]) => {
                      if (val.length > 0) setSelectedOrderStatus(val);
                    }}
                    className="w-full! gap-0! rounded-lg! bg-white p-1! ring-1 ring-foreground/10"
                  >
                    <ToggleGroupItem
                      value="PENDING"
                      className="h-10! flex-1 rounded-md! px-4! text-sm! font-semibold! text-[#475569]! hover:bg-[#F1F5F9]! hover:text-[#475569]! aria-pressed:bg-[#0F2A4A]! aria-pressed:text-white!"
                    >
                      Pendiente
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="FINISHED"
                      className="h-10! flex-1 rounded-md! px-4! text-sm! font-semibold! text-[#475569]! hover:bg-[#F1F5F9]! hover:text-[#475569]! aria-pressed:bg-[#0F2A4A]! aria-pressed:text-white!"
                    >
                      Finalizado
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>
            </ScrollArea>

            <div
              className="px-4 pt-3 animate-fadeIn"
              style={{ animationDelay: '240ms' }}
            >
              <div className="flex items-center justify-between rounded-md bg-[#E0E7FF]/40 px-3 py-2.5">
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#475569]">
                    Monto total
                  </span>
                  {detail && detail.supplies.length > 0 && (
                    <span className="text-[10px] text-[#94A3B8]">
                      {detail.supplies.length}{' '}
                      {detail.supplies.length === 1 ? 'insumo' : 'insumos'}
                    </span>
                  )}
                </div>
                <span className="text-xl font-bold text-[#0F2A4A]">
                  S/ {detail?.total?.toFixed(2)}
                </span>
              </div>
            </div>
          </>
        )}

        <DrawerFooter>
          <Button
            onClick={updateOrderHandler}
            className="w-full cursor-pointer rounded-md bg-[#0F2A4A] py-3.5! text-base font-semibold hover:bg-[#164069]"
          >
            Actualizar Pedido
          </Button>
          <DrawerClose asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full cursor-pointer rounded-md py-3.5! text-base font-semibold text-[#475569]"
            >
              Volver
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
