import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Plus } from 'lucide-react';

type props = {
  supplyType: 'platos' | 'bebidas';
};

export const SupplyCard = ({ supplyType }: props) => {
  const onlyDishes = supplyType !== 'bebidas';

  return (
    <Card className="relative w-full pt-0 rounded-[12px] gap-0 p-0">
      <img
        src={onlyDishes ? './insumo.jpg' : './bebida-1.png'}
        alt="insumo"
        className={`
    relative z-20 object-cover
    ${
      onlyDishes
        ? 'w-full aspect-video'
        : 'w-32 h-32 mx-auto mt-4 object-contain'
    }
  `}
      />
      <CardHeader className="p-4 m-0">
        <CardTitle
          className={`${onlyDishes && 'text-xl'} font-semibold text-card-foreground`}
        >
          Combinado de pescado
        </CardTitle>
        {onlyDishes && (
          <CardDescription className="">
            Contiene tallarines rojos, huancaina, arroz con pollo, ceviche,
            chaufanita
          </CardDescription>
        )}
      </CardHeader>
      <CardFooter className="px-4 pb-4 flex justify-between">
        <p className="font-bold text-xl text-primary">S/ 10.00</p>
        {onlyDishes ? (
          <Button className="w-32 bg-[#254875] cursor-pointer font-semibold">
            AGREGAR
          </Button>
        ) : (
          <button className="w-10 h-10 rounded-full cursor-pointer bg-[#254875] font-semibold flex items-center justify-center">
            <Plus className="text-card w-7 h-7" />
          </button>
        )}
      </CardFooter>
    </Card>
  );
};
