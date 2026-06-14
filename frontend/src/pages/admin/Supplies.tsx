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
import { useCategories } from '@/hooks/useCategories';
import type { CategoryResponse } from '@/interfaces/categories.interface';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSuppliesByTypeId } from '@/hooks/useSupplies';
import { SupplyCardAdminSkeleton } from '@/skeletons/SupplyCardSkeleton';
import type { SupplyResponse } from '@/interfaces/supplies.interface';
import { SupplyCard } from '@/components/admin/SupplyCard';

function Supplies() {
  const [changeCategory, setChangeCategory] = useState<CategoryResponse | null>(
    null
  );
  const [typeSupplyId, setTypeSupplyId] = useState<string>('');

  // for dialog
  const [openSupplyDialog, setOpenSupplyDialog] = useState<boolean>(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [supplyId, setSupplyId] = useState<string>('');

  const categories = useCategories();
  const suppliesByType = useSuppliesByTypeId(changeCategory?.id || 'all');

  const allOption = { id: 'all', name: 'Todos' };
  const categoriesWithAll = [allOption, ...(categories.data ?? [])];

  useEffect(() => {
    if (categoriesWithAll.length) {
      setTypeSupplyId(categoriesWithAll[0].id);
    }
  }, [categories.data]);

  const selectedTypeSupply = categoriesWithAll?.find(
    (ts: CategoryResponse) => ts.id === typeSupplyId
  );

  return (
    <section className="bg-[#F8F9FF] min-h-screen flex flex-col">
      <TopAppBar
        subtitle={
          <p className="text-sm text-muted-foreground truncate max-w-[180px]">
            Panel de Administrativo
          </p>
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
                  {categoriesWithAll?.map((ts: CategoryResponse) => (
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
              onClick={() => {
                setMode('create');
                setOpenSupplyDialog(true);
              }}
            >
              <Plus className="h-6! w-6!" strokeWidth={1.5} />
              Agregar Insumo
            </Button>
          </div>
          <h2 className="text-xl font-semibold text-[#161D17]">
            {suppliesByType.data?.length} resultados{' '}
            {selectedTypeSupply?.name === 'Todos'
              ? ''
              : 'en ' + selectedTypeSupply?.name}
          </h2>
          <div className="flex flex-col gap-4">
            {suppliesByType.isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <SupplyCardAdminSkeleton key={i} />
                ))
              : suppliesByType.data?.map((supply: SupplyResponse) => (
                  <SupplyCard
                    key={supply.id}
                    data={supply}
                    handlerEvents={() => {
                      setOpenSupplyDialog(true);
                      setMode('edit');
                      setSupplyId(supply.id);
                    }}
                  />
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
        mode={mode}
        id={supplyId}
      />
    </section>
  );
}

export default Supplies;
