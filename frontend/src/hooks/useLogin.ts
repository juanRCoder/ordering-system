import { useNavigate } from 'react-router-dom';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import type { ErrorResponse } from '@/interfaces/errors.interface';
import type { LoginFormType } from '@/interfaces/auth.interface';
import authService from '@/services/auth.service';
import { UsersKeys } from '@/lib/querykeys';
import { toast } from 'sonner';
import { toastStyles } from '@/lib/toast';

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginFormType) => authService.login(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: UsersKeys.me });
      toast.success('Inicio de sesión exitoso!', toastStyles.success);
      navigate('/menu');
    },
    onError: (error: ErrorResponse) => {
      if (error?.status === 401) {
        toast.error(
          'Error: Usuario o contraseña incorrectos',
          toastStyles.error
        );
      } else {
        toast.error('Error al iniciar sesión', toastStyles.error);
      }
      console.error(error);
    },
  });
}
