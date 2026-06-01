import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { TypeSupplyType } from '@/interfaces/typesSupplies.interface';
import { TypesSuppliesKeys } from '@/lib/querykeys';
import typeSuppliesService from '@/services/typeSupply.service';
import { toastStyles } from '@/lib/toast';

export function useCreateTypeSupply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TypeSupplyType) => typeSuppliesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TypesSuppliesKeys.all });
    },
    onError: () => {
      toast.error('Error al crear una nuevo tipo de insumo', toastStyles.error);
    },
  });
}

export function useTypesSupplies() {
  return useQuery({
    queryKey: TypesSuppliesKeys.all,
    queryFn: () => typeSuppliesService.getAll(),
  });
}
