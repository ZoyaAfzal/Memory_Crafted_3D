import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useCallback, useMemo } from "react";
import { shapes, addons, type Shape, type Size } from "@/data/products";
import { ShapeSelector } from "@/components/shop/ShapeSelector";
import { SizeSelector } from "@/components/shop/SizeSelector";
import { PhotoUpload } from "@/components/shop/PhotoUpload";
import { AddonList } from "@/components/shop/AddonList";
import { CustomerForm } from "@/components/shop/CustomerForm";
import { TotalBar } from "@/components/shop/TotalBar";
import { calculateTotal } from "@/components/shop/PriceCalculator";
import { Reveal } from "@/components/site/Reveal";
import { Mail, Phone } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop 3D Crystal Gifts — Memory3D" },
      {
        name: "description",
        content:
          "Create your stunning 3D gift from any photo. Pick your shape, size, and customize forever.",
      },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const { addItem } = useCart();
  const [selectedShape, setSelectedShape] = useState<Shape>(shapes[0]);
  const [selectedSize, setSelectedSize] = useState<Size>(shapes[0].sizes[0]);
  const [uploadedPhoto, setUploadedPhoto] = useState<File | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<
    Record<string, { checked: boolean; qty: number }>
  >({});
  const [inscriptionText, setInscriptionText] = useState("");
  const [shippingPrice, setShippingPrice] = useState(0);
  const [formData, setFormData] = useState<any>({});

  const handleShapeChange = useCallback((shape: Shape) => {
    setSelectedShape(shape);
    setSelectedSize(shape.sizes[0]);
    // Reset configurations when shape changes to avoid confusion
    setSelectedAddons({});
    setInscriptionText("");
  }, []);

  const totals = useMemo(
    () =>
      calculateTotal({
        sizePrice: selectedSize.price,
        selectedAddons,
        addons,
        inscriptionText,
        shippingPrice,
      }),
    [selectedSize, selectedAddons, inscriptionText, shippingPrice],
  );

  const missingFields = useMemo(() => {
    const fields = [];
    if (!uploadedPhoto) fields.push("photo");
    if (!formData.name) fields.push("Full Name");
    return fields;
  }, [uploadedPhoto, formData]);

  const isReady = missingFields.length === 0;

  const handleAddToCart = () => {
    addItem({
      id: crypto.randomUUID(),
      shapeId: selectedShape.id,
      shapeLabel: selectedShape.label,
      sizeId: selectedSize.id,
      sizeLabel: selectedSize.label,
      price: totals.total,
      photo: uploadedPhoto ? URL.createObjectURL(uploadedPhoto) : "",
      addons: addons
        .filter((a) => selectedAddons[a.id]?.checked)
        .map((a) => ({
          id: a.id,
          label: a.label,
          price: a.price,
          qty: selectedAddons[a.id]?.qty || 1,
        })),
      inscriptionText,
      quantity: 1,
    });

    toast.success("Order added to cart! We'll review your photo shortly.");
  };

  return (
    <div className="bg-background min-h-screen pt-32 pb-24">
      <main className="max-w-2xl mx-auto px-6 lg:px-8">
        {/* Header Banner */}
        <Reveal>
          <div className="relative overflow-hidden py-12 mb-16 text-center border-y border-gold/20 bg-card/30 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-gold/5" />
            <div className="relative z-10">
              <h1 className="text-[20px] md:text-[26px] font-display font-bold uppercase tracking-[0.5em] text-gradient-gold">
                Stunning 3D Gift
              </h1>
              <div className="flex items-center justify-center gap-4 mt-3">
                <div className="h-[1px] w-8 bg-gold/30" />
                <p className="text-muted-foreground uppercase text-[10px] tracking-[0.4em] font-medium">
                  Made From Your Photo
                </p>
                <div className="h-[1px] w-8 bg-gold/30" />
              </div>
            </div>
          </div>
        </Reveal>

        {/* 1. Shape Selection */}
        <section className="mb-20">
          <Reveal delay={0.1}>
            <h2 className="text-gold font-bold uppercase tracking-[0.3em] text-center mb-10 text-[12px] flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-gold/30" />
              1. Select Shape
              <span className="h-px w-8 bg-gold/30" />
            </h2>
            <ShapeSelector
              shapes={shapes}
              selectedShapeId={selectedShape.id}
              onShapeChange={handleShapeChange}
            />
          </Reveal>
        </section>

        {/* 2. Size Selection */}
        <section className="mt-16">
          <Reveal delay={0.2}>
            <h2 className="text-gold font-bold uppercase tracking-[0.3em] text-center mb-8 text-[12px]">
              2. Choose Size
            </h2>
            <SizeSelector
              key={selectedShape.id}
              sizes={selectedShape.sizes}
              selectedSizeId={selectedSize.id}
              onSizeChange={setSelectedSize}
            />
          </Reveal>
        </section>

        {/* 3. Photo Upload */}
        <section className="mt-16">
          <Reveal delay={0.3}>
            <h2 className="text-gold font-bold uppercase tracking-[0.3em] text-center mb-8 text-[12px]">
              3. Upload Your Photo
            </h2>
            <PhotoUpload
              shapePreviewImage={selectedShape.previewImage}
              onPhotoChange={setUploadedPhoto}
            />
          </Reveal>
        </section>

        {/* 4. Add-ons */}
        <section className="mt-16">
          <Reveal delay={0.4}>
            <h2 className="text-gold font-bold uppercase tracking-[0.3em] text-center mb-8 text-[12px]">
              4. Premium Add-ons
            </h2>
            <AddonList
              addons={addons}
              selectedAddons={selectedAddons}
              onAddonChange={(id, checked, qty) =>
                setSelectedAddons((prev) => ({ ...prev, [id]: { checked, qty } }))
              }
            />
          </Reveal>
        </section>

        {/* 5. Custom Inscription */}
        <section className="mt-16">
          <Reveal delay={0.5}>
            <h2 className="text-gold font-bold uppercase tracking-[0.3em] text-center mb-8 text-[12px]">
              5. Custom Inscription
            </h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Type your engraving text here..."
                value={inscriptionText}
                onChange={(e) => setInscriptionText(e.target.value)}
                className="w-full bg-card/30 border border-border rounded-sm px-5 py-4 text-sm focus:border-gold outline-none transition-colors italic"
              />
            </div>
          </Reveal>
        </section>

        {/* 6. Checkout Info */}
        <CustomerForm onShippingChange={setShippingPrice} onFormChange={setFormData} />

        {/* 7. Total & Action */}
        <TotalBar
          subtotal={totals.subtotal}
          shippingPrice={totals.shipping}
          total={totals.total}
          isReady={isReady}
          missingFields={missingFields}
          onAddToCart={handleAddToCart}
        />

        {/* 8. Inspiration Gallery */}
        <section className="mt-40 mb-20">
          <Reveal>
            <div className="text-center mb-16">
              <div className="h-[1px] w-24 bg-gold/30 mx-auto mb-8" />
              <span className="text-[11px] tracking-[0.4em] uppercase text-gold font-bold">
                Lookbook
              </span>
              <h2 className="font-display text-4xl md:text-5xl mt-4 text-gradient-gold pb-2">
                Handcrafted Masterpieces
              </h2>
              <p className="text-muted-foreground text-[10px] mt-6 uppercase tracking-[0.3em] max-w-md mx-auto leading-loose">
                Every crystal is a bespoke work of art, meticulously laser-engraved for eternity.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 gap-6 md:gap-8">
            {[
              { img: shapes[0].previewImage, t: "Classic Portrait", shapeId: "rectangle-tall" },
              { img: shapes[2].previewImage, t: "Heart Keepsake", shapeId: "heart" },
              { img: shapes[5].previewImage, t: "Diamond Cut", shapeId: "cut-corner-diamond" },
              { img: addons[7].image, t: "Premium Wood Finish", shapeId: "any" },
              { img: shapes[3].previewImage, t: "Prestige Style", shapeId: "prestige" },
              { img: addons[2].image, t: "Heart Keychain", shapeId: "heart-keychain" },
              { img: shapes[10].previewImage, t: "Holiday Ornament", shapeId: "ornament" },
              { img: shapes[6].previewImage, t: "LED Keychain", shapeId: "vertical-keychain" },
            ]
              .filter((item) => item.shapeId === "any" || item.shapeId === selectedShape.id)
              .map((item, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <div className="relative group overflow-hidden rounded-sm border border-border/40 aspect-square bg-card/10 backdrop-blur-sm flex items-center justify-center p-6 hover:border-gold/30 transition-colors">
                    <img
                      src={item.img}
                      alt={item.t}
                      className="max-w-full max-h-full object-contain transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                      <span className="text-[9px] tracking-[0.25em] uppercase font-bold text-gold">
                        {item.t}
                      </span>
                    </div>
                  </div>
                </Reveal>
              ))}
          </div>
        </section>

        {/* Footer Contact Strip */}
        <Reveal delay={0.6}>
          <div className="text-center mt-12 border border-border/60 rounded-sm p-8 bg-card/20">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6 text-muted-foreground">
              Contact Us for Queries / Support
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-[11px] tracking-[0.1em] font-medium text-foreground">
              <a
                href="mailto:support@memory3d.com"
                className="flex items-center gap-2 hover:text-gold transition-colors"
              >
                <Mail className="w-4 h-4 text-gold" /> support@memory3d.com
              </a>
              <span className="hidden sm:block opacity-30">|</span>
              <a
                href="tel:888-936-3667"
                className="flex items-center gap-2 hover:text-gold transition-colors"
              >
                <Phone className="w-4 h-4 text-gold" /> 888-936-3667
              </a>
            </div>
          </div>
        </Reveal>
      </main>
    </div>
  );
}
