import { Size } from "@/data/products";
import { Users, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface SizeSelectorProps {
  sizes: Size[];
  selectedSizeId: string;
  onSizeChange: (size: Size) => void;
}

export function SizeSelector({ sizes, selectedSizeId, onSizeChange }: SizeSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {sizes.map((size, i) => (
        <motion.button
          key={size.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          onClick={() => onSizeChange(size)}
          className={`relative p-5 text-left transition-all border-2 rounded-sm flex flex-col justify-between h-full group ${
            selectedSizeId === size.id
              ? "border-gold bg-gold/5 shadow-gold/10 shadow-lg"
              : "border-border hover:border-gold/30 bg-card/30"
          }`}
        >
          <div>
            <div
              className={`text-[11px] tracking-[0.15em] uppercase font-bold mb-2 transition-colors ${
                selectedSizeId === size.id
                  ? "text-gold"
                  : "text-muted-foreground group-hover:text-gold/80"
              }`}
            >
              {size.label}
            </div>

            <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-1">
              <Users className="w-3 h-3 text-gold/60" />
              <span>{size.people} People</span>
            </div>

            <div className="text-[10px] text-muted-foreground leading-tight italic">
              {size.dimensions}
            </div>
          </div>

          <div className="mt-6 flex items-end justify-between">
            <div className="font-display text-2xl text-gold font-bold">${size.price}</div>
            {selectedSizeId === size.id && <CheckCircle className="w-5 h-5 text-gold" />}
          </div>
        </motion.button>
      ))}
    </div>
  );
}
