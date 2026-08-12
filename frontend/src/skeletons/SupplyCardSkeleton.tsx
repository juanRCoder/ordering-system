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
    <div
      className="px-3 py-2 flex flex-row items-center gap-4"
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
      }}
    >
      {/* Imagen */}
      <div
        className="shrink-0 w-20 h-20 animate-pulse"
        style={{
          borderRadius: '10px',
          backgroundColor: '#E2E8F0',
        }}
      />

      {/* Info */}
      <div className="flex-1 flex flex-col gap-2">
        <div
          className="h-5 w-[55%] rounded animate-pulse"
          style={{ backgroundColor: '#E2E8F0' }}
        />
        <div className="h-4 w-[30%] rounded animate-pulse bg-[#F1F5F9]" />
        <div className="flex flex-col gap-1.5">
          <div className="h-3.25 w-full rounded animate-pulse bg-[#F1F5F9]" />
          <div className="h-3.25 w-[75%] rounded animate-pulse bg-[#F1F5F9]" />
        </div>
      </div>

      {/* Acciones */}
      <div className="shrink-0 flex flex-col items-center gap-2.5">
        <div className="w-12 h-12 rounded-full animate-pulse bg-[#E2E8F0]" />
        <div className="flex flex-col items-center gap-1.5">
          <div className="h-3.25 w-16 rounded animate-pulse bg-[#F1F5F9]" />
          <div className="h-6 w-11 rounded-full animate-pulse bg-[#F1F5F9]" />
        </div>
      </div>
    </div>
  );
}
