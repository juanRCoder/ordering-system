import { OrderCard } from '@/components/admin/OrderCard';
import { OrderDetailsDrawer } from '@/components/admin/OrderDetailsDrawer';
import { BottomAppBar } from '@/components/BottomAppBar';
import { TopAppBar } from '@/components/TopAppBar';
import { Button } from '@/components/ui/button';
import { useOrdersQuery, useOrdersStream } from '@/hooks/useOrders';
import type { OrderListResponseType } from '@/interfaces/orders.interface';
import { OrderCardSkeleton } from '@/skeletons/OrderCardSkeleton';
import { useState, useEffect } from 'react';
import { useBusinessStore } from '@/stores/business.store';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useNavigationType } from 'react-router-dom';

function Orders() {
  const navigationType = useNavigationType();
  const { slug, setOrder } = useBusinessStore();
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<'PENDING' | 'FINISHED'>(
    'PENDING'
  );
  const [dateFilter, setDateFilter] = useState<string>('today');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [page, setPage] = useState(1);
  const orders = useOrdersQuery(page, selectedStatus, dateFilter);
  useOrdersStream(slug || '');

  const handlerSelectTab = (status: 'PENDING' | 'FINISHED') => {
    setSelectedStatus(status);
    setPage(1);
    if (status === 'FINISHED') setDateFilter('today');
    else setDateFilter('');
  };

  useEffect(() => {
    if (navigationType === 'POP') {
      setOrder({ order_id: '', guest_name: '' });
    }
  }, [navigationType]);

  const dateFilters = [
    { value: 'today', label: 'Hoy' },
    { value: 'yesterday', label: 'Ayer' },
    { value: 'older', label: 'Últimos días' },
  ];

  return (
    <section className="min-h-screen flex flex-col bg-[#F1F5F9]">
      <TopAppBar
        subtitle={<p className="text-xs truncate max-w-45">Panel de Pedidos</p>}
        itemHeader={
          <Button
            variant="outline"
            onClick={() => {
              orders.refetch();
              setRefreshKey((prev) => prev + 1);
            }}
            disabled={orders.isLoading}
            className="cursor-pointer rounded-lg bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white"
          >
            Actualizar
          </Button>
        }
      />

      <div className="flex-1 flex flex-col p-3 pb-24">
        <div className="flex flex-col gap-3">
          <div>
            <h2
              className="text-2xl font-bold tracking-tight text-[#0F2A4A]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Pedidos
            </h2>
            <p className="text-xs text-[#64748B]">
              Controla tus pedidos en tiempo real
            </p>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-white px-4 py-3 shadow-sm ring-1 ring-foreground/10">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#16A34A] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#16A34A]" />
              </span>
              <p className="text-sm font-medium text-[#475569]">
                Nuevos pedidos
              </p>
            </div>
            <span className="text-2xl font-bold text-[#0F2A4A]">
              {orders.data?.counts?.pending ?? 0}
            </span>
          </div>

          <div className="flex rounded-lg bg-white p-1 shadow-sm ring-1 ring-foreground/10">
            <button
              onClick={() => handlerSelectTab('PENDING')}
              className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ${
                selectedStatus === 'PENDING'
                  ? 'bg-[#0F2A4A] text-white'
                  : 'text-[#475569] hover:bg-[#F1F5F9]'
              }`}
            >
              Pedidos
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                  selectedStatus === 'PENDING'
                    ? 'bg-white/20 text-white'
                    : 'bg-[#D8E9FF]/60 text-[#0F2A4A]'
                }`}
              >
                {orders.data?.counts?.pending ?? 0}
              </span>
            </button>
            <button
              onClick={() => handlerSelectTab('FINISHED')}
              className={`flex-1 cursor-pointer rounded-md px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ${
                selectedStatus === 'FINISHED'
                  ? 'bg-[#0F2A4A] text-white'
                  : 'text-[#475569] hover:bg-[#F1F5F9]'
              }`}
            >
              Finalizados
            </button>
          </div>

          {selectedStatus === 'FINISHED' && (
            <div className="flex flex-wrap gap-2">
              {dateFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setDateFilter(filter.value)}
                  className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors duration-200 ${
                    dateFilter === filter.value
                      ? 'bg-[#0F2A4A] text-white'
                      : 'bg-white text-[#475569] ring-1 ring-foreground/10 hover:bg-[#E0E7FF]/60'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {orders.isLoading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <OrderCardSkeleton key={index} />
                ))
              : orders.data?.data.map(
                  (order: OrderListResponseType, index: number) => (
                    <div
                      key={`${order.id}-${refreshKey}`}
                      className="animate-fadeIn"
                      style={{ animationDelay: `${index * 40}ms` }}
                    >
                      <OrderCard
                        data={order}
                        handlerEvents={() => {
                          setOpenDrawer(true);
                          setSelectedOrderId(order.id);
                        }}
                      />
                    </div>
                  )
                )}
          </div>

          {!orders.isLoading && orders.data?.data.length === 0 && (
            <div className="text-center py-16">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[20px] bg-[#E0E7FF]">
                <svg
                  className="h-10 w-10 text-[#3B5BDB]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 14c.5 0 .9.4.9.9v2.2c0 .5-.4.9-.9.9H5c-.5 0-.9-.4-.9-.9v-2.2c0-.5.4-.9.9-.9m3.5-3.5L12 15l3.5-4.5M12 15V5"
                  />
                </svg>
              </div>
              <p
                className="text-lg font-semibold text-[#0F2A4A]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                No hay pedidos aquí
              </p>
              <p className="mt-2 text-sm text-[#94A3B8]">
                Cuando llegue un pedido nuevo aparecerá en tiempo real
              </p>
            </div>
          )}
        </div>

        <Pagination
          className={`my-6 ${orders.data?.data.length === 0 ? 'hidden' : ''}`}
        >
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
                className="text-[#475569]"
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
                    className={`${
                      page === i + 1
                        ? 'bg-[#0F2A4A]! text-white! border-[#0F2A4A]!'
                        : 'text-[#475569]'
                    }`}
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
                className="text-[#475569]"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <div className="fixed w-full mx-auto bottom-0">
        <BottomAppBar />
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
