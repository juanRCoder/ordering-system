import { useMutation } from '@tanstack/react-query';
import type { RegisterFormType } from '@/schemas/auth.schema';
import authService from '@/services/auth.service';
import { useNavigate } from 'react-router-dom';

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterFormType) => authService.register(data),
    onSuccess: () => navigate('/'),
    onError: (error) => console.error('Error al registrar:', error),
  });
}
