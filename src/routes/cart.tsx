import { createFileRoute, Link } from "@tanstack/react-router";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingBag } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

function CartPage() {
  const { items, removeItem, totalPrice } = useCart();

  return (
    <div className="pt-40 pb-24 min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6">
        <Reveal>
          <div className="flex items-center gap-4 mb-12">
            <h1 className="font-display text-4xl md:text-5xl text-foreground">Your Shopping Bag</h1>
            <div className="h-px flex-1 bg-gold/20" />
          </div>
        </Reveal>

        {items.length === 0 ? (
          <Reveal delay={0.1}>
            <div className="text-center py-32 bg-card/30 border border-dashed border-border rounded-sm">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-20" />
              <p className="text-muted-foreground mb-10 text-lg uppercase tracking-widest">
                Your bag is empty.
              </p>
              <Link to="/shop">
                <Button className="bg-gradient-gold text-primary-foreground px-10 py-6 text-[11px] tracking-[0.3em] uppercase rounded-sm shadow-gold">
                  Explore Collection
                </Button>
              </Link>
            </div>
          </Reveal>
        ) : (
          <div className="grid lg:grid-cols-[1fr_350px] gap-12">
            <div className="space-y-6">
              {items.map((item, i) => (
                <Reveal key={item.id} delay={i * 0.05}>
                  <div className="flex gap-6 p-6 bg-card/50 border border-border rounded-sm hover:border-gold/30 transition-colors group">
                    <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 bg-background border border-border flex items-center justify-center p-4 rounded-sm">
                      <img
                        src={item.photo}
                        alt={item.shapeLabel}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="font-display text-xl md:text-2xl mb-1 text-foreground">
                            {item.shapeLabel}
                          </h3>
                          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
                            Size: <span className="text-gold font-bold">{item.sizeLabel}</span>
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {item.addons.length > 0 && (
                        <div className="mb-4">
                          <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-2">
                            Enhancements:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {item.addons.map((a) => (
                              <span
                                key={a.id}
                                className="px-2 py-0.5 bg-background border border-border text-[9px] uppercase tracking-tighter text-muted-foreground rounded-full"
                              >
                                {a.label} {a.qty > 1 ? `(x${a.qty})` : ""}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="font-display text-2xl text-gold font-bold">${item.price.toFixed(2)}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="space-y-6">
              <Reveal delay={0.2}>
                <div className="p-8 bg-card border border-border rounded-sm sticky top-32">
                  <h2 className="font-display text-2xl mb-6 text-foreground border-b border-border pb-4">
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground uppercase tracking-widest text-[10px]">
                        Subtotal
                      </span>
                      <span className="text-foreground font-bold">${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground uppercase tracking-widest text-[10px]">
                        Shipping
                      </span>
                      <span className="text-green-500 font-bold uppercase text-[10px]">Free</span>
                    </div>
                    <div className="h-px bg-border my-4" />
                    <div className="flex justify-between items-end">
                      <span className="font-display text-lg uppercase tracking-widest">Total</span>
                      <span className="font-display text-3xl text-gold font-bold">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Link to="/checkout" className="block">
                    <Button className="w-full bg-gradient-gold text-primary-foreground py-7 text-[11px] tracking-[0.3em] uppercase rounded-sm shadow-gold">
                      Proceed to Checkout
                    </Button>
                  </Link>

                  <p className="mt-6 text-[10px] text-center text-muted-foreground uppercase tracking-widest leading-loose">
                    Secure Checkout & Encrypted Payment
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
