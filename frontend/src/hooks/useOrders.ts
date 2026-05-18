import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { OrderType } from '@/interfaces/orders.interface';
import { OrdersKeys } from '@/lib/querykeys';
import ordersService from '@/services/orders.service';
import { toast } from 'sonner';
import { toastStyles } from '@/lib/toast';

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: OrderType) => ordersService.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: OrdersKeys.all });
      navigate(`/order-received/${response.data.id}`);
    },
    onError: () => {
      toast.error('Error al crear pedido', toastStyles.error);
    },
  });
}
