import { Card } from '@/components/ui/card';

export const SupplyCardSkeleton = () => {
  return (
    <Card className="relative w-full rounded-sm overflow-hidden p-0 gap-0 shadow-sm">
      <div className="relative w-full aspect-video bg-muted-foreground/20 animate-pulse" />
      <div className="p-2 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-1">
          <div className="h-5 w-2/4 bg-muted-foreground/20 animate-pulse rounded" />
          <div className="h-5 w-1/5 bg-muted-foreground/20 animate-pulse rounded" />
        </div>
        {/* <div className="h-3 w-full bg-muted animate-pulse rounded" />
        <div className="h-3 w-3/4 bg-muted animate-pulse rounded" /> */}
      </div>
    </Card>
  );
};

export function SupplyCardAdminSkeleton() {
  return (
    <Card className="rounded-sm px-2 py-1 flex flex-row items-center gap-4">
      {/* Imagen */}
      <div className="shrink-0 w-20 h-20 rounded-[8px] bg-muted-foreground/40 animate-pulse" />

      {/* Info */}
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-5 w-[55%] rounded bg-muted-foreground/40 animate-pulse" />
        <div className="h-4 w-[30%] rounded bg-muted-foreground/30 animate-pulse" />
        <div className="flex flex-col gap-1.5">
          <div className="h-[13px] w-full rounded bg-muted-foreground/30 animate-pulse" />
          <div className="h-[13px] w-[75%] rounded bg-muted-foreground/30 animate-pulse" />
        </div>
      </div>

      {/* Acciones */}
      <div className="shrink-0 flex flex-col items-center gap-2.5">
        <div className="w-12 h-12 rounded-full bg-muted-foreground/40 animate-pulse" />
        <div className="flex flex-col items-center gap-1.5">
          <div className="h-[13px] w-16 rounded bg-muted-foreground/30 animate-pulse" />
          <div className="h-6 w-11 rounded-full bg-muted-foreground/30 animate-pulse" />
        </div>
      </div>
    </Card>
  );
}
