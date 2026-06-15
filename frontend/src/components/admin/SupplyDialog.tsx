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
import { useCategories } from '@/hooks/useCategories';
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
import type { CategoryResponse } from '@/interfaces/categories.interface';

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
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  const categories = useCategories();
  const createSupply = useCreateSupply();
  const supplyById = useSupplyById(id || '');
  const updateSupply = useUpdateSupply();

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
    if (categories.data?.length && mode === 'create') {
      setSelectedCategoryId(categories.data[0].id);
    }
  }, [categories.data, mode]);

  useEffect(() => {
    if (mode === 'edit' && id) {
      reset({
        name: supplyById.data?.name ?? '',
        price: supplyById.data?.price ?? 1,
        description: supplyById.data?.description ?? '',
      });
      setSelectedCategoryId(supplyById.data?.category_id || '');
    } else {
      reset(supplyFormValues);
    }
  }, [supplyById.data, mode]);

  const selectedCategory = categories.data?.find(
    (ts: CategoryResponse) => ts.id === selectedCategoryId
  );

  const isEditMode = mode === 'edit';

  const onSubmit = (data: CreateSupplyType) => {
    if (isEditMode) {
      if (!id) return;
      updateSupply.mutate(
        {
          id,
          data: {
            ...data,
            category_id: selectedCategoryId,
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
          category_id: selectedCategoryId,
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
              <div className="w-full">
                <FieldLabel className="text-[#43474F] font-semibold mb-2">
                  Tipo de Insumo*
                </FieldLabel>
                <Select
                  value={selectedCategoryId}
                  onValueChange={(value) => setSelectedCategoryId(value ?? '')}
                >
                  <SelectTrigger className="w-full bg-[#F8F9FA] border border-gray-300 rounded-lg px-3">
                    <SelectValue>{selectedCategory?.name}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Tipos</SelectLabel>
                      {categories.data?.map((ts: CategoryResponse) => (
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
