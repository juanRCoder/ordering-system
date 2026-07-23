import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SuppliesKeys } from '@/lib/querykeys';
import suppliesService from '@/services/supplies.service';
import { toast } from 'sonner';
import { toastStyles } from '@/lib/toast';
import { useEffect } from 'react';

export function useCreateSupply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => suppliesService.create(data),
    onSuccess: (_, variables) => {
      const categoryId = String(variables.get('category_id') ?? '');
      queryClient.invalidateQueries({
        queryKey: SuppliesKeys.byTypeId(categoryId),
      });
      toast.success('Insumo agregado con éxito', toastStyles.success);
    },
    onError: () => {
      toast.error('Error al agregar insumo', toastStyles.error);
    },
  });
}

export function useSuppliesBySlug(
  slug: string,
  categoryId?: string,
  letters?: string,
  page = 1
) {
  return useQuery({
    queryKey: SuppliesKeys.bySlug(slug, categoryId || '', letters || '', page),
    queryFn: () =>
      suppliesService.getBySlug(slug, categoryId || '', letters || '', page),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

export function useSuppliesByAdmin(categoryId: string) {
  return useQuery({
    queryKey: SuppliesKeys.byAdmin(categoryId),
    queryFn: () => suppliesService.findByAdminId(categoryId),
    enabled: !!categoryId,
  });
}

export function useSupplyById(id: string) {
  return useQuery({
    queryKey: SuppliesKeys.byId(id),
    queryFn: () => suppliesService.getById(id),
    enabled: !!id,
  });
}

export function useUpdateSupplyStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => suppliesService.updateStatus(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: SuppliesKeys.all });

      toast.success(
        `${data.name} ${data.status === 'AVAILABLE' ? 'Disponible' : 'No disponible'}`,
        data.status === 'AVAILABLE' ? toastStyles.success : toastStyles.gray
      );
    },
    onError: () => {
      toast.error(
        'Error al actualizar el estado del insumo',
        toastStyles.error
      );
    },
  });
}

export function useSuppliesStream(slug: string) {
  const queryClient = useQueryClient();
  const API = import.meta.env.VITE_API_DEV;

  useEffect(() => {
    if (!slug) return;

    const eventSource = new EventSource(
      `${API}/supplies/stream/${slug}/status`,
      { withCredentials: true }
    );

    eventSource.onmessage = () => {
      queryClient.invalidateQueries({ queryKey: SuppliesKeys.all });
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [slug, queryClient]);
}

export function useUpdateSupply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      suppliesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SuppliesKeys.all });
      toast.success('Insumo actualizado con éxito', toastStyles.success);
    },
    onError: () => {
      toast.error('Error al actualizar el insumo', toastStyles.error);
    },
  });
}

export function useUpdateSupplyPriceStream(slug: string) {
  const queryClient = useQueryClient();
  const API = import.meta.env.VITE_API_DEV;

  useEffect(() => {
    if (!slug) return;

    const eventSource = new EventSource(
      `${API}/supplies/stream/${slug}/price`,
      { withCredentials: true }
    );

    eventSource.onmessage = () => {
      queryClient.invalidateQueries({ queryKey: SuppliesKeys.all });
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [slug, queryClient]);
}
