import { CategoriesDrawer } from '@/components/admin/CategoriesDrawer';
import { BottomAppBar } from '@/components/BottomAppBar';
import { TopAppBar } from '@/components/TopAppBar';
import { Button } from '@/components/ui/button';
import { useLogout, useUpdateBusinessStatus } from '@/hooks/useAuth';
import { useBusinessStore } from '@/stores/business.store';
import { DM_SANS_STYLE } from '@/lib/constants';
import { LogOut, Minus, Phone, Plus, Store, User } from 'lucide-react';
import { useState } from 'react';

type props = {
  isAdmin?: boolean;
};

export default function Settings({ isAdmin }: props) {
  const logout = useLogout();
  const owner_name = useBusinessStore((s) => s.owner_name);
  const business_name = useBusinessStore((s) => s.business_name);
  const phone = useBusinessStore((s) => s.phone);
  const is_business_open = useBusinessStore((s) => s.is_business_open);
  const update = useUpdateBusinessStatus();

  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [isClosed, setIsClosed] = useState<boolean>(is_business_open!);

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const status = e.target.checked;
    update.mutate(status);
    setIsClosed(status);
    useBusinessStore.setState({ is_business_open: status });
  };

  const infoRows = [
    {
      icon: User,
      label: 'Propietario',
      value: owner_name || 'N/A',
    },
    {
      icon: Store,
      label: 'Nombre del negocio',
      value: business_name || 'N/A',
    },
    {
      icon: Phone,
      label: 'Teléfono',
      value: phone || 'N/A',
    },
  ];

  const tableCount = useBusinessStore((s) => s.table_count);
  const setTableCount = useBusinessStore((s) => s.setTableCount);
  const activeTables = tableCount ?? 10;

  const adjustTables = (delta: number) => {
    const next = Math.min(20, Math.max(1, activeTables + delta));
    setTableCount(next);
  };

  return (
    <section className="bg-[#F1F5F9] min-h-screen flex flex-col">
      <TopAppBar
        subtitle={
          isAdmin && (
            <p className="text-xs truncate max-w-45">Panel de Administrativo</p>
          )
        }
      />
      <div className="flex-1 flex flex-col gap-3 p-3 pb-24">
        <div>
          <h2
            className="text-2xl font-bold tracking-tight text-[#0F2A4A]"
            style={DM_SANS_STYLE}
          >
            Perfil de Negocio
          </h2>
          <p className="text-xs text-[#64748B]">
            Administra la información y configuración de tu negocio
          </p>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-foreground/10">
          <p className="mb-3 text-sm font-semibold text-[#475569]">
            Información del negocio
          </p>
          <div className="flex flex-col gap-3.5">
            {infoRows.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#E0E7FF] text-[#3B5BDB]">
                  <Icon className="h-4.5 w-4.5" strokeWidth={2} />
                </span>
                <div className="flex min-w-0 flex-col">
                  <p className="text-xs text-[#94A3B8]">{label}</p>
                  <p className="truncate text-sm font-semibold text-[#0F2A4A]">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-foreground/10">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[15px] font-semibold text-[#A31616]">
                Cerrar negocio
              </p>
              <p className="text-xs leading-snug text-[#64748B]">
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
              <div className="h-6 w-11 rounded-full bg-neutral-300 transition-colors peer-checked:bg-[#BA1A1A]" />
              <div className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
            </label>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-foreground/10">
          <div className="mb-3">
            <p className="text-[15px] font-semibold text-[#0F2A4A]">
              Cantidad de mesas
            </p>
            <p className="text-xs leading-snug text-[#64748B]">
              Número de mesas que verán los clientes al hacer pedidos.
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Disminuir mesas"
                onClick={() => adjustTables(-1)}
                className="grid h-10 w-10 cursor-pointer place-items-center rounded-lg bg-[#E0E7FF] text-[#3B5BDB] transition-colors hover:bg-[#0F2A4A] hover:text-white"
              >
                <Minus className="h-4.5 w-4.5" strokeWidth={2} />
              </button>
              <span className="w-10 text-center text-2xl font-bold text-[#0F2A4A]">
                {activeTables}
              </span>
              <button
                type="button"
                aria-label="Aumentar mesas"
                onClick={() => adjustTables(1)}
                className="grid h-10 w-10 cursor-pointer place-items-center rounded-lg bg-[#E0E7FF] text-[#3B5BDB] transition-colors hover:bg-[#0F2A4A] hover:text-white"
              >
                <Plus className="h-4.5 w-4.5" strokeWidth={2} />
              </button>
            </div>
            <span className="text-xs font-medium text-[#94A3B8]">
              Mesas en el menú
            </span>
          </div>
        </div>

        <Button
          className="bg-white text-[#A31616] border border-[#BA1A1A]/30 hover:bg-[#BA1A1A]/5 cursor-pointer size-full py-2 rounded-lg flex justify-start shadow-sm"
          onClick={() => logout.mutate()}
        >
          <span className="w-11 h-11 bg-[#BA1A1A]/10 rounded-full flex items-center justify-center">
            <LogOut className="text-destructive" />
          </span>
          {logout.isPending ? 'Cerrando sesión...' : 'Cerrar Sesión'}
        </Button>
      </div>
      <div className="fixed w-full mx-auto bottom-0">
        <BottomAppBar />
      </div>
      <CategoriesDrawer
        externalTrigger={openDrawer}
        setExternalTrigger={setOpenDrawer}
      />
    </section>
  );
}
