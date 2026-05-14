import { LockKeyhole, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { LoginFormType } from '@/interfaces/auth.interface';
import { loginSchema } from '@/schemas/auth.schema';
import { useLogin } from '@/hooks/useLogin';
import { defaultLoginFormValues } from '@/lib/default';
import { InputField } from '../InputField';
import { Button } from '../ui/button';
import { GoogleButton, HeaderForm } from '@/pages/Auth';

export const LoginForm = ({ onToggle }: { onToggle: () => void }) => {
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: defaultLoginFormValues,
  });

  const onSubmit = (data: LoginFormType) => login.mutate(data);

  return (
    <div className="flex flex-col gap-8">
      <HeaderForm
        title="Bienvenido de nuevo"
        subtitle="Inicia sesión para continuar tu experiencia"
      />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <InputField
          id="email"
          label="Correo electrónico"
          placeholder="ejemplo@crave.com"
          icon={Mail}
          {...register('email')}
          error={errors.email?.message}
        />
        <InputField
          id="password"
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          icon={LockKeyhole}
          {...register('password')}
          error={errors.password?.message}
        />
        <Button
          type="submit"
          variant="default"
          disabled={login.isPending}
          className="h-12 cursor-pointer"
        >
          {login.isPending ? 'Iniciando Sesión...' : 'Inicia Sesión'}
        </Button>
      </form>
      <p className="text-sm text-center font-semibold">
        ¿Aun no tienes una cuenta?{' '}
        <span
          onClick={onToggle}
          className="text-primary cursor-pointer underline"
        >
          Crear Cuenta
        </span>
      </p>
      <div className="flex items-center gap-3">
        <hr className="flex-1 border-[#C3C6D0]" />
        <span className="text-sm text-[#9CA3AF]">O iniciar sesión con</span>
        <hr className="flex-1 border-[#C3C6D0]" />
      </div>
      <GoogleButton label="Iniciar sesión con Google" />
    </div>
  );
};
