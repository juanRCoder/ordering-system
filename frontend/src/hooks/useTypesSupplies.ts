import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ErrorResponse } from '@/interfaces/errors.interface';
import type { TypeSupplyType } from '@/interfaces/typesSupplies.interface';
import { TypesSuppliesKeys } from '@/lib/querykeys';
import typeSuppliesService from '@/services/typeSupply.service';

export function useCreateTypeSupply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TypeSupplyType) => typeSuppliesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TypesSuppliesKeys.all });
    },
    onError: (error: ErrorResponse) => {
      console.error(error);
    },
  });
}

export function useTypesSupplies() {
  return useQuery({
    queryKey: TypesSuppliesKeys.all,
    queryFn: () => typeSuppliesService.getAll(),
  });
}
