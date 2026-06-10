import { CheckIcon, Pencil, XIcon } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '../ui/drawer';
import { ScrollArea } from '../ui/scroll-area';
import { InputField } from '../InputField';
import { useState } from 'react';
import { useTypesSupplies } from '@/hooks/useTypesSupplies';
import type { TypeSupplyResponse } from '@/interfaces/typesSupplies.interface';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateTypeSupplySchema } from '@/schemas/typesSupplies.schema';

type props = {
  externalTrigger: boolean;
  setExternalTrigger: (open: boolean) => void;
};

export const CategoriesDrawer = ({
  externalTrigger,
  setExternalTrigger,
}: props) => {
  const [supplyId, setSupplyId] = useState<string | null>(null);

  const typesSupplies = useTypesSupplies();

  const { register, handleSubmit, setValue } = useForm<{ name: string }>({
    resolver: zodResolver(updateTypeSupplySchema),
    defaultValues: { name: '' },
  });

  const handleEditMode = (id: string) => {
    setSupplyId(id);
    const supply = typesSupplies.data?.find(
      (ts: TypeSupplyResponse) => ts.id === id
    );
    if (supply) {
      setValue('name', supply.name);
    }
  };

  const onsubmit = (data: { name: string }) => {
    console.log(data);
    setSupplyId(null);
  };

  return (
    <Drawer
      direction="bottom"
      open={externalTrigger}
      onOpenChange={setExternalTrigger}
    >
      <DrawerContent className="w-full max-w-md mx-auto px-4">
        <DrawerTitle className="sr-only">Categorias</DrawerTitle>
        <DrawerHeader className="text-xl font-semibold text-primary">
          <DrawerTitle>Categorias</DrawerTitle>
        </DrawerHeader>
        <Button
          variant="outline"
          className="my-4 py-5.5 rounded-sm cursor-pointer"
        >
          Crear Categoria
        </Button>
        <ScrollArea className="overflow-y-auto pt-0">
          <section className="flex flex-col gap-2">
            {typesSupplies.data?.map((ts: TypeSupplyResponse) => (
              <form
                key={ts.id}
                onSubmit={handleSubmit(onsubmit)}
                className="flex flex-row items-center justify-between gap-2 border rounded-sm p-2"
              >
                <div className="flex flex-col">
                  {supplyId === ts.id ? (
                    <InputField
                      {...register('name')}
                      className="w-full text-base border-none focus:outline-none focus:ring-0"
                    />
                  ) : (
                    <>
                      <p className="text-base">{ts.name}</p>
                      <p className="text-xs text-destructive">
                        {ts.supplies_quantity} insumos vinculados
                      </p>
                    </>
                  )}
                </div>
                {supplyId === ts.id ? (
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-[#EFF6FF] cursor-pointer rounded-full w-12 h-12 flex items-center justify-center"
                    >
                      <CheckIcon className="text-primary" />
                    </button>
                    <span
                      onClick={() => setSupplyId(null)}
                      className="bg-destructive/10 border-destructive cursor-pointer rounded-full w-12 h-12 flex items-center justify-center"
                    >
                      <XIcon className="text-destructive" />
                    </span>
                  </div>
                ) : (
                  <span
                    onClick={() => handleEditMode(ts.id)}
                    className="bg-[#EFF6FF] cursor-pointer rounded-full w-12 h-12 flex items-center justify-center"
                  >
                    <Pencil className="text-primary" />
                  </span>
                )}
              </form>
            ))}
          </section>
        </ScrollArea>
        <DrawerClose asChild>
          <Button
            type="button"
            className="w-full cursor-pointer rounded-sm text-base py-6! outline-none text-[#43474F] font-bold mb-4 mt-8"
            variant="outline"
          >
            Volver
          </Button>
        </DrawerClose>
      </DrawerContent>
    </Drawer>
  );
};
