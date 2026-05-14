import { useNavigate } from 'react-router-dom';
import authService from '@/services/auth.service';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import type { RegisterFormType } from '@/interfaces/auth.interface';
import { UsersKeys } from '@/lib/querykeys';

export function useRegister() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterFormType) => authService.register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: UsersKeys.me });
      navigate('/menu');
    },
    onError: (error) => console.error(error),
  });
}
