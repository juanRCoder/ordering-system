import { useNavigate } from 'react-router-dom';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import type { ErrorResponse } from '@/interfaces/errors.interface';
import type {
  LoginFormType,
  RegisterFormType,
} from '@/interfaces/auth.interface';
import authService from '@/services/auth.service';
import { UsersKeys } from '@/lib/querykeys';
import { toast } from 'sonner';
import { toastStyles } from '@/lib/toast';
import { useBusinessStore } from '@/stores/business.store';

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { setBusiness } = useBusinessStore();

  return useMutation({
    mutationFn: (data: LoginFormType) => authService.login(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: UsersKeys.me });
      toast.success('Inicio de sesión exitoso', toastStyles.success);
      if (data.role === 'ADMIN') {
        setBusiness({ business_name: data.business_name, slug: data.slug });
        navigate('/admin/orders');
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
        toast.error('El correo ya se encuentra registrado', toastStyles.error);
      } else {
        toast.error('Error al registrarse', toastStyles.error);
      }
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { clearBusiness } = useBusinessStore();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: UsersKeys.me });
      clearBusiness();
      navigate('/auth', { replace: true });
    },
    onError: () => {
      toast.error('Error al cerrar sesión', toastStyles.error);
    },
  });
}
