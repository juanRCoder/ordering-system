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
    <div className="px-4 h-16 flex items-center justify-between bg-white stroke-1 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-center gap-2 min-w-0">
        {leftArrowEnable && (
          <Link to={leftPath || `/${slug}/menu`}>
            <ArrowLeft className="w-6 h-6 text-primary cursor-pointer" />
          </Link>
        )}
        <div className="flex flex-col min-w-0">
          <h1
            onClick={() => navigate(`/${slug}/menu`)}
            className="text-2xl font-extrabold text-primary tracking-tighter drop-shadow-sm cursor-pointer"
          >
            {business_name || 'CaveFlow'}
          </h1>
          {subtitle}
        </div>
      </div>
      {itemHeader}
    </div>
  );
};
