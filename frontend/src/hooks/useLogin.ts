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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: UsersKeys.me });
      toast.success('Inicio de sesión exitoso', toastStyles.success);

      if (data.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/menu');
      }
    },
    onError: (error: ErrorResponse) => {
      if (
        error?.code === 'USER_NOT_FOUND' ||
        error?.code === 'INVALID_PASSWORD'
      ) {
        toast.error('Usuario o contraseña incorrectos', toastStyles.error);
      } else {
        toast.error('Error al iniciar sesión', toastStyles.error);
      }
    },
  });
}
