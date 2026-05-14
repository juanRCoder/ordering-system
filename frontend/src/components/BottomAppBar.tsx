import { useState } from 'react';
import { Bolt, Utensils, type LucideIcon } from 'lucide-react';

export const BottomAppBar = () => {
  const [active, setActive] = useState('menu');

  const items = [
    {
      id: 'menu',
      label: 'Menu',
      icon: Utensils,
    },
    {
      id: 'ajustes',
      label: 'Ajustes',
      icon: Bolt,
    },
  ];

  const renderItem = (item: {
    id: string;
    label: string;
    icon: LucideIcon;
  }) => {
    const isActive = active === item.id;
    const Icon = item.icon;

    return (
      <div
        key={item.id}
        onClick={() => setActive(item.id)}
        className={`rounded-[12px] flex flex-col items-center justify-center p-2 px-4 w-20 cursor-pointer transition-colors ${isActive ? 'bg-[#D8E9FF]/50' : 'bg-transparent'}`}
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
      </div>
    );
  };

  return (
    <div className="shadow-[0_-4px_10px_rgba(0,0,0,0.1)] bg-card flex items-center justify-center gap-8 h-20">
      {items.map(renderItem)}
    </div>
  );
};
