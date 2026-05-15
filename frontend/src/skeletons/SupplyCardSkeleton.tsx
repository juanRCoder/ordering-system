import { Card, CardFooter, CardHeader } from '@/components/ui/card';

type Props = {
  layout?: string;
};

export const SupplyCardSkeleton = ({ layout = 'FULL' }: Props) => {
  const isHalf = layout === 'HALF';

  return (
    <Card className="relative w-full pt-0 rounded-[12px] gap-0 p-0 overflow-hidden">
      <div
        className={`animate-pulse bg-muted-foreground/40 ${
          isHalf ? 'w-32 h-32 mx-auto mt-4 rounded-md' : 'w-full aspect-video'
        }`}
      />

      <CardHeader className="p-4 m-0 gap-2">
        <div
          className={`animate-pulse bg-muted-foreground/40 rounded-md h-5 ${isHalf ? 'w-3/4' : 'w-2/3'}`}
        />
        {!isHalf && (
          <>
            <div className="animate-pulse bg-muted-foreground/40 rounded-md h-3 w-full" />
            <div className="animate-pulse bg-muted-foreground/40 rounded-md h-3 w-4/5" />
          </>
        )}
      </CardHeader>

      <CardFooter className="px-4 pb-4 flex justify-between">
        <div className="animate-pulse bg-muted-foreground/40 rounded-md h-6 w-20" />
        {isHalf ? (
          <div className="animate-pulse bg-muted-foreground/40 rounded-full w-10 h-10" />
        ) : (
          <div className="animate-pulse bg-muted-foreground/40 rounded-md h-9 w-32" />
        )}
      </CardFooter>
    </Card>
  );
};
