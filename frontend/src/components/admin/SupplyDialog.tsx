import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { InputFile } from '../InputFile';

type props = {
  externalTrigger?: boolean;
  setExternalTrigger: (e: boolean) => void;
  mode?: 'create' | 'edit';
  id?: string;
  origin?: string;
};

export const SupplyDialog = ({
  externalTrigger,
  setExternalTrigger,
  mode = 'create',
  id,
  origin,
}: props) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);

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
        imageUrl: supplyById.data?.image_url ?? '',
        imagePublicId: supplyById.data?.image_public_id ?? '',
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
  const existingImageUrl = isEditMode ? supplyById.data?.image_url : '';

  const onSubmit = (data: CreateSupplyType) => {
    const formData = new FormData();

    for (const key in data) {
      const value = data[key as keyof CreateSupplyType];
      if (value === null || value === undefined) continue;
      if (key === 'imageUrl') continue;
      formData.append(key, value as string);
    }
    formData.append('category_id', selectedCategoryId);

    if (imageFile) {
      formData.append('imageUrl', imageFile);
    }

    if (mode === 'edit' && id) {
      updateSupply.mutate(
        { id, data: formData },
        { onSuccess: () => setExternalTrigger(false) }
      );
    } else {
      createSupply.mutate(formData, {
        onSuccess: () => setExternalTrigger(false),
      });
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
                {origin === 'PLATFORM' ? (
                  <>
                    <label className="block text-[#43474F] font-semibold mb-2 text-sm">
                      Imagen
                    </label>
                    <img
                      src={supplyById.data?.image_url}
                      alt={supplyById.data?.name}
                      className="object-contain w-full h-full rounded-sm"
                    />
                  </>
                ) : (
                  <InputFile
                    alt="Imagen del producto"
                    value={existingImageUrl}
                    onChange={(file) => {
                      setImageFile(file);
                    }}
                  />
                )}
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
