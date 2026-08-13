export const SupplyCardSkeleton = () => {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        borderRadius: '20px',
        boxShadow: '0 4px 16px rgba(15, 42, 74, 0.1)',
      }}
    >
      {/* Image Placeholder */}
      <div
        className="w-full animate-pulse"
        style={{
          aspectRatio: '3 / 4',
          background: 'linear-gradient(135deg, #E2E8F0 0%, #F1F5F9 100%)',
        }}
      />
      {/* Overlay Placeholder */}
      <div className="absolute inset-x-0 bottom-0 p-3 flex flex-col gap-2">
        <div
          className="h-4 w-3/4 animate-pulse rounded"
          style={{ backgroundColor: 'rgba(255,255,255,0.85)' }}
        />
        <div
          className="h-5 w-1/3 animate-pulse rounded"
          style={{ backgroundColor: 'rgba(255,255,255,0.85)' }}
        />
      </div>
    </div>
  );
};

export function SupplyCardAdminSkeleton() {
  return (
    <div className="flex h-80 flex-col overflow-hidden rounded-lg bg-white ring-1 ring-foreground/10">
      <div className="relative h-1/2 w-full shrink-0 overflow-hidden bg-[#E0E7FF]">
        <div className="h-full w-full animate-pulse bg-[#E2E8F0]" />
        <span className="absolute top-2 left-2 rounded px-1.5 py-0.5">
          <span className="block h-2 w-14 rounded animate-pulse bg-[#CBD5E1]" />
        </span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col p-3">
        <div className="h-5 w-[55%] rounded animate-pulse bg-[#E2E8F0]" />
        <div className="mt-1.5 h-3.25 w-full rounded animate-pulse bg-[#F1F5F9]" />
        <div className="mt-1 h-3.25 w-[75%] rounded animate-pulse bg-[#F1F5F9]" />
        <div className="mt-auto pt-2">
          <div className="flex items-center justify-between rounded-md bg-[#E0E7FF]/40 px-2.5 py-2">
            <div className="h-3 w-12 rounded animate-pulse bg-[#E2E8F0]" />
            <div className="h-4 w-16 rounded animate-pulse bg-[#E2E8F0]" />
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between gap-2 border-t border-dashed border-[#CBD5E1] pt-2">
          <div className="h-5 w-12 rounded-full animate-pulse bg-[#F1F5F9]" />
          <div className="h-8 w-24 rounded-md animate-pulse bg-[#E2E8F0]" />
        </div>
      </div>
    </div>
  );
}
