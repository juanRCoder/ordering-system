type props = {
  quantity: number;
  product: string;
  price: number;
};

export const OrderDetailItem = ({ quantity, product, price }: props) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <span className="shrink-0 h-8 w-8 rounded-lg bg-[#D8E9FF]/50 grid place-items-center">
          {quantity}
        </span>
        <p>{product}</p>
      </div>
      <span className="text-primary font-medium">S/ {price}</span>
    </div>
  );
};
