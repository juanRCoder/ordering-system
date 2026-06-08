import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateSupplyType } from '@/interfaces/supplies.interface';
import { SuppliesKeys } from '@/lib/querykeys';
import suppliesService from '@/services/supplies.service';
import { toast } from 'sonner';
import { toastStyles } from '@/lib/toast';

export function useCreateSupply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSupplyType) => suppliesService.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: SuppliesKeys.byTypeId(String(variables.type_supply_id ?? '')),
      });
      toast.success('Insumo agregado con éxito', toastStyles.success);
    },
    onError: () => {
      toast.error('Error al agregar insumo', toastStyles.error);
    },
  });
}

export function useSuppliesByTypeId(type_id: string) {
  return useQuery({
    queryKey: SuppliesKeys.byTypeId(type_id),
    queryFn: () => suppliesService.getByTypeId(type_id!),
    enabled: !!type_id,
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
