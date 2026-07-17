import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type {
  CreateOrderPayload,
  updateOrder,
  // OrderDetailResponseType,
} from '@/interfaces/orders.interface';
import { OrdersKeys } from '@/lib/querykeys';
import ordersService from '@/services/orders.service';
import { toast } from 'sonner';
import { toastStyles } from '@/lib/toast';
import { useCartStore } from '@/stores/cart.store';
import { useBusinessStore } from '@/stores/business.store';
import { useEffect } from 'react';

export function useCreateOrder(slug: string) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { order_id } = useBusinessStore();

  return useMutation({
    mutationFn: (data: CreateOrderPayload) => ordersService.create(data, slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OrdersKeys.all });
      useCartStore.getState().clear();
      if (order_id) {
        toast.success('Pedido actualizado', toastStyles.success);
        navigate('/admin/orders');
      }
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
  const queryClient = useQueryClient();
  const API = import.meta.env.VITE_API_DEV;

  useEffect(() => {
    if (!slug) return;

    const eventSource = new EventSource(`${API}/orders/stream/${slug}`);

    eventSource.onmessage = () => {
      queryClient.invalidateQueries({ queryKey: OrdersKeys.all });
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [slug, queryClient]);
}
