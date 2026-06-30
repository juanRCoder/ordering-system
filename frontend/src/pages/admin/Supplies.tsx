import { SupplyDialog } from '@/components/admin/SupplyDialog';
import { BottomAppBar } from '@/components/BottomAppBar';
// import { InputSearch } from '@/components/InputSearch';
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
import { useState } from 'react';
import { useSuppliesByAdmin } from '@/hooks/useSupplies';
import { SupplyCardAdminSkeleton } from '@/skeletons/SupplyCardSkeleton';
import type { SupplyResponse } from '@/interfaces/supplies.interface';
import { SupplyCard } from '@/components/admin/SupplyCard';
import type { CategoryResponse } from '@/interfaces/categories.interface';

function Supplies() {
  const [supplyOrigin, setSupplyOrigin] = useState('PLATFORM');
  const [selectedMode, setSelectedMode] = useState<'create' | 'edit'>('create');
  const [selectedSupplyId, setSelectedSupplyId] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const categories = useCategories();
  const activeCategoryId = selectedCategoryId ?? categories.data?.[0]?.id ?? '';
  const suppliesByType = useSuppliesByAdmin(activeCategoryId);

  const selectedCategory = categories.data?.find(
    (category: CategoryResponse) => category.id === activeCategoryId
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
          {/* <InputSearch placeholder="Buscar general" /> */}
          <div className="max-w-md flex gap-3.5">
            <Select
              value={selectedCategoryId}
              onValueChange={(value) => setSelectedCategoryId(value ?? '')}
            >
              <SelectTrigger className="w-full bg-[#F8F9FA] border border-gray-300 rounded-sm px-3 h-[46px]!">
                <SelectValue>{selectedCategory?.name}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categories.data?.map((category: CategoryResponse) => (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
            {categories.isLoading || suppliesByType.isLoading
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
                      console.log(supply.origin);
                      setSupplyOrigin(supply.origin);
                    }}
                  />
                ))}
          </div>
        </div>
      </div>
      <div className="fixed w-full mx-auto bottom-0">
        <BottomAppBar statusAdmin={true} />
      </div>
      <SupplyDialog
        externalTrigger={openDialog}
        setExternalTrigger={setOpenDialog}
        mode={selectedMode}
        id={selectedSupplyId}
        origin={supplyOrigin}
      />
    </section>
  );
}

export default Supplies;
