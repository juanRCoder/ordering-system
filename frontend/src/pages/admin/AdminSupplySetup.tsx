import { BottomAppBar } from '@/components/BottomAppBar';
import { InputField } from '@/components/InputField';
import { TopAppBar } from '@/components/TopAppBar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTypesSupplies } from '@/hooks/useTypesSupplies';
import type { CreateSupplyType } from '@/interfaces/supplies.interface';
import type { TypeSupplyResponse } from '@/interfaces/typesSupplies.interface';
import { supplyFormValues } from '@/lib/default';
import { createSupplySchema } from '@/schemas/supplies.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

function AdminSupplySetup() {
  const navigate = useNavigate();
  const typesSupplies = useTypesSupplies();

  const [status, setStatus] = useState<string>('AVAILABLE');
  const [typeSupply, setTypeSupply] = useState<string>('');

  useEffect(() => {
    if (typesSupplies.data?.length) {
      setTypeSupply(typesSupplies.data[0].id);
    }
  }, [typesSupplies.data]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateSupplyType>({
    resolver: zodResolver(createSupplySchema),
    defaultValues: supplyFormValues,
  });

  const selectedTypeSupply = typesSupplies.data?.find(
    (ts: TypeSupplyResponse) => ts.id === typeSupply
  );

  const onSubmit = (data: CreateSupplyType) => {
    console.log('DATA:');
    console.log({ ...data, type_supply_id: typeSupply, status });
  };

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
            onClick={() => navigate('/supply-setup')}
          >
            <Plus className="h-6! w-6!" strokeWidth={1.5} />
            Agregar Insumo
          </Button>
        }
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-1 flex flex-col p-5 pb-24"
      >
        <h2 className="text-2xl font-bold text-[#031C30]">Nuevo Insumo</h2>
        <Card className="flex flex-col gap-4 mt-3 p-4">
          <InputField
            {...register('name')}
            error={errors.name?.message}
            label="Nombre*"
            type="text"
          />
          <div className="flex gap-3">
            <div className="flex-1 min-w-0">
              <InputField
                {...register('price', {
                  valueAsNumber: true,
                })}
                error={errors.price?.message}
                label="Precio*"
                type="number"
                leftSuffix={
                  <span className="text-[#6B7280] font-semibold">S/.</span>
                }
              />
            </div>
            <div className="flex-1 min-w-0 flex flex-col">
              <label className="text-[#43474F] font-semibold mb-2">
                Estado
              </label>
              <div className="w-full">
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-full bg-[#F8F9FA] border border-gray-300 rounded-lg px-3">
                    <SelectValue>
                      {status === 'AVAILABLE' ? 'Disponible' : 'No disponible'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel className="text-[#43474F] font-semibold">
                        Estado
                      </SelectLabel>
                      <SelectItem value="AVAILABLE">Disponible</SelectItem>
                      <SelectItem value="UNAVAILABLE">No disponible</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0 flex flex-col">
            <label className="text-[#43474F] font-semibold mb-2">
              Tipo de Insumo*
            </label>
            <div className="w-full">
              <Select value={typeSupply} onValueChange={setTypeSupply}>
                <SelectTrigger className="w-full bg-[#F8F9FA] border border-gray-300 rounded-lg px-3">
                  <SelectValue>{selectedTypeSupply?.name}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Tipos</SelectLabel>
                    {typesSupplies.data?.map((ts: TypeSupplyResponse) => (
                      <SelectItem key={ts.id} value={ts.id}>
                        {ts.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="block text-[#43474F] font-semibold mb-2">
              Descripción
            </label>
            <textarea
              {...register('description')}
              className="block text-sm w-full h-24 rounded-bl-lg rounded-br-lg p-4 outline-none resize-none border border-[#C3C6D0] rounded-lg bg-[#F8F9FA]"
            />
          </div>
          {/* <div className="flex-1 min-w-0 flex flex-col">
            <label className="text-[#43474F] font-semibold mb-2">Imagen</label>
            <label className="cursor-pointer">
              <input type="file" accept=".png,.jpg,.jpeg" className="hidden" />

              <div className="border border-[#C3C6D0] rounded-2xl bg-[#F8F9FA] h-[230px] flex flex-col items-center justify-center hover:bg-[#F3F4F6] transition-colors">
                <Image className="w-16 h-16 text-[#6B7280] mb-3" />

                <p className="text-[#6B7280] text-sm">Solo archivos png, jpg</p>
              </div>
            </label>
          </div> */}
        </Card>
        <Button
          type="submit"
          className="w-full h-12 rounded-xl mt-4 cursor-pointer"
        >
          CREAR
        </Button>
      </form>
      <div className="fixed w-full max-w-md mx-auto bottom-0">
        <BottomAppBar statusAdmin={true} />
      </div>
    </section>
  );
}

export default AdminSupplySetup;
