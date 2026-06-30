import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type {
  NewOrderType,
  updateOrder,
  // OrderDetailResponseType,
} from '@/interfaces/orders.interface';
import { OrdersKeys } from '@/lib/querykeys';
import ordersService from '@/services/orders.service';
import { toast } from 'sonner';
import { toastStyles } from '@/lib/toast';
import { useCartStore } from '@/stores/cart.store';

export function useCreateOrder(slug: string) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: NewOrderType) => ordersService.create(data, slug),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: OrdersKeys.all });
      useCartStore.getState().clear();
      toast.success('Pedido creado con éxito', toastStyles.success);
      navigate(`/${slug}/order-received/${response.data.order_id}`);
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

export function useOrderByIdQuery(id: string) {
  return useQuery({
    queryKey: OrdersKeys.byId(id),
    queryFn: () => ordersService.getById(id),
    enabled: !!id,
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: updateOrder) => ordersService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OrdersKeys.all });
      toast.success('Pedido finalizado con éxito', toastStyles.success);
    },
    onError: () => {
      toast.error('Error al finalizar el pedido', toastStyles.error);
    },
  });
}
