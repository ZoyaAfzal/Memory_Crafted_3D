import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";

interface TotalBarProps {
  subtotal: number;
  shippingPrice: number;
  total: number;
  isReady: boolean;
  missingFields: string[];
  onAddToCart: () => void;
}

export function TotalBar({
  shippingPrice,
  total,
  isReady,
  missingFields,
  onAddToCart,
}: TotalBarProps) {
  const handleAddToCart = () => {
    if (!isReady) {
      if (missingFields.includes("photo")) {
        toast.error("Please upload your photo to continue.");
      } else {
        toast.error(`Please fill in: ${missingFields.join(", ")}`);
      }
      return;
    }
    onAddToCart();
  };

  return (
    <div className="mt-16 border-t-2 border-gold/20 pt-8 space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-end">
          <span className="text-[12px] tracking-[0.3em] uppercase font-bold text-foreground">
            Total Price
          </span>
          <span className="font-display text-4xl md:text-5xl text-gold font-bold">
            $ {total.toFixed(2)}
          </span>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        className="w-full bg-foreground text-background py-5 rounded-sm text-[11px] tracking-[0.4em] uppercase font-bold flex items-center justify-center gap-3 transition-all hover:bg-gold hover:text-primary-foreground active:scale-[0.98]"
      >
        <ShoppingCart className="w-4 h-4" />
        Add to Cart
      </button>
    </div>
  );
}
