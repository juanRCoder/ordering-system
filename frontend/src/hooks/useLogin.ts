import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { LoginFormType } from '@/schemas/auth.schema';
import authService from '@/services/auth.service';
import { useQueryClient } from '@tanstack/react-query';
import { UsersKeys } from '@/lib/querykeys';
import type { ErrorResponse } from '@/interfaces/errors.interface';

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
