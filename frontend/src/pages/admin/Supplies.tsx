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
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSuppliesByTypeId } from '@/hooks/useSupplies';
import { SupplyCardAdminSkeleton } from '@/skeletons/SupplyCardSkeleton';
import type { SupplyResponse } from '@/interfaces/supplies.interface';
import { SupplyCard } from '@/components/admin/SupplyCard';

function Supplies() {
  const [selectedMode, setSelectedMode] = useState<'create' | 'edit'>('create');
  const [selectedSupplyId, setSelectedSupplyId] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const categories = useCategories();
  const suppliesByType = useSuppliesByTypeId(selectedCategoryId);

  const defaultOption = { id: 'all', name: 'Todos' };
  const allCategories = [defaultOption, ...(categories.data || [])];

  useEffect(() => {
    if (allCategories.length) {
      setSelectedCategoryId(allCategories[0].id);
    }
  }, [categories.data]);

  const selectedCategory = allCategories?.find(
    (category) => category.id === selectedCategoryId
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
              value={selectedCategoryId}
              onValueChange={(value) => setSelectedCategoryId(value ?? '')}
            >
              <SelectTrigger className="w-full bg-[#F8F9FA] border border-gray-300 rounded-sm px-3 h-[46px]!">
                <SelectValue>{selectedCategory?.name}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {allCategories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="cursor-pointer rounded-sm py-5.5"
              onClick={() => {
                setSelectedMode('create');
                setOpenDialog(true);
              }}
            >
              <Plus className="h-6! w-6!" strokeWidth={1.5} />
              Agregar Insumo
            </Button>
          </div>
          <h2 className="text-xl font-semibold text-[#161D17]">
            {suppliesByType.data?.length} resultados{' '}
            {selectedCategory?.name === 'Todos'
              ? ''
              : 'en ' + selectedCategory?.name}
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
                      setOpenDialog(true);
                      setSelectedMode('edit');
                      setSelectedSupplyId(supply.id);
                    }}
                  />
                ))}
          </div>
        </div>
      </div>
      <div className="fixed w-full max-w-[344px] mx-auto bottom-0">
        <BottomAppBar statusAdmin={true} />
      </div>
      <SupplyDialog
        externalTrigger={openDialog}
        setExternalTrigger={setOpenDialog}
        mode={selectedMode}
        id={selectedSupplyId}
      />
    </section>
  );
}

export default Supplies;
