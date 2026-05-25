import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { NewOrderType } from '@/interfaces/orders.interface';
import { OrdersKeys } from '@/lib/querykeys';
import ordersService from '@/services/orders.service';
import { toast } from 'sonner';
import { toastStyles } from '@/lib/toast';
import { useCartStore } from '@/stores/cart.store';

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: NewOrderType) => ordersService.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: OrdersKeys.all });
      useCartStore.getState().clear();
      navigate(`/order-received/${response.data.id}`);
    },
    onError: () => {
      toast.error('Error al crear pedido', toastStyles.error);
    },
  });
}

export function useOrdersQuery() {
  return useQuery({
    queryKey: OrdersKeys.all,
    queryFn: () => ordersService.getAll(),
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'FINISHED' }) =>
      ordersService.updateStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OrdersKeys.all });
      toast.success('Pedido actualizado con éxito', toastStyles.success);
    },
    onError: () => {
      toast.error('Error al actualizar el pedido', toastStyles.error);
    },
  });
}
