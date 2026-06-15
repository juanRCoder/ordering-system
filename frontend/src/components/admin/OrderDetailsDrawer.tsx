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
import { Coins, CreditCard, ChevronsUpDown } from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { useState, useEffect } from 'react';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '../ui/collapsible';
import { useOrderByIdQuery, useUpdateOrderStatus } from '@/hooks/useOrders';
import { relativeTime } from '@/lib/time';
import { OrderDetailSkeleton } from '@/skeletons/OrderDetailSkeleton';
import type { OrderDetailSupply } from '@/interfaces/orders.interface';

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
  const [openPaymentMethods, setOpenPaymentMethods] = useState<boolean>(true);
  const [typePay, setTypePay] = useState<'CASH' | 'YAPE'>('CASH');
  const [orderStatus, setOrderStatus] = useState<'PENDING' | 'FINISHED'>(
    'PENDING'
  );

  const orderDetail = useOrderByIdQuery(selectedOrderId!);
  const updateStatus = useUpdateOrderStatus();

  const isOrderCompleted = orderDetail.data?.status === 'FINISHED';

  useEffect(() => {
    if (externalTrigger && orderDetail.data?.type_pay) {
      setTypePay(orderDetail.data.type_pay);
      setOrderStatus(orderDetail.data.status);
    }
  }, [externalTrigger, orderDetail.data?.type_pay]);

  const handlerUpdateStatus = () => {
    updateStatus.mutate(
      {
        id: selectedOrderId!,
        status: orderStatus,
        type_pay: typePay,
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
        <DrawerHeader className="text-xl font-semibold text-primary">
          <DrawerTitle>Resumen del Pedido</DrawerTitle>
        </DrawerHeader>
        <ScrollArea className="overflow-y-auto px-4 pt-0">
          {orderDetail.isLoading ? (
            <OrderDetailSkeleton />
          ) : (
            <>
              <div className="relative pb-4">
                <div className="flex flex-col">
                  <h2 className="text-lg font-semibold">
                    {orderDetail?.data?.guest_name}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Order #{orderDetail?.data?.id?.slice(0, 6)} • Hace{' '}
                    {relativeTime(orderDetail?.data?.created_at)}
                  </p>
                </div>
                <span className="absolute top-0 right-0 text-xs font-medium px-3 py-1 rounded-full text-[#43474F] border border-0.5">
                  {isOrderCompleted ? 'Finalizado' : 'Pendiente'}
                </span>
                <div className="flex flex-col gap-3 mt-3">
                  {orderDetail?.data?.supplies?.map(
                    (supply: OrderDetailSupply) => (
                      <div
                        key={`${supply.name}-${supply.quantity}-${supply.price}`}
                        className="flex justify-between items-center"
                      >
                        <div className="flex items-center gap-4">
                          <span className="shrink-0 h-8 w-8 rounded-lg bg-[#D8E9FF]/50 grid place-items-center">
                            {supply.quantity}
                          </span>
                          <p>{supply.name}</p>
                          <p>{supply.observations}</p>
                        </div>
                        <span className="text-primary font-medium">
                          S/ {supply.price}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </>
          )}
          <Collapsible
            open={openPaymentMethods}
            onOpenChange={setOpenPaymentMethods}
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-base font-semibold text-[#031C30]">
                Metodos de Pago:
              </p>
              <CollapsibleTrigger
                render={
                  <Button variant="ghost" size="icon" className="size-8">
                    <ChevronsUpDown />
                    <span className="sr-only">Toggle details</span>
                  </Button>
                }
              />
            </div>
            <CollapsibleContent className="flex flex-col gap-4 pt-4">
              <RadioGroup
                value={typePay}
                onValueChange={(val) => setTypePay(val as 'CASH' | 'YAPE')}
                className="w-full"
              >
                <FieldLabel htmlFor="CASH" className="rounded-xl!">
                  <Field
                    orientation="horizontal"
                    className="py-4! cursor-pointer"
                  >
                    <FieldContent className="flex flex-row items-center gap-2">
                      <RadioGroupItem value="CASH" id="CASH" />
                      <Coins />
                      <FieldTitle className="text-[#161D17] text-base font-normal">
                        Efectivo
                      </FieldTitle>
                    </FieldContent>
                  </Field>
                </FieldLabel>
                <FieldLabel htmlFor="YAPE" className="rounded-xl!">
                  <Field
                    orientation="horizontal"
                    className="py-4! cursor-pointer"
                  >
                    <FieldContent className="flex flex-row items-center gap-2">
                      <RadioGroupItem value="YAPE" id="YAPE" />
                      <CreditCard />
                      <FieldTitle className="text-[#161D17] text-base font-normal">
                        Yape
                      </FieldTitle>
                    </FieldContent>
                  </Field>
                </FieldLabel>
              </RadioGroup>
            </CollapsibleContent>
          </Collapsible>
          <div className="flex justify-between items-center pt-4">
            <p className="font-semibold text-lg text-muted-foreground">
              Monto Total:
            </p>
            <p className={`font-bold text-xl text-primary`}>
              S/ {orderDetail?.data?.total.toFixed(2)}
            </p>
          </div>
        </ScrollArea>
        <DrawerFooter>
          <Button
            onClick={handlerUpdateStatus}
            className="w-full cursor-pointer rounded-[12px] py-6! text-base"
          >
            Finalizar Pedido
          </Button>
          <DrawerClose asChild>
            <Button
              type="button"
              className="w-full cursor-pointer rounded-[12px] text-base py-6! outline-none text-[#43474F] font-bold"
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
