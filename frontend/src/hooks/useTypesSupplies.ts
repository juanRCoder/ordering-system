import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type {
  TypeSupplyType,
  UpdateTypeSupplyType,
} from '@/interfaces/typesSupplies.interface';
import { TypesSuppliesKeys } from '@/lib/querykeys';
import typeSuppliesService from '@/services/typeSupply.service';
import { toastStyles } from '@/lib/toast';

export function useCreateTypeSupply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TypeSupplyType) => typeSuppliesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TypesSuppliesKeys.all });
      toast.success('Categoria creada con exito!', toastStyles.success);
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

export function useTypeSupplyById(id: string) {
  return useQuery({
    queryKey: TypesSuppliesKeys.byId(id),
    queryFn: () => typeSuppliesService.getById(id),
    enabled: !!id,
  });
}

export function useUpdateTypeSupply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTypeSupplyType }) =>
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
