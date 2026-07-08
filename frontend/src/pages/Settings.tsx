import { CategoriesDrawer } from '@/components/admin/CategoriesDrawer';
import { BottomAppBar } from '@/components/BottomAppBar';
import { TopAppBar } from '@/components/TopAppBar';
import { Button } from '@/components/ui/button';
import { useLogout } from '@/hooks/useAuth';
import { LogOut } from 'lucide-react';
import { useState } from 'react';

type props = {
  isAdmin?: boolean;
};

export default function Settings({ isAdmin }: props) {
  const logout = useLogout();
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [isClosed, setIsClosed] = useState<boolean>(false);

  return (
    <section className="bg-[#F8F9FF] min-h-screen flex flex-col">
      <TopAppBar
        subtitle={
          isAdmin && (
            <p className="text-sm text-muted-foreground truncate max-w-[180px]">
              Panel de Administrativo
            </p>
          )
        }
      />
      <div className="flex-1 flex flex-col p-3 pb-24">
        <h2 className="text-2xl font-bold text-[#031C30] mb-3">
          Perfil de Negocio
        </h2>
        <hr />
        <div className="rounded-2xl bg-neutral-50 pt-5">
          <div className="flex items-start gap-4 mb-5">
            <img
              src="/no_image.webp"
              alt="pizzeria-ramirez"
              className="w-[100px] h-[100px] rounded-full object-cover shrink-0"
            />
            <div className="flex flex-col gap-3.5 pt-0.5">
              <div>
                <p className="text-xs text-neutral-500 mb-0.5">Propietario</p>
                <p className="text-base font-medium text-neutral-900">
                  Jose Perez
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 mb-0.5">
                  Nombre del negocio
                </p>
                <p className="text-base font-medium text-neutral-900">
                  Pizzeria Ramirez
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-neutral-200 rounded-xl px-5 py-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[15px] font-medium text-red-600">
                Cerrar negocio
              </p>
              <p className="text-xs text-neutral-500 leading-snug">
                Apaga el negocio para dejar de recibir pedidos.
              </p>
            </div>
            <label className="relative inline-flex items-center shrink-0 cursor-pointer">
              <input
                type="checkbox"
                checked={isClosed}
                onChange={(e) => setIsClosed(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-300 peer-checked:bg-red-500 rounded-full transition-colors" />
              <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
            </label>
          </div>
        </div>
        <div className="flex flex-col mt-4 gap-2">
          <Button
            className="bg-[#ba1a1a]/5 hover:bg-[#ba1a1a]/10 border border-[#BA1A1A]/30 cursor-pointer size-full py-2 text-[#A31616] flex justify-start"
            onClick={() => logout.mutate()}
          >
            <span className="w-11 h-11 bg-[#BA1A1A]/10 rounded-full flex items-center justify-center">
              <LogOut className="text-destructive" />
            </span>
            {logout.isPending ? 'Cerrando sesión...' : 'Cerrar Sesión'}
          </Button>
        </div>
      </div>
      <div className="fixed w-full mx-auto bottom-0">
        <BottomAppBar statusAdmin={isAdmin} />
      </div>
      <CategoriesDrawer
        externalTrigger={openDrawer}
        setExternalTrigger={setOpenDrawer}
      />
    </section>
  );
}

{
  // CATEGORIAS
  /* {isAdmin && (
            <>
              <p
                className="cursor-pointer w-fit"
                onClick={() => setOpenDrawer(true)}
              >
                Gestion de Categorias
              </p>
              <span className="block border-b border-muted-foreground/10 w-full"></span>
            </>
          )} */
}
