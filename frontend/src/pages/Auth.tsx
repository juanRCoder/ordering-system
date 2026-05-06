import { useState } from 'react';
import { TopAppBar } from '../components/TopAppBar';
import { User, Mail, LockKeyhole, Eye } from 'lucide-react';

function Auth() {
  const [currentForm] = useState('login');

  // const toggleForm = () => {
  //   setCurrentForm(currentForm === "login" ? "signup" : "login")
  // }

  const Form = () => {
    if (currentForm === 'login') {
      return (
        <div className="flex flex-col gap-8">
          <section className="flex flex-col items-center justify-center">
            <h1 className="font-bold text-3xl text-[#031C30] tracking-tight">
              Crear Cuenta
            </h1>
            <p className="text-sm text-[#595F64]">
              Únete a nosotros para empezar a pedir
            </p>
          </section>
          <form className="flex flex-col gap-5">
            <fieldset className="flex flex-col gap-2">
              <label className="text-[#43474F] font-semibold" htmlFor="name">
                Nombre Completo
              </label>

              <div className="flex items-center gap-2 border border-[#C3C6D0] rounded-xl h-14 px-4">
                <User className="text-[#6B7280] w-5 h-5" />

                <input
                  className="flex-1 outline-none bg-transparent text-[#6B7280] placeholder:text-[#9CA3AF]"
                  type="text"
                  id="name"
                  placeholder="Ej: Juan Pérez"
                />
              </div>
            </fieldset>
            <fieldset className="flex flex-col gap-2">
              <label className="text-[#43474F] font-semibold" htmlFor="email">
                Correo electrónico
              </label>

              <div className="flex items-center gap-2 border border-[#C3C6D0] rounded-xl h-14 px-4">
                <Mail className="text-[#6B7280] w-5 h-5" />

                <input
                  className="flex-1 outline-none bg-transparent text-[#6B7280] placeholder:text-[#9CA3AF]"
                  type="text"
                  id="email"
                  placeholder="ejemplo@crave.com"
                />
              </div>
            </fieldset>
            <fieldset className="flex flex-col gap-2">
              <label
                className="text-[#43474F] font-semibold"
                htmlFor="password"
              >
                Contraseña
              </label>
              <div className="flex items-center gap-2 border border-[#C3C6D0] rounded-xl h-14 px-4">
                <LockKeyhole className="text-[#6B7280] w-5 h-5" />
                <input
                  className="flex-1 outline-none bg-transparent text-[#6B7280] placeholder:text-[#9CA3AF]"
                  type="password"
                  id="password"
                  placeholder="••••••••"
                />
                <Eye className="text-[#6B7280] w-5 h-5 cursor-pointer" />
              </div>
            </fieldset>
          </form>
        </div>
      );
    } else {
      return (
        <form>
          <input type="text" placeholder="Username" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button type="submit">Register</button>
        </form>
      );
    }
  };

  return (
    <div className="bg-[#F8F9FF] h-full">
      <TopAppBar />
      <div className="m-5 px-8 py-12 bg-white rounded-xl">
        <Form />
      </div>
      {/* <h1 className="mt-10">{currentForm}</h1> */}
      {/* <button onClick={toggleForm}>
        Switch to {currentForm === "login" ? "signup" : "login"}
      </button> */}
    </div>
  );
}

export default Auth;
