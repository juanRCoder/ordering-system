import { useNavigate } from 'react-router-dom';
import authService from '@/services/auth.service';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import type { RegisterFormType } from '@/interfaces/auth.interface';
import { UsersKeys } from '@/lib/querykeys';
import { toast } from 'sonner';
import { toastStyles } from '@/lib/toast';
import type { ErrorResponse } from '@/interfaces/errors.interface';

export function useRegister() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterFormType) => authService.register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: UsersKeys.me });
      toast.success('Registro exitoso!', toastStyles.success);
      navigate('/menu');
    },
    onError: (error: ErrorResponse) => {
      if (error?.status === 409) {
        toast.error(
          'Error: El correo ya se encuentra registrado',
          toastStyles.error
        );
      } else {
        toast.error('Error al registrarse', toastStyles.error);
      }
      console.error(error);
    },
  });
}
