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
import { useOrderByIdQuery, useUpdateOrderStatus } from '@/hooks/useOrders';
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
  const [typePay, setTypePay] = useState<'CASH' | 'YAPE'>('CASH');
  const [orderStatus, setOrderStatus] = useState<'PENDING' | 'FINISHED'>(
    'PENDING'
  );
  const [tipo, setTipo] = useState<string[]>(['local']);

  const orderDetail = useOrderByIdQuery(selectedOrderId!);
  const updateStatus = useUpdateOrderStatus();

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
        <DrawerHeader className="text-xl font-semibold">
          <DrawerTitle className="text-[#001B39]">
            Resumen del pedido
          </DrawerTitle>
        </DrawerHeader>
        <ScrollArea className="overflow-y-auto px-3 pt-0">
          {orderDetail.isLoading ? (
            <OrderDetailSkeleton />
          ) : (
            <>
              <div className="relative pb-4">
                <div className="flex flex-col gap-1">
                  <p className="uppercase text-[#42474F] text-sm font-semibold">
                    ORDEN #{orderDetail?.data?.id?.slice(0, 6)}
                  </p>
                  <h2 className="text-[22px] font-semibold">
                    {orderDetail?.data?.guest_name}
                  </h2>
                </div>
                <div className="flex flex-col gap-1 mt-3">
                  <p className="uppercase text-[#42474F] text-sm font-semibold">
                    RESUMEN DE PEDIDOS
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
                            S/ {supply.price}
                          </span>
                        </div>
                        {supply.observations && (
                          <p className="text-[#43474F] text-xs border-l border-border ml-3 px-3 mt-2">
                            {supply.observations}
                          </p>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            </>
          )}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium mb-2">TIPO DE PEDIDO</p>
            <ToggleGroup
              value={tipo}
              onValueChange={(val: string[]) => {
                if (val.length > 0) setTipo(val);
              }}
              className="border rounded-sm w-full gap-0! h-12!"
            >
              <ToggleGroupItem
                value="local"
                className="flex-1 aria-pressed:bg-[#001B39]! aria-pressed:text-white! h-full rounded-r-none"
              >
                EN LOCAL
              </ToggleGroupItem>
              <ToggleGroupItem
                value="whatsapp"
                className="flex-1 aria-pressed:bg-[#001B39]! aria-pressed:text-white! h-full rounded-l-none"
              >
                WHATSAPP
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="flex items-center justify-between gap-4">
            <p className="text-base font-semibold text-[#031C30]">
              Metodos de Pago:
            </p>
          </div>
          <RadioGroup
            value={typePay}
            onValueChange={(val) => setTypePay(val as 'CASH' | 'YAPE')}
            className="w-full"
          >
            <FieldLabel htmlFor="CASH" className="rounded-xl!">
              <Field orientation="horizontal" className="py-4! cursor-pointer">
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
              <Field orientation="horizontal" className="py-4! cursor-pointer">
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
