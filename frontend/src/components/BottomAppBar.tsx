import { Bolt, Utensils, type LucideIcon, ScrollText, Box } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

type props = {
  statusAdmin?: boolean;
};

export const BottomAppBar = ({ statusAdmin }: props) => {
  const location = useLocation();

  const items = [];

  if (statusAdmin) {
    items.push({
      id: 'pedidos',
      label: 'Pedidos',
      icon: ScrollText,
      to: '/admin/orders',
    });
    items.push({
      id: 'insumos',
      label: 'Insumos',
      icon: Box,
      to: '/admin/supplies',
    });
    items.push({
      id: 'settings',
      label: 'Ajustes',
      icon: Bolt,
      to: '/admin/settings',
    });
  } else {
    items.push({
      id: 'menu',
      label: 'Menu',
      icon: Utensils,
      to: '/menu',
    });
    items.push({
      id: 'ajustes',
      label: 'Ajustes',
      icon: Bolt,
      to: '/settings',
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
    <div className="shadow-[0_-4px_10px_rgba(0,0,0,0.1)] bg-card flex items-center justify-evenly gap-2 h-20">
      {items.map(renderItem)}
    </div>
  );
};
