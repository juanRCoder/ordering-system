import { Card } from '@/components/ui/card';

export const OrderCardSkeleton = () => {
  return (
    <Card className="rounded-lg p-0! gap-0! animate-pulse">
      <div className="flex items-center justify-between bg-[#0F2A4A]/20 px-3 py-1.5">
        <div className="h-3 w-16 rounded bg-[#0F2A4A]/30" />
        <div className="h-3 w-12 rounded bg-[#0F2A4A]/30" />
      </div>
      <div className="flex flex-col gap-2 p-3">
        <div className="flex items-center justify-between">
          <div className="h-5 w-32 rounded bg-muted-foreground/40" />
          <div className="h-6 w-6 rounded bg-muted-foreground/30" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-14 rounded bg-muted-foreground/30" />
          <div className="h-3 w-24 rounded bg-muted-foreground/30" />
        </div>
        <div className="h-0 border-t border-dashed border-muted-foreground/20" />
        <div className="flex flex-col gap-1.5">
          <div className="h-3.5 w-3/4 rounded bg-muted-foreground/30" />
          <div className="h-3.5 w-2/3 rounded bg-muted-foreground/30" />
          <div className="h-3.5 w-1/2 rounded bg-muted-foreground/30" />
        </div>
        <div className="flex items-center justify-between rounded-md bg-[#E0E7FF]/40 px-2.5 py-1.5">
          <div className="h-3 w-16 rounded bg-muted-foreground/30" />
          <div className="h-4 w-14 rounded bg-muted-foreground/40" />
        </div>
      </div>
    </Card>
  );
};
