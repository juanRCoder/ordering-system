import { OrderCard } from '@/components/admin/OrderCard';
import { OrderDetailsDrawer } from '@/components/admin/OrderDetailsDrawer';
import { BottomAppBar } from '@/components/BottomAppBar';
// import { InputSearch } from '@/components/InputSearch';
import { TopAppBar } from '@/components/TopAppBar';
import { Button } from '@/components/ui/button';
import { useOrdersQuery, useOrdersStream } from '@/hooks/useOrders';
import type { OrderListResponseType } from '@/interfaces/orders.interface';
import { OrderCardSkeleton } from '@/skeletons/OrderCardSkeleton';
import { useState } from 'react';
import { useBusinessStore } from '@/stores/business.store';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

function Orders() {
  const { slug } = useBusinessStore();
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<'PENDING' | 'FINISHED'>(
    'PENDING'
  );
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0); // para refrescar horario
  const [page, setPage] = useState(1);
  const orders = useOrdersQuery(page, selectedStatus);
  useOrdersStream(slug || '');

  const handlerSelectTab = (status: 'PENDING' | 'FINISHED') => {
    setSelectedStatus(status);
    setPage(1);
  };

  return (
    <section className="bg-[#F8F9FF] min-h-screen flex flex-col">
      <TopAppBar
        subtitle={
          <p className="text-sm text-muted-foreground truncate max-w-45">
            Panel de Administrativo
          </p>
        }
        itemHeader={
          <Button
            variant="outline"
            onClick={() => {
              orders.refetch();
              setRefreshKey((prev) => prev + 1);
            }}
            disabled={orders.isLoading}
            className="cursor-pointer rounded-sm py-5.5"
          >
            Actualizar
          </Button>
        }
      />
      <div className="flex-1 flex flex-col p-3 pb-24">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#031C30]">
              Pedidos del dia
            </h2>
          </div>
          {/* <InputSearch /> */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-1 gap-3 flex-wrap">
              <Button
                variant={selectedStatus === 'PENDING' ? 'default' : 'outline'}
                onClick={() => handlerSelectTab('PENDING')}
                className="px-4 py-6 font-normal min-w-32 rounded-sm cursor-pointer text-[17px]"
              >
                Pedidos
                <span
                  className={`${selectedStatus === 'PENDING' ? 'bg-white/20' : 'bg-[#D8E9FF]/50'} rounded-full h-8 w-8 grid place-items-center text-sm`}
                >
                  {orders?.data?.counts?.pending}
                </span>
              </Button>
              <Button
                variant={selectedStatus === 'FINISHED' ? 'default' : 'outline'}
                onClick={() => handlerSelectTab('FINISHED')}
                className="px-4 py-6 font-normal min-w-32 rounded-sm cursor-pointer text-[17px]"
              >
                Finalizados
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
            {orders.isLoading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <OrderCardSkeleton key={index} />
                ))
              : orders.data?.data.map((order: OrderListResponseType) => (
                  <OrderCard
                    key={`${order.id}-${refreshKey}`}
                    data={order}
                    handlerEvents={() => {
                      setOpenDrawer(true);
                      setSelectedOrderId(order.id);
                    }}
                  />
                ))}
          </div>
        </div>
        <Pagination className={`my-6`}>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                text="Anterior"
                aria-disabled={page === 1}
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) {
                    setPage(page - 1);
                  }
                }}
              />
            </PaginationItem>

            {Array.from(
              {
                length: orders?.data?.metadata?.pagination?.totalPages ?? 0,
              },
              (_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    isActive={page === i + 1}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(i + 1);
                    }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                text="Siguiente"
                aria-disabled={
                  page === orders?.data?.metadata?.pagination?.totalPages
                }
                onClick={(e) => {
                  e.preventDefault();

                  if (
                    page < (orders?.data?.metadata?.pagination?.totalPages ?? 1)
                  ) {
                    setPage(page + 1);
                  }
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <div className="fixed w-full mx-auto bottom-0">
        <BottomAppBar statusAdmin={true} />
      </div>
      <OrderDetailsDrawer
        externalTrigger={openDrawer}
        setExternalTrigger={setOpenDrawer}
        selectedOrderId={selectedOrderId}
      />
    </section>
  );
}

export default Orders;
