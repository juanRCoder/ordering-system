import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ErrorResponse } from '@/interfaces/errors.interface';
import type { SupplyType } from '@/interfaces/supplies.interface';
import { SuppliesKeys } from '@/lib/querykeys';
import suppliesService from '@/services/supplies.service';

export function useCreateSupply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SupplyType) => suppliesService.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: SuppliesKeys.byTypeId(variables.type_supply_id),
      });
    },
    onError: (error: ErrorResponse) => {
      console.error(error);
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
