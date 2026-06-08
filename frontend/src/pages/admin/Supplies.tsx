import { SupplyDialog } from '@/components/admin/SupplyDialog';
import { BottomAppBar } from '@/components/BottomAppBar';
import { InputSearch } from '@/components/InputSearch';
import { TopAppBar } from '@/components/TopAppBar';
import { Button } from '@/components/ui/button';
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
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSuppliesByTypeId } from '@/hooks/useSupplies';
import { SupplyCardAdminSkeleton } from '@/skeletons/SupplyCardSkeleton';
import type { SupplyResponse } from '@/interfaces/supplies.interface';
import { SupplyCard } from '@/components/admin/SupplyCard';

function Supplies() {
  const [changeCategory, setChangeCategory] =
    useState<TypeSupplyResponse | null>(null);
  const [typeSupplyId, setTypeSupplyId] = useState<string>('');
  const [openSupplyDialog, setOpenSupplyDialog] = useState<boolean>(false);

  const typesSupplies = useTypesSupplies();
  const allSupplies = useSuppliesByTypeId(changeCategory?.id || 'all');

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
      <div className="flex flex-col p-3 pb-24">
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
                    <SelectItem
                      key={ts.id}
                      value={ts.id}
                      onClick={() => setChangeCategory(ts)}
                    >
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
            {allSupplies.data?.length} resultados{' '}
            {selectedTypeSupply?.name === 'Todos'
              ? ''
              : 'en ' + selectedTypeSupply?.name}
          </h2>
          <div className="flex flex-col gap-4">
            {allSupplies.isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <SupplyCardAdminSkeleton key={i} />
                ))
              : allSupplies.data?.map((supply: SupplyResponse) => (
                  <SupplyCard key={supply.id} data={supply} />
                ))}
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
