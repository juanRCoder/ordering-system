import { useBusinessStore } from '@/stores/business.store';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

type props = {
  itemHeader?: React.ReactNode;
  leftArrowEnable?: boolean;
  leftPath?: string;
  subtitle?: React.ReactNode;
};

export const TopAppBar = ({
  itemHeader,
  leftArrowEnable = false,
  leftPath,
  subtitle,
}: props) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { business_name } = useBusinessStore();

  return (
    <div
      className="px-4 h-14 flex items-center justify-between bg-[#0F2A4A]"
      style={{
        boxShadow: '0 2px 12px rgba(15, 42, 74, 0.2)',
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        {leftArrowEnable && (
          <Link
            to={leftPath || `/${slug}/menu`}
            className="flex items-center justify-center w-9 h-9 rounded-lg active:scale-90 transition-transform duration-100"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.12)' }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
        )}
        <div className="flex flex-col min-w-0">
          <h1
            onClick={() => navigate(`/${slug}/menu`)}
            className="text-lg font-bold text-white tracking-tight cursor-pointer truncate"
          >
            {business_name || 'CaveFlow'}
          </h1>
          {subtitle && (
            <span className="text-xs text-white/60 truncate">{subtitle}</span>
          )}
        </div>
      </div>
      {itemHeader && <div className="flex items-center">{itemHeader}</div>}
    </div>
  );
};
