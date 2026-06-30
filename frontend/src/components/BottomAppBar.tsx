import { Bolt, Utensils, type LucideIcon, ScrollText, Box } from 'lucide-react';
import { Link, useLocation, useParams } from 'react-router-dom';

type props = {
  statusAdmin?: boolean;
};

export const BottomAppBar = ({ statusAdmin }: props) => {
  const location = useLocation();
  const { slug } = useParams<{ slug: string }>();

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
      to: `/${slug}/menu`,
    });
    items.push({
      id: 'ajustes',
      label: 'Ajustes',
      icon: Bolt,
      to: `/${slug}/settings`,
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
          size={18}
        />

        <p
          className={`text-xs font-semibold ${
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
      <div className="shadow-[0_-4px_10px_rgba(0,0,0,0.1)] flex items-center justify-center gap-2 pt-4">
        {items.map(renderItem)}
      </div>
      <p className="text-muted-foreground text-[10px] text-center pt-2 pb-1">
        CaveFlow Platform
      </p>
    </section>
  );
};
