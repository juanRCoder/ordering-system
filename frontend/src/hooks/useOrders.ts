import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type {
  CreateOrderPayload,
  updateOrder,
} from '@/interfaces/orders.interface';
import { OrdersKeys } from '@/lib/querykeys';
import ordersService from '@/services/orders.service';
import { toast } from 'sonner';
import { toastStyles } from '@/lib/toast';
import { useCartStore } from '@/stores/cart.store';
import { useBusinessStore } from '@/stores/business.store';
import { useSSEStream } from './useSSEStream';

export function useCreateOrder(slug: string) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const order_id = useBusinessStore((s) => s.order_id);

  return useMutation({
    mutationFn: (data: CreateOrderPayload) => ordersService.create(data, slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OrdersKeys.all });
      if (order_id) {
        useCartStore.getState().clear();
        toast.success('Pedido actualizado', toastStyles.success);
        navigate(`/${slug}/orders`);
      }
    },
    onError: () => {
      toast.error('Error al crear pedido', toastStyles.error);
    },
  });
}

export function useOrdersQuery(page = 1, status = 'PENDING', dateFilter = '') {
  return useQuery({
    queryKey: [...OrdersKeys.all, page, status, dateFilter],
    queryFn: () => ordersService.getAll(page, status, dateFilter),
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
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

export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ordersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OrdersKeys.all });
      toast.success('Pedido eliminado con éxito', toastStyles.success);
    },
    onError: () => {
      toast.error('Error al eliminar el pedido', toastStyles.error);
    },
  });
}

export function useOrdersStream(slug: string) {
  const API = import.meta.env.VITE_API_DEV;

  useSSEStream(slug, `${API}/orders/stream/${slug}`, OrdersKeys.all);
}

export function useConfirmOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, is_confirmed }: { id: string; is_confirmed: boolean }) =>
      ordersService.confirm(id, is_confirmed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OrdersKeys.all });
    },
    onError: () => {
      toast.error('Error al confirmar el pedido', toastStyles.error);
    },
  });
}
