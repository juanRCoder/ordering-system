import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Field, FieldContent, FieldLabel, FieldTitle } from '../ui/field';
import { Coins, CreditCard } from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { useState, useEffect } from 'react';
import { useOrderByIdQuery, useUpdateOrder } from '@/hooks/useOrders';
import { OrderDetailSkeleton } from '@/skeletons/OrderDetailSkeleton';
import type { OrderDetailSupply } from '@/interfaces/orders.interface';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

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
    'LOCAL' | 'WHATSAPP'
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
  }, [externalTrigger, orderDetail.data?.payment_type]);

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

  return (
    <Drawer
      direction="bottom"
      open={externalTrigger}
      onOpenChange={setExternalTrigger}
    >
      <DrawerContent className="w-full max-w-md mx-auto">
        <DrawerTitle className="sr-only">Detalles del pedido</DrawerTitle>
        <DrawerHeader className="text-xl font-semibold">
          <DrawerTitle className="text-[#05315D]">
            Resumen del pedido
          </DrawerTitle>
        </DrawerHeader>
        <ScrollArea className="overflow-y-auto px-3 pt-0">
          {orderDetail.isLoading ? (
            <OrderDetailSkeleton />
          ) : (
            <>
              <div className="relative">
                <div className="flex flex-col gap-1">
                  <p className="uppercase text-[#42474F] text-sm font-semibold">
                    ORDEN #{orderDetail?.data?.id?.slice(0, 6)}
                  </p>
                  <h2 className="text-[22px] font-semibold">
                    {orderDetail?.data?.guest_name}
                  </h2>
                </div>
                <div className="flex flex-col gap-1 mt-3">
                  <p className="text-[#42474F] text-sm font-semibold">
                    RESUMEN DE INSUMOS
                  </p>
                  {orderDetail?.data?.supplies?.map(
                    (supply: OrderDetailSupply) => (
                      <div
                        key={`${supply.name}-${supply.quantity}-${supply.price}`}
                        className=" bg-[#EFF4FF] flex flex-col px-3 py-2 rounded-sm border border-border"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <span className="shrink-0 h-9 w-9 rounded-sm font-semibold text-[#42474F] bg-[#DAE0E6] grid place-items-center">
                              {supply.quantity}
                            </span>
                            <p className="text-[#161D17]">{supply.name}</p>
                          </div>
                          <span className="text-primary font-medium">
                            S/ {(supply.price * supply.quantity).toFixed(2)}
                          </span>
                        </div>
                        {supply.observations && (
                          <p className="text-[#43474F] text-xs border-l border-border ml-3 px-3 mt-2">
                            {supply.observations
                              ?.split('\n')
                              .filter(Boolean)
                              .map((obs, i) => (
                                <p key={i}>• {obs.trim()}</p>
                              ))}
                          </p>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            </>
          )}
          <div className="flex flex-col gap-1 py-4">
            <p className="text-[#42474F] text-sm font-semibold">
              TIPO DE PEDIDO
            </p>
            <span
              className={`bg-white border border-border p-2 w-fit rounded-sm 
              ${orderDetail?.data?.order_type === 'WHATSAPP' ? 'text-[#4FC238]' : 'text-[#5D6369]'}`}
            >
              {orderDetail?.data?.order_type}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[#42474F] text-sm font-semibold">
              METODOS DE PAGO
            </p>
            <RadioGroup
              value={selectedPaymentType}
              onValueChange={(val) =>
                setSelectedPaymentType(val as 'CASH' | 'YAPE')
              }
              className="w-full gap-2!"
            >
              <FieldLabel htmlFor="CASH" className="rounded-sm!">
                <Field
                  orientation="horizontal"
                  className="py-4! cursor-pointer"
                >
                  <FieldContent className="flex flex-row items-center gap-2">
                    <RadioGroupItem value="CASH" id="CASH" />
                    <Coins className="text-[#42474F]" />
                    <FieldTitle className="text-[#42474F] text-base font-normal">
                      Efectivo
                    </FieldTitle>
                  </FieldContent>
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="YAPE" className="rounded-sm!">
                <Field
                  orientation="horizontal"
                  className="py-4! cursor-pointer"
                >
                  <FieldContent className="flex flex-row items-center gap-2">
                    <RadioGroupItem value="YAPE" id="YAPE" />
                    <CreditCard className="text-[#42474F]" />
                    <FieldTitle className="text-[#42474F] text-base font-normal">
                      Yape
                    </FieldTitle>
                  </FieldContent>
                </Field>
              </FieldLabel>
            </RadioGroup>
          </div>
          <div className="flex flex-col gap-1 py-4">
            <p className="text-[#42474F] text-sm font-semibold">
              ESTADO DEL PEDIDO
            </p>
            <ToggleGroup
              value={selectedOrderStatus}
              onValueChange={(val: string[]) => {
                if (val.length > 0) setSelectedOrderStatus(val);
              }}
              className="border rounded-sm w-full gap-0! h-12!"
            >
              <ToggleGroupItem
                value="PENDING"
                className="flex-1 aria-pressed:bg-[#05315D]! aria-pressed:text-white! h-full rounded-r-none"
              >
                PENDIENTE
              </ToggleGroupItem>
              <ToggleGroupItem
                value="FINISHED"
                className="flex-1 aria-pressed:bg-[#05315D]! aria-pressed:text-white! h-full rounded-l-none"
              >
                FINALIZADO
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </ScrollArea>
        <div className="flex justify-between items-center pt-4 px-4">
          <p className="text-[#42474F] text-sm font-semibold">MONTO TOTAL</p>
          <p className="font-bold text-xl text-primary">
            S/ {orderDetail?.data?.total.toFixed(2)}
          </p>
        </div>
        <DrawerFooter>
          <Button
            onClick={updateOrderHandler}
            className="w-full cursor-pointer rounded-sm py-6! text-base bg-[#05315D]"
          >
            Actualizar Pedido
          </Button>
          <DrawerClose asChild>
            <Button
              type="button"
              className="w-full cursor-pointer rounded-sm text-base py-6! outline-none text-[#43474F] font-bold"
              variant="outline"
            >
              Volver
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
