import { BottomAppBar } from '@/components/BottomAppBar';
import { TopAppBar } from '@/components/TopAppBar';
import { useLogout } from '@/hooks/useAuth';

type props = {
  isAdmin?: boolean;
};

export default function Settings({ isAdmin }: props) {
  const logoutMutation = useLogout();

  return (
    <section className="bg-[#F8F9FF] min-h-screen flex flex-col">
      <TopAppBar
        subtitle={
          isAdmin && (
            <p className="text-sm text-muted-foreground truncate max-w-[180px]">
              Panel de Administrativo
            </p>
          )
        }
      />
      <div className="flex-1 flex flex-col p-3 pb-24">
        <h2 className="text-2xl font-bold text-[#031C30] mb-3">Ajustes</h2>
        <hr />
        <div className="flex flex-col mt-4 gap-2">
          <p
            className="cursor-pointer w-fit"
            onClick={() => console.log('CREAR CATEGORIA')}
          >
            Categorias
          </p>
          <span className="block border-b border-muted-foreground/10 w-full"></span>
          <p
            className="text-destructive cursor-pointer w-fit"
            onClick={() => logoutMutation.mutate()}
          >
            {logoutMutation.isPending ? 'Cerrando sesión...' : 'Cerrar Sesión'}
          </p>
        </div>
      </div>
      <div className="fixed w-full max-w-md mx-auto bottom-0">
        <BottomAppBar statusAdmin={isAdmin} />
      </div>
    </section>
  );
}
