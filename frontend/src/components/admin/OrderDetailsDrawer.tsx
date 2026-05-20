import { Drawer, DrawerContent } from '@/components/ui/drawer';

type props = {
  externalTrigger?: boolean;
  setExternalTrigger: (e: boolean) => void;
};

export const OrderDetailsDrawer = ({
  externalTrigger,
  setExternalTrigger,
}: props) => {
  return (
    <Drawer
      direction="bottom"
      open={externalTrigger}
      onOpenChange={setExternalTrigger}
    >
      <DrawerContent className="w-full max-w-md mr-auto ml-[640px]">
        <div className="p-4">OrderDetailsDrawer</div>
      </DrawerContent>
    </Drawer>
  );
};
