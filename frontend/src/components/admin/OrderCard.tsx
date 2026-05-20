import { ScrollText } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

type Props = {
  type: 'pending' | 'completed';
  abrir: () => void;
};

export const OrderCard = ({ type, abrir }: Props) => {
  const isOrderCompleted = type === 'completed';

  return (
    <Card className="relative p-4 gap-3">
      <div>
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold">Jose Estrada</h2>
          <p className="text-muted-foreground text-sm">
            Order #241250 • Hace 12 minutos
          </p>
        </div>
        <span
          className={`absolute top-5 right-4 text-xs font-medium px-3 py-1 rounded-full 
					${isOrderCompleted ? 'bg-primary text-white outline-0' : 'text-[#43474F] outline'}`}
        >
          {isOrderCompleted ? 'Finalizado' : 'Pendiente'}
        </span>
      </div>
      <hr />
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-lg text-muted-foreground">
            Monto Total:
          </p>
          <p
            className={`font-bold text-xl text-primary ${isOrderCompleted && 'line-through'}`}
          >
            S/ 20.00
          </p>
        </div>
        <Button
          onClick={abrir}
          className={`w-full cursor-pointer rounded-[12px] py-6 flex justify-center items-center gap-3
						${isOrderCompleted && 'bg-muted-foreground/20 text-[#42474F]/70 font-bold hover:bg-muted-foreground/10 hover:text-[#42474F]/70 hover:font-bold'}
						`}
        >
          <ScrollText
            className={`h-6! w-6! ${isOrderCompleted && 'text-[#42474F]/70'}`}
            strokeWidth={1.5}
          />
          <p className="text-[17px]">Detalles del pedido</p>
        </Button>
      </div>
    </Card>
  );
};
