export const CategorySkeleton = () => {
  return (
    <div className="flex gap-3 overflow-x-auto">
      {Array.from({ length: 1 }).map((_, i) => (
        <div
          key={i}
          className="h-11.5 w-32 rounded-[12px] shrink-0 animate-pulse bg-muted-foreground/40"
        />
      ))}
    </div>
  );
};
