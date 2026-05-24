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
import { useState } from 'react';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '../ui/collapsible';

type propsOrderDetailItem = {
  quantity: number;
  product: string;
  price: number;
};
export const OrderDetailItem = ({
  quantity,
  product,
  price,
}: propsOrderDetailItem) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <span className="shrink-0 h-8 w-8 rounded-lg bg-[#D8E9FF]/50 grid place-items-center">
          {quantity}
        </span>
        <p>{product}</p>
      </div>
      <span className="text-primary font-medium">${price}</span>
    </div>
  );
};

type props = {
  externalTrigger?: boolean;
  setExternalTrigger: (e: boolean) => void;
};

export const OrderDetailsDrawer = ({
  externalTrigger,
  setExternalTrigger,
}: props) => {
  const [openPaymentMethods, setOpenPaymentMethods] = useState<boolean>(false);
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
        <ScrollArea className="overflow-y-auto px-4 pt-0 pb-4">
          <div className="relative py-4">
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold">Jose Estrada</h2>
              <p className="text-muted-foreground text-sm">
                Order #241250 • Hace 12 minutos
              </p>
            </div>
            <span className="absolute top-0 right-0 text-xs font-medium px-3 py-1 rounded-full text-[#43474F] border border-0.5">
              Pendiente
            </span>
            <ScrollArea className="h-40 max-h-40 w-full mt-3">
              <div className="flex flex-col gap-3">
                <OrderDetailItem
                  quantity={1}
                  product={'Combinado de Pescado'}
                  price={12.0}
                />
                <OrderDetailItem
                  quantity={1}
                  product={'Combinado de Pescado'}
                  price={12.0}
                />
                <OrderDetailItem
                  quantity={1}
                  product={'Limonada'}
                  price={5.0}
                />
              </div>
            </ScrollArea>
          </div>
          <div className="py-4 border-t">
            <p className="text-base font-semibold text-[#031C30]">
              Observaciones:
            </p>
            <textarea
              disabled
              value="Sin observaciones"
              placeholder="Escribe aquí tus observaciones"
              className="mt-2 text-sm w-full h-24 rounded-lg p-4 outline-none resize-none border bg-[#F8F9FA] text-[#6B7280]"
            />
          </div>
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
            <CollapsibleContent className="flex flex-col gap-4 py-4">
              <RadioGroup defaultValue="efectivo" className="w-full">
                <FieldLabel htmlFor="efectivo" className="rounded-xl!">
                  <Field
                    orientation="horizontal"
                    className="py-4! cursor-pointer"
                  >
                    <FieldContent className="flex flex-row items-center gap-2">
                      <Coins />
                      <FieldTitle className="text-[#161D17] text-base font-normal">
                        Efectivo
                      </FieldTitle>
                    </FieldContent>
                    <RadioGroupItem value="efectivo" id="efectivo" />
                  </Field>
                </FieldLabel>
                <FieldLabel htmlFor="yape-plin" className="rounded-xl!">
                  <Field
                    orientation="horizontal"
                    className="py-4! cursor-pointer"
                  >
                    <FieldContent className="flex flex-row items-center gap-2">
                      <CreditCard />
                      <FieldTitle className="text-[#161D17] text-base font-normal">
                        Yape / Plin
                      </FieldTitle>
                    </FieldContent>
                    <RadioGroupItem value="yape-plin" id="yape-plin" />
                  </Field>
                </FieldLabel>
              </RadioGroup>
            </CollapsibleContent>
          </Collapsible>
          <div className="flex justify-between items-center py-4">
            <p className="font-semibold text-lg text-muted-foreground">
              Monto Total:
            </p>
            <p className={`font-bold text-xl text-primary`}>S/ 20.00</p>
          </div>
        </ScrollArea>
        <DrawerFooter>
          <Button className="w-full cursor-pointer rounded-[12px] py-6! text-base">
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
