import { OrderCard } from '@/components/admin/OrderCard';
import { OrderDetailsDrawer } from '@/components/admin/OrderDetailsDrawer';
import { BottomAppBar } from '@/components/BottomAppBar';
import { InputSearch } from '@/components/InputSearch';
import { TopAppBar } from '@/components/TopAppBar';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';

function AdminDashboard() {
  const [filter, setFilter] = useState<'pending' | 'completed'>('pending');
  const [open, setOpen] = useState(false);

  return (
    <section className="bg-[#F8F9FF] min-h-screen flex flex-col">
      <TopAppBar
        subtitle={
          <p className="text-sm text-muted-foreground truncate max-w-[180px]">
            Panel de Administrativo
          </p>
        }
        itemHeader={
          <Button
            variant="outline"
            className="cursor-pointer rounded-lg py-5.5"
          >
            <Plus className="h-6! w-6!" strokeWidth={1.5} />
            Agregar Insumo
          </Button>
        }
      />
      <div className="flex-1 flex flex-col p-5 pb-24">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-[#031C30]">Pedidos del dia</h2>
          <InputSearch />
          <div className="flex gap-3">
            <Button
              variant={filter === 'pending' ? 'default' : 'outline'}
              onClick={() => setFilter('pending')}
              className="px-4 py-6 font-normal min-w-32 rounded-[12px] cursor-pointer text-[17px]"
            >
              Pedidos
              <span
                className={`${filter === 'pending' ? 'bg-white/20' : 'bg-[#D8E9FF]/50'} rounded-full h-8 w-8 grid place-items-center text-sm`}
              >
                3
              </span>
            </Button>
            <Button
              variant={filter === 'completed' ? 'default' : 'outline'}
              onClick={() => setFilter('completed')}
              className="px-4 py-6 font-normal min-w-32 rounded-[12px] cursor-pointer text-[17px]"
            >
              Finalizados
            </Button>
          </div>
        </div>
        <div className="mt-4">
          <div className="grid grid-cols-1 gap-4">
            <OrderCard type={filter} abrir={() => setOpen(!open)} />
            <OrderCard type={filter} abrir={() => setOpen(!open)} />
            <OrderCard type={filter} abrir={() => setOpen(!open)} />
          </div>
        </div>
      </div>
      <div className="fixed w-full max-w-md mx-auto bottom-0">
        <BottomAppBar statusAdmin={true} />
      </div>
      <OrderDetailsDrawer externalTrigger={open} setExternalTrigger={setOpen} />
    </section>
  );
}

export default AdminDashboard;
