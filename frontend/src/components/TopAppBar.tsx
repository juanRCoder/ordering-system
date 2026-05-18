import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

type props = {
  itemHeader?: React.ReactNode;
  leftArrowEnable?: boolean;
  leftPath?: string;
};

export const TopAppBar = ({
  itemHeader,
  leftArrowEnable = false,
  leftPath,
}: props) => {
  return (
    <div className="px-4 h-16 flex items-center justify-between bg-white stroke-1 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-center gap-2">
        {leftArrowEnable && (
          <Link to={leftPath || '/menu'}>
            <ArrowLeft className="w-6 h-6 text-primary cursor-pointer" />
          </Link>
        )}
        <h1 className="text-2xl font-extrabold text-primary tracking-tighter drop-shadow-sm">
          CaveFlow
        </h1>
      </div>
      {itemHeader}
    </div>
  );
};
