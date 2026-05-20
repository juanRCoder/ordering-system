import { Bolt, Utensils, UserStar, type LucideIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

type Props = {
  statusAdmin?: boolean;
};

export const BottomAppBar = ({ statusAdmin }: Props) => {
  const location = useLocation();

  const items = [
    {
      id: 'menu',
      label: 'Menu',
      icon: Utensils,
      to: '/menu',
    },
    {
      id: 'ajustes',
      label: 'Ajustes',
      icon: Bolt,
      to: '/ajustes',
    },
  ];

  if (statusAdmin) {
    items.push({
      id: 'admin',
      label: 'Admin',
      icon: UserStar,
      to: '/admin/dashboard',
    });
  }

  const renderItem = (item: {
    id: string;
    label: string;
    icon: LucideIcon;
    to: string;
  }) => {
    const isActive = location.pathname.startsWith(item.to);
    const Icon = item.icon;

    return (
      <Link
        to={item.to}
        key={item.id}
        className={`rounded-[12px] flex flex-col items-center justify-center p-2 px-4 w-20 cursor-pointer transition-colors ${
          isActive ? 'bg-[#D8E9FF]/50' : 'bg-transparent'
        }`}
      >
        <Icon
          className={isActive ? 'text-primary' : 'text-muted-foreground'}
          size={22}
        />

        <p
          className={`text-sm font-semibold ${
            isActive ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          {item.label}
        </p>
      </Link>
    );
  };

  return (
    <div className="shadow-[0_-4px_10px_rgba(0,0,0,0.1)] bg-card flex items-center justify-center gap-8 h-20">
      {items.map(renderItem)}
    </div>
  );
};
