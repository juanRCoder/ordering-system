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
import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { CreateSupplyType } from '@/interfaces/supplies.interface';
import { createSupplySchema } from '@/schemas/supplies.schema';
import { supplyFormValues } from '@/lib/default';
import type { CategoryResponse } from '@/interfaces/categories.interface';
import { Image, Pencil, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileRef = useRef<HTMLInputElement | null>(null);

  const categories = useCategories();
  const createSupply = useCreateSupply();
  const supplyById = useSupplyById(id || '');
  const updateSupply = useUpdateSupply();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateSupplyType>({
    resolver: zodResolver(createSupplySchema),
    defaultValues: supplyFormValues,
  });

  const priceValue = watch('price');

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
        image_url: supplyById.data?.image_url ?? '',
        image_public_id: supplyById.data?.image_public_id ?? '',
      });
      setSelectedCategoryId(supplyById.data?.category_id || '');
      setImagePreview(supplyById.data?.image_url ?? '');
      setImageFile(null);
    } else {
      reset(supplyFormValues);
      setImagePreview('');
      setImageFile(null);
    }
  }, [supplyById.data, mode]);

  const selectedCategory = categories.data?.find(
    (ts: CategoryResponse) => ts.id === selectedCategoryId
  );

  const isEditMode = mode === 'edit';
  const isPlatformEdit = origin === 'PLATFORM' && isEditMode;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setImageFile(file);
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    setImageFile(null);
    if (fileRef.current) {
      fileRef.current.value = '';
    }
  };

  const onSubmit = (data: CreateSupplyType) => {
    const formData = new FormData();

    for (const key in data) {
      const value = data[key as keyof CreateSupplyType];
      if (value === null || value === undefined) continue;
      if (key === 'image_url') continue;
      formData.append(key, value as string);
    }
    formData.append('category_id', selectedCategoryId);

    if (imageFile) {
      formData.append('image_url', imageFile);
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
      <DialogContent
        showCloseButton={false}
        className="w-full gap-0 overflow-hidden rounded-2xl bg-white p-0 shadow-xl shadow-[#0F2A4A]/15 ring-foreground/5 sm:max-w-104"
      >
        <div className="animate-fadeIn relative h-40 w-full shrink-0 overflow-hidden">
          {isPlatformEdit || imagePreview ? (
            <>
              <img
                src={
                  isPlatformEdit
                    ? supplyById.data?.image_url || '/no_image.webp'
                    : imagePreview
                }
                alt={isPlatformEdit ? supplyById.data?.name : 'Vista previa'}
                className="absolute inset-0 h-full w-full object-cover"
              />
              {!isPlatformEdit && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute bottom-2 left-2 z-10 rounded-md bg-white/90 px-2 py-1 text-[10px] font-semibold tracking-wider uppercase shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-[#C2410C]"
                >
                  Remover
                </button>
              )}
            </>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex h-full w-full flex-col items-center justify-center gap-1.5 border-2 border-dashed border-[#C7D2F4] bg-[#F4F6FC] text-[#6B7280] transition-colors hover:border-[#3B5BDB] hover:bg-[#EEF1FA] hover:text-[#3B5BDB]"
            >
              <Image className="h-8 w-8" strokeWidth={1.5} />
              <span className="text-xs font-semibold">Sube una foto</span>
              <span className="text-[10px] text-[#94A3B8]">
                .png, .jpg o .jpeg
              </span>
            </button>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0F2A4A]/45 via-transparent to-transparent" />

          {origin && (
            <span
              className={cn(
                'absolute top-3 left-3 rounded-md bg-white/95 px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase shadow-sm backdrop-blur-sm',
                origin === 'PLATFORM' ? 'text-[#3B5BDB]' : 'text-[#15803D]'
              )}
            >
              {origin === 'PLATFORM' ? 'Plataforma' : 'Propio'}
            </span>
          )}

          <div className="absolute right-3 bottom-3 rounded-lg bg-[#0F2A4A] px-3 py-1.5 text-white shadow-md shadow-[#0F2A4A]/30">
            <p className="text-[9px] font-semibold tracking-wider text-white/60 uppercase">
              Precio
            </p>
            <p
              className="text-base leading-tight font-bold"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              S/ {Number(priceValue || 0).toFixed(2)}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setExternalTrigger(false)}
          className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#475569] shadow-sm backdrop-blur-sm transition-all hover:rotate-90 hover:text-[#0F2A4A]"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Cerrar</span>
        </button>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader
            className="animate-fadeIn gap-1 px-5 pt-4 pb-3"
            style={{ animationDelay: '60ms' }}
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold tracking-[0.18em] text-[#3B5BDB] uppercase">
                Administración · Insumo
              </p>
              {isEditMode && (
                <span className="text-[10px] font-medium text-[#94A3B8]">
                  No. {id?.slice(0, 8).toUpperCase()}
                </span>
              )}
            </div>
            <DialogTitle
              className="text-xl font-bold tracking-tight text-[#0F2A4A]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {isEditMode ? 'Editar' : 'Nuevo'} insumo
            </DialogTitle>
            <p className="text-xs text-[#64748B]">
              Los cambios se reflejan al instante en tu menú
            </p>
          </DialogHeader>

          <div className="flex flex-col gap-5 px-5 pt-3">
            <div className="animate-fadeIn" style={{ animationDelay: '120ms' }}>
              <InputField
                {...register('name')}
                id="supply-name"
                error={errors.name?.message}
                label="Nombre*"
                type="text"
              />
            </div>

            <div className="animate-fadeIn" style={{ animationDelay: '180ms' }}>
              <InputField
                {...register('price', {
                  valueAsNumber: true,
                })}
                id="supply-price"
                error={errors.price?.message}
                label="Precio*"
                type="number"
                step="0.01"
                leftSuffix={
                  <span className="font-semibold text-[#6B7280]">S/.</span>
                }
              />
            </div>

            {(origin === 'ADMIN' || !isEditMode) && (
              <div
                className="animate-fadeIn flex w-full flex-col"
                style={{ animationDelay: '240ms' }}
              >
                <FieldLabel className="text-[#43474F] font-semibold mb-2 text-sm">
                  Tipo de insumo*
                </FieldLabel>
                <Select
                  value={selectedCategoryId}
                  onValueChange={(value) => setSelectedCategoryId(value ?? '')}
                >
                  <SelectTrigger className="w-full rounded-lg border-[#C3C6D0] bg-[#F8F9FA] px-3">
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
            )}
          </div>

          <DialogFooter className="px-5 pt-5 pb-5">
            <Button
              type="submit"
              className="h-12 w-full cursor-pointer rounded-lg bg-[#0F2A4A] font-semibold tracking-wider text-white uppercase hover:bg-[#0F2A4A]/90"
            >
              {isEditMode ? (
                <Pencil className="h-4 w-4" strokeWidth={2.25} />
              ) : (
                <Plus className="h-4 w-4" strokeWidth={2.5} />
              )}
              {isEditMode ? 'Editar' : 'Crear'} insumo
            </Button>
          </DialogFooter>
        </form>

        <input
          type="file"
          ref={fileRef}
          onChange={handleFileChange}
          accept=".png,.jpg,.jpeg"
          className="hidden"
        />
      </DialogContent>
    </Dialog>
  );
};
