import { CategoriesDrawer } from '@/components/admin/CategoriesDrawer';
import { BottomAppBar } from '@/components/BottomAppBar';
import { TopAppBar } from '@/components/TopAppBar';
import { Button } from '@/components/ui/button';
import { useLogout, useUpdateBusinessStatus } from '@/hooks/useAuth';
import { toastStyles } from '@/lib/toast';
import { useBusinessStore } from '@/stores/business.store';
import { Copy, LogOut } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type props = {
  isAdmin?: boolean;
};

export default function Settings({ isAdmin }: props) {
  const logout = useLogout();
  const { slug, owner_name, business_name, is_business_open } =
    useBusinessStore();
  const update = useUpdateBusinessStatus();

  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [isClosed, setIsClosed] = useState<boolean>(is_business_open);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(
      `http://localhost:5173/${slug}/menu?wa=51956402456`
    );
    toast.success('Enlace copiado!', toastStyles.success);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const status = e.target.checked;
    update.mutate(status);
    setIsClosed(status);
    useBusinessStore.setState({ is_business_open: status });
  };

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
                  {owner_name || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 mb-0.5">
                  Nombre del negocio
                </p>
                <p className="text-base font-medium text-neutral-900">
                  {business_name || 'N/A'}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 bg-white border border-neutral-200 rounded-xl px-5 py-4 mb-2">
            <div className="flex flex-col">
              <p className="text-[15px] font-medium">
                Link de menu para clientes
              </p>
              <p className="text-xs text-neutral-500">
                Envio de ordenes directo a tu whatsapp como respaldo
              </p>
            </div>
            <div
              onClick={handleCopy}
              className="cursor-pointer px-2 py-4 flex gap-3 justify-between items-center rounded-sm overflow-hidden bg-neutral-100"
            >
              <p className="select-none text-[#1b6298] font-light rounded-none outline-none border-none focus-visible:ring-0! text-xs bg-transparent truncate">
                http://localhost:5173/{`${slug}/menu`}?wa=51956402456
              </p>
              <Copy className="h-4 w-4 text-muted-foreground" />
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
                onChange={handleStatusChange}
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
