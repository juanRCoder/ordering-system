import { Button } from '../ui/button';
import { GoogleButton, HeaderForm } from '@/pages/Auth';
import { InputField } from '../InputField';
import { Eye, LockKeyhole, Mail, User } from 'lucide-react';

export const SignupForm = ({ onToggle }: { onToggle: () => void }) => (
  <div className="flex flex-col gap-8">
    <HeaderForm
      title="Crear Cuenta"
      subtitle="Únete a nosotros para empezar a pedir"
    />
    <form className="flex flex-col gap-5">
      <InputField
        id="name"
        label="Nombre Completo"
        placeholder="Ej: Juan Pérez"
        icon={User}
      />
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
        Crear Cuenta
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
    <div className="flex items-center gap-3">
      <hr className="flex-1 border-[#C3C6D0]" />
      <span className="text-sm text-[#9CA3AF]">o regístrate con</span>
      <hr className="flex-1 border-[#C3C6D0]" />
    </div>
    <GoogleButton label="Regístrate con Google" />
  </div>
);
