import { Card } from '@/components/ui/card';

export const OrderCardSkeleton = () => {
  return (
    <Card className="relative p-4 gap-3 animate-pulse">
      <div>
        <div className="flex flex-col gap-1.5">
          <div className="h-5 w-36 rounded-md bg-muted-foreground/40" />
          <div className="h-4 w-48 rounded-md bg-muted-foreground/40" />
        </div>
        <div className="absolute top-5 right-4 h-6 w-20 rounded-full bg-muted-foreground/30" />
      </div>

      <hr className="opacity-30" />
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="h-5 w-28 rounded-md bg-muted-foreground/40" />
          <div className="h-6 w-20 rounded-md bg-muted-foreground/40" />
        </div>
        <div className="h-[52px] w-full rounded-[12px] bg-muted-foreground/40" />
      </div>
    </Card>
  );
};
