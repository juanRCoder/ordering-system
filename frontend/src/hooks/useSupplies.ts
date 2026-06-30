import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SuppliesKeys } from '@/lib/querykeys';
import suppliesService from '@/services/supplies.service';
import { toast } from 'sonner';
import { toastStyles } from '@/lib/toast';

export function useCreateSupply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => suppliesService.create(data),
    onSuccess: (_, variables) => {
      const categoryId = String(variables.get('category_id') ?? '');
      queryClient.invalidateQueries({
        queryKey: SuppliesKeys.byTypeId(categoryId),
      });
      toast.success('Insumo agregado con éxito', toastStyles.success);
    },
    onError: () => {
      toast.error('Error al agregar insumo', toastStyles.error);
    },
  });
}

export function useSuppliesBySlug(slug: string, categoryId: string) {
  return useQuery({
    queryKey: SuppliesKeys.bySlug(slug, categoryId),
    queryFn: () => suppliesService.getBySlug(slug, categoryId),
    enabled: !!slug && !!categoryId,
  });
}

export function useSuppliesByAdmin(categoryId: string) {
  return useQuery({
    queryKey: SuppliesKeys.byAdmin(categoryId),
    queryFn: () => suppliesService.findByAdminId(categoryId),
    enabled: !!categoryId,
  });
}

export function useSupplyById(id: string) {
  return useQuery({
    queryKey: SuppliesKeys.byId(id),
    queryFn: () => suppliesService.getById(id),
    enabled: !!id,
  });
}

export function useUpdateSupplyStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => suppliesService.updateStatus(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: SuppliesKeys.all });

      toast.success(
        `${data.name} ${data.status === 'AVAILABLE' ? 'Disponible' : 'No disponible'}`,
        data.status === 'AVAILABLE' ? toastStyles.success : toastStyles.gray
      );
    },
    onError: () => {
      toast.error(
        'Error al actualizar el estado del insumo',
        toastStyles.error
      );
    },
  });
}

export function useUpdateSupply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      suppliesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SuppliesKeys.all });
      toast.success('Insumo actualizado con éxito', toastStyles.success);
    },
    onError: () => {
      toast.error('Error al actualizar el insumo', toastStyles.error);
    },
  });
}
