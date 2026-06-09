import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Image } from 'lucide-react';
import { InputField } from '../InputField';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { FieldLabel } from '../ui/field';
import { Button } from '../ui/button';
import { useTypesSupplies } from '@/hooks/useTypesSupplies';
import {
  useCreateSupply,
  useSupplyById,
  useUpdateSupply,
} from '@/hooks/useSupplies';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { CreateSupplyType } from '@/interfaces/supplies.interface';
import { createSupplySchema } from '@/schemas/supplies.schema';
import { supplyFormValues } from '@/lib/default';
import type { TypeSupplyResponse } from '@/interfaces/typesSupplies.interface';

type props = {
  externalTrigger?: boolean;
  setExternalTrigger: (e: boolean) => void;
  mode?: 'create' | 'edit';
  id?: string;
};

export const SupplyDialog = ({
  externalTrigger,
  setExternalTrigger,
  mode = 'create',
  id,
}: props) => {
  const typesSupplies = useTypesSupplies();
  const createSupply = useCreateSupply();
  const getSupplyById = useSupplyById(id || '');
  const updateSupply = useUpdateSupply();

  const [typeSupplyId, setTypeSupplyId] = useState<string>('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateSupplyType>({
    resolver: zodResolver(createSupplySchema),
    defaultValues: supplyFormValues,
  });

  useEffect(() => {
    if (typesSupplies.data?.length) {
      setTypeSupplyId(typesSupplies.data[0].id);
    }
  }, [typesSupplies.data]);

  useEffect(() => {
    if (mode === 'edit' && id) {
      reset({
        name: getSupplyById.data?.name,
        price: getSupplyById.data?.price,
        description: getSupplyById.data?.description,
      });
      setTypeSupplyId(getSupplyById.data?.type_supply_id || '');
    }
  }, [getSupplyById.data]);

  const selectedTypeSupply = typesSupplies.data?.find(
    (ts: TypeSupplyResponse) => ts.id === typeSupplyId
  );

  const isEditMode = mode === 'edit';

  const onSubmit = (data: CreateSupplyType) => {
    if (isEditMode) {
      updateSupply.mutate(
        {
          id,
          data: {
            ...data,
            type_supply_id: typeSupplyId,
          },
        },
        {
          onSuccess: () => {
            setExternalTrigger(false);
          },
        }
      );
    } else {
      createSupply.mutate(
        {
          ...data,
          type_supply_id: typeSupplyId,
        },
        {
          onSuccess: () => {
            setExternalTrigger(false);
          },
        }
      );
    }
  };

  return (
    <Dialog open={externalTrigger} onOpenChange={setExternalTrigger}>
      <DialogContent className="w-full sm:max-w-104 rounded-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl">
              {isEditMode ? 'Editar' : 'Crear'} Producto
            </DialogTitle>
          </DialogHeader>
          <section>
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-[#43474F] font-semibold mb-2">
                    Imagen
                  </label>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg"
                      className="hidden"
                    />

                    <div className="border border-[#C3C6D0] rounded-sm bg-[#F8F9FA] h-28 flex flex-col items-center justify-center hover:bg-[#F3F4F6] transition-colors">
                      <Image
                        className="w-14 h-14 text-[#6B7280] mb-2"
                        strokeWidth={1.5}
                      />

                      <p className="text-[#6B7280] text-xs text-center">
                        Archivos png - jpg
                      </p>
                      {/* <img
                        src="/insumo.jpg"
                        alt="insumo"
                        className="w-full h-full object-cover"
                      /> */}
                    </div>
                  </label>
                </div>
                <div className="w-3/5 flex flex-col gap-2">
                  <InputField
                    {...register('name')}
                    error={errors.name?.message}
                    label="Nombre*"
                    type="text"
                  />
                  <InputField
                    {...register('price', {
                      valueAsNumber: true,
                    })}
                    error={errors.price?.message}
                    label="Precio*"
                    type="number"
                    step="0.01"
                    leftSuffix={
                      <span className="text-[#6B7280] font-semibold">S/.</span>
                    }
                  />
                </div>
              </div>
              <div className="w-full">
                <FieldLabel className="text-[#43474F] font-semibold mb-2">
                  Tipo de Insumo*
                </FieldLabel>
                <Select
                  value={typeSupplyId}
                  onValueChange={(value) => setTypeSupplyId(value ?? '')}
                >
                  <SelectTrigger className="w-full bg-[#F8F9FA] border border-gray-300 rounded-lg px-3">
                    <SelectValue>{selectedTypeSupply?.name}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Tipos</SelectLabel>
                      {typesSupplies.data?.map((ts: TypeSupplyResponse) => (
                        <SelectItem key={ts.id} value={ts.id}>
                          {ts.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>
          <DialogFooter>
            <Button
              type="submit"
              className="w-full h-12 rounded-sm mt-4 cursor-pointer"
            >
              {isEditMode ? 'EDITAR' : 'CREAR'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
