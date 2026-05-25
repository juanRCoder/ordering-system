export const OrderDetailSkeleton = () => {
  return (
    <div className="animate-pulse flex flex-col gap-4 pb-4">
      <div className="relative">
        <div className="h-5 w-40 rounded-md bg-muted-foreground/40" />
        <div className="h-4 w-52 rounded-md bg-muted-foreground/40 mt-1.5" />
        <div className="absolute top-0 right-0 h-6 w-20 rounded-full bg-muted-foreground/40" />
      </div>
      <div className="flex flex-col gap-3 mt-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex justify-between">
            <div className="h-4 w-32 rounded-md bg-muted-foreground/40" />
            <div className="h-4 w-16 rounded-md bg-muted-foreground/40" />
          </div>
        ))}
      </div>
      <div className="border-t pt-4 flex flex-col gap-2">
        <div className="h-4 w-28 rounded-md bg-muted-foreground/40" />
        <div className="h-24 w-full rounded-lg bg-muted-foreground/40" />
      </div>
    </div>
  );
};
