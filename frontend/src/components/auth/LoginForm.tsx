import { Eye, LockKeyhole, Mail } from 'lucide-react';
import { InputField } from '../InputField';
import { Button } from '../ui/button';
import { GoogleButton, HeaderForm } from '@/pages/Auth';

export const LoginForm = ({ onToggle }: { onToggle: () => void }) => {
  return (
    <div className="flex flex-col gap-8">
      <HeaderForm
        title="Bienvenido de nuevo"
        subtitle="Inicia sesión para continuar tu experiencia"
      />
      <form className="flex flex-col gap-4">
        <InputField
          id="email"
          label="Correo electrónico"
          placeholder="ejemplo@crave.com"
          icon={Mail}
        />
        <InputField
          id="password"
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          icon={LockKeyhole}
          suffix={
            <Eye className="text-[#6B7280] w-5 h-5 shrink-0 cursor-pointer" />
          }
        />
        <Button variant="default" className="h-12 cursor-pointer">
          Inicia Sesión
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
