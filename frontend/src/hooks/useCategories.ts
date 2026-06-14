import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type {
  CategoryType,
  UpdateCategoryType,
} from '@/interfaces/categories.interface';
import { TypesSuppliesKeys } from '@/lib/querykeys';
import typeSuppliesService from '@/services/categories.service';
import { toastStyles } from '@/lib/toast';

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CategoryType) => typeSuppliesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TypesSuppliesKeys.all });
      toast.success('Categoria creada con exito!', toastStyles.success);
    },
    onError: () => {
      toast.error('Error al crear una nuevo tipo de insumo', toastStyles.error);
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: TypesSuppliesKeys.all,
    queryFn: () => typeSuppliesService.getAll(),
  });
}

export function useTypeSupplyById(id: string) {
  return useQuery({
    queryKey: TypesSuppliesKeys.byId(id),
    queryFn: () => typeSuppliesService.getById(id),
    enabled: !!id,
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryType }) =>
      typeSuppliesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TypesSuppliesKeys.all });
      toast.success(
        'Tipo de insumo actualizado con éxito',
        toastStyles.success
      );
    },
    onError: () => {
      toast.error('Error al actualizar el tipo de insumo', toastStyles.error);
    },
  });
}
