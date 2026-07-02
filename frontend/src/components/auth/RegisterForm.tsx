import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/schemas/auth.schema';
import { useRegister } from '@/hooks/useAuth';
import { InputField } from '@/components/InputField';
import type { RegisterFormType } from '@/interfaces/auth.interface';
import { defaultRegisterFormValues } from '@/lib/default';
import { HeaderForm } from '@/pages/Auth';
import { Button } from '@/components/ui/button';
import { LockKeyhole, Mail, User } from 'lucide-react';

export const RegisterForm = ({ onToggle }: { onToggle: () => void }) => {
  const registerMutation = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormType>({
    resolver: zodResolver(registerSchema),
    defaultValues: defaultRegisterFormValues,
  });

  const onSubmit = (data: RegisterFormType) => registerMutation.mutate(data);

  return (
    <div className="flex flex-col gap-8">
      <HeaderForm
        title="Crear Cuenta"
        subtitle="Únete a nosotros para empezar a pedir"
      />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <InputField
          {...register('name')}
          id="name"
          label="Nombre Completo"
          placeholder="Ej: Juan Pérez"
          icon={User}
          error={errors.name?.message}
        />
        <InputField
          {...register('email')}
          id="email"
          label="Correo electrónico"
          placeholder="ejemplo@crave.com"
          icon={Mail}
          error={errors.email?.message}
        />
        <InputField
          {...register('password')}
          id="password"
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          icon={LockKeyhole}
          error={errors.password?.message}
        />
        <Button
          type="submit"
          variant="default"
          className="h-12 cursor-pointer mt-4"
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? 'Creando...' : 'Crear Cuenta'}
        </Button>
      </form>
      <p className="text-sm text-center font-semibold">
        ¿Ya tienes una cuenta?{' '}
        <span
          onClick={onToggle}
          className="text-primary cursor-pointer underline"
        >
          Inicia Sesión
        </span>
      </p>
    </div>
  );
};
