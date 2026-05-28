import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateSupplyType } from '@/interfaces/supplies.interface';
import { SuppliesKeys } from '@/lib/querykeys';
import suppliesService from '@/services/supplies.service';
import { toast } from 'sonner';
import { toastStyles } from '@/lib/toast';
import { useNavigate } from 'react-router-dom';

export function useCreateSupply() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreateSupplyType) => suppliesService.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: SuppliesKeys.byTypeId(String(variables.type_supply_id ?? '')),
      });
      toast.success('Insumo agregado con éxito', toastStyles.success);
      navigate('/admin');
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
