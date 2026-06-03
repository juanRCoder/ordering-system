import { BottomAppBar } from '@/components/BottomAppBar';
import { TopAppBar } from '@/components/TopAppBar';
import { Button } from '@/components/ui/button';
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
        <div className="flex flex-col mt-3">
          <Button
            variant="destructive"
            className="cursor-pointer"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? 'Cerrando sesión...' : 'Cerrar Sesión'}
          </Button>
        </div>
      </div>
      <div className="fixed w-full max-w-md mx-auto bottom-0">
        <BottomAppBar statusAdmin={isAdmin} />
      </div>
    </section>
  );
}
