import { OrderCard } from '@/components/admin/OrderCard';
import { OrderDetailsDrawer } from '@/components/admin/OrderDetailsDrawer';
import { SupplyDialog } from '@/components/admin/SupplyDialog';
import { BottomAppBar } from '@/components/BottomAppBar';
import { InputSearch } from '@/components/InputSearch';
import { TopAppBar } from '@/components/TopAppBar';
import { Button } from '@/components/ui/button';
import { useOrdersQuery } from '@/hooks/useOrders';
import type { OrderListResponseType } from '@/interfaces/orders.interface';
import { OrderCardSkeleton } from '@/skeletons/OrderCardSkeleton';
import { Plus } from 'lucide-react';
import { useState } from 'react';

function Orders() {
  const [filter, setFilter] = useState<'PENDING' | 'FINISHED'>('PENDING');
  const [open, setOpen] = useState<boolean>(false);
  const [openSupplyDialog, setOpenSupplyDialog] = useState<boolean>(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0); // para refrescar horario

  const allOrders = useOrdersQuery();

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
            onClick={() => setOpenSupplyDialog(true)}
          >
            <Plus className="h-6! w-6!" strokeWidth={1.5} />
            Agregar Insumo
          </Button>
        }
      />
      <div className="flex-1 flex flex-col p-3 pb-24">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#031C30]">
              Pedidos del dia
            </h2>
            <Button
              onClick={() => {
                allOrders.refetch();
                setRefreshKey((prev) => prev + 1);
              }}
              disabled={allOrders.isLoading}
              className="px-4 py-6 font-normal rounded-[12px] cursor-pointer text-[17px]"
            >
              Actualizar
            </Button>
          </div>
          <InputSearch />
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-1 gap-3">
              <Button
                variant={filter === 'PENDING' ? 'default' : 'outline'}
                onClick={() => setFilter('PENDING')}
                className="px-4 py-6 font-normal min-w-32 rounded-[12px] cursor-pointer text-[17px]"
              >
                Pedidos
                <span
                  className={`${filter === 'PENDING' ? 'bg-white/20' : 'bg-[#D8E9FF]/50'} rounded-full h-8 w-8 grid place-items-center text-sm`}
                >
                  {
                    allOrders?.data?.filter(
                      (order: OrderListResponseType) =>
                        order.status === 'PENDING'
                    )?.length
                  }
                </span>
              </Button>
              <Button
                variant={filter === 'FINISHED' ? 'default' : 'outline'}
                onClick={() => setFilter('FINISHED')}
                className="px-4 py-6 font-normal min-w-32 rounded-[12px] cursor-pointer text-[17px]"
              >
                Finalizados
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="grid grid-cols-1 gap-4">
            {allOrders.isLoading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <OrderCardSkeleton key={index} />
                ))
              : allOrders?.data
                  ?.filter(
                    (order: OrderListResponseType) => order.status === filter
                  )
                  .map((order: OrderListResponseType) => (
                    <OrderCard
                      key={`${order.id}-${refreshKey}`}
                      data={order}
                      handlerEvents={() => {
                        setOpen(!open);
                        setSelectedOrderId(order.id);
                      }}
                    />
                  ))}
          </div>
        </div>
      </div>
      <div className="fixed w-full max-w-md mx-auto bottom-0">
        <BottomAppBar statusAdmin={true} />
      </div>
      <OrderDetailsDrawer
        externalTrigger={open}
        setExternalTrigger={setOpen}
        selectedOrderId={selectedOrderId}
      />
      <SupplyDialog
        externalTrigger={openSupplyDialog}
        setExternalTrigger={setOpenSupplyDialog}
      />
    </section>
  );
}

export default Orders;
