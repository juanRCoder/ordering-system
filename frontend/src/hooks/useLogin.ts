import { useNavigate } from 'react-router-dom';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import type { ErrorResponse } from '@/interfaces/errors.interface';
import type { LoginFormType } from '@/interfaces/auth.interface';
import authService from '@/services/auth.service';
import { UsersKeys } from '@/lib/querykeys';

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginFormType) => authService.login(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: UsersKeys.me });
      navigate('/menu');
    },
    onError: (error: ErrorResponse) => {
      console.error(error);
    },
  });
}
