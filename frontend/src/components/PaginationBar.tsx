import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

type PaginationBarProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  linkClassName?: string;
};

export function PaginationBar({
  page,
  totalPages,
  onPageChange,
  className,
  linkClassName,
}: PaginationBarProps) {
  if (totalPages <= 1) return null;

  return (
    <Pagination className={cn('my-6', className)}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            text="Anterior"
            aria-disabled={page === 1}
            onClick={(e) => {
              e.preventDefault();
              if (page > 1) onPageChange(page - 1);
            }}
            className={linkClassName}
          />
        </PaginationItem>

        {Array.from({ length: totalPages }, (_, i) => (
          <PaginationItem key={i + 1}>
            <PaginationLink
              isActive={page === i + 1}
              onClick={(e) => {
                e.preventDefault();
                onPageChange(i + 1);
              }}
              className={cn(
                page === i + 1
                  ? 'bg-[#0F2A4A]! text-white! border-[#0F2A4A]!'
                  : 'text-[#475569]',
                linkClassName
              )}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            text="Siguiente"
            aria-disabled={page === totalPages}
            onClick={(e) => {
              e.preventDefault();
              if (page < totalPages) onPageChange(page + 1);
            }}
            className={linkClassName}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
