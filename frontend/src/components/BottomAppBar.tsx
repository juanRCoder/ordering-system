import { type LucideIcon, ScrollText, Box, User } from 'lucide-react';
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
      id: 'perfil',
      label: 'perfil',
      icon: User,
      to: '/admin/settings',
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
        className={`rounded-sm flex flex-col items-center justify-center py-1 px-3 cursor-pointer transition-colors ${
          isActive ? 'bg-[#D8E9FF]/50' : 'bg-transparent'
        }`}
      >
        <Icon
          className={isActive ? 'text-primary' : 'text-muted-foreground'}
          size={16}
        />

        <p
          className={`text-[11px] font-semibold ${
            isActive ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          {item.label}
        </p>
      </Link>
    );
  };

  return (
    <section className="bg-card flex flex-col relative">
      <div className="shadow-[0_-4px_10px_rgba(0,0,0,0.1)] flex items-center justify-center gap-1 pt-4">
        {items.map(renderItem)}
      </div>
      <p className="text-muted-foreground text-[10px] text-center pt-2 pb-1">
        CaveFlow Platform
      </p>
    </section>
  );
};
