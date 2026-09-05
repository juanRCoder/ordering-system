import { useBusinessStore } from '@/stores/business.store';
import { DEFAULT_SLUG } from '@/lib/constants';
import { type LucideIcon, ScrollText, Box, User, Utensils } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const BottomAppBar = () => {
  const location = useLocation();
  const { slug } = useBusinessStore();
  const resolvedSlug =
    slug?.trim() && slug !== 'null' && slug !== 'undefined'
      ? slug
      : DEFAULT_SLUG;

  const items = [];
  items.push({
    id: 'menu',
    label: 'Menu',
    icon: Utensils,
    to: `/${resolvedSlug}/menu`,
  });
  items.push({
    id: 'pedidos',
    label: 'Pedidos',
    icon: ScrollText,
    to: `/${resolvedSlug}/orders`,
  });
  items.push({
    id: 'insumos',
    label: 'Insumos',
    icon: Box,
    to: `/${resolvedSlug}/supplies`,
  });
  items.push({
    id: 'perfil',
    label: 'Perfil',
    icon: User,
    to: `/${resolvedSlug}/settings`,
  });

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
