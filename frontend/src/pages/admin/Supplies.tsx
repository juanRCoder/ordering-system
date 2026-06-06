import { SupplyDialog } from '@/components/admin/SupplyDialog';
import { BottomAppBar } from '@/components/BottomAppBar';
import { InputSearch } from '@/components/InputSearch';
import { TopAppBar } from '@/components/TopAppBar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTypesSupplies } from '@/hooks/useTypesSupplies';
import type { TypeSupplyResponse } from '@/interfaces/typesSupplies.interface';
import { Pencil, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

function Supplies() {
  const typesSupplies = useTypesSupplies();

  const [typeSupplyId, setTypeSupplyId] = useState<string>('');
  const [enabled, setEnabled] = useState<boolean>(false);
  const [openSupplyDialog, setOpenSupplyDialog] = useState<boolean>(false);

  const allOption = { id: 'all', name: 'Todos' };
  const typesSuppliesWithAll = [allOption, ...(typesSupplies.data ?? [])];

  useEffect(() => {
    if (typesSuppliesWithAll.length) {
      setTypeSupplyId(typesSuppliesWithAll[0].id);
    }
  }, [typesSupplies.data]);

  const selectedTypeSupply = typesSuppliesWithAll?.find(
    (ts: TypeSupplyResponse) => ts.id === typeSupplyId
  );

  return (
    <section className="bg-[#F8F9FF] min-h-screen flex flex-col">
      <TopAppBar
        subtitle={
          <p className="text-sm text-muted-foreground truncate max-w-[180px]">
            Panel de Administrativo
          </p>
        }
        itemHeader={
          <Button
            variant="outline"
            className="cursor-pointer rounded-lg py-5.5"
            onClick={() => setOpenSupplyDialog(true)}
          >
            <Plus className="h-6! w-6!" strokeWidth={1.5} />
            Agregar Insumo
          </Button>
        }
      />
      <div className="flex-1 flex flex-col p-3 pb-24">
        <div className="flex flex-col gap-3.5">
          <InputSearch placeholder="Buscar general" />
          <div className="flex gap-3.5">
            <Select
              value={typeSupplyId}
              onValueChange={(value) => setTypeSupplyId(value ?? '')}
            >
              <SelectTrigger className="w-full bg-[#F8F9FA] border border-gray-300 rounded-sm px-3 h-[46px]!">
                <SelectValue>{selectedTypeSupply?.name}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {typesSuppliesWithAll?.map((ts: TypeSupplyResponse) => (
                    <SelectItem key={ts.id} value={ts.id}>
                      {ts.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="cursor-pointer rounded-sm py-5.5"
              // onClick={() => navigate('/admin/supply-setup')}
            >
              <Plus className="h-6! w-6!" strokeWidth={1.5} />
              Agregar Categoría
            </Button>
          </div>
          <h2 className="text-xl font-semibold text-[#161D17]">
            04 resultados{' '}
            {selectedTypeSupply?.name === 'Todos'
              ? ''
              : 'en ' + selectedTypeSupply?.name}
          </h2>
          <div className="flex flex-col gap-4">
            <Card className="rounded-sm px-2 py-1 flex flex-row items-center gap-4">
              <div className="shrink-0 w-20 h-20 rounded-[8px] overflow-hidden">
                <img
                  src="/insumo.jpg"
                  alt="insumo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-card-foreground text-lg font-semibold">
                  Lomo Saltado
                </h2>
                <p className="text-primary text-base font-semibold pb-1">
                  S/ 10.00
                </p>
                <p className="text-[13px] text-muted-foreground line-clamp-2">
                  Contiene tallarines rojos, huancaina, arroz con pollo,
                  ceviche, chaufanita
                </p>
              </div>
              <div className="shrink-0 flex flex-col items-center gap-2.5">
                <span className="bg-[#EFF6FF] cursor-pointer rounded-full w-12 h-12 flex items-center justify-center">
                  <Pencil className="text-primary" />
                </span>
                <span
                  className={cn(
                    'flex flex-col items-center gap-0 justify-center w-18 shrink-0',
                    enabled ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  <p className="font-bold text-[13px]">
                    {enabled ? 'HABILITADO' : 'HABILITAR'}
                  </p>
                  <Switch checked={enabled} onCheckedChange={setEnabled} />
                </span>
              </div>
            </Card>
          </div>
        </div>
      </div>
      <div className="fixed w-full max-w-md mx-auto bottom-0">
        <BottomAppBar statusAdmin={true} />
      </div>
      <SupplyDialog
        externalTrigger={openSupplyDialog}
        setExternalTrigger={setOpenSupplyDialog}
      />
    </section>
  );
}

export default Supplies;
