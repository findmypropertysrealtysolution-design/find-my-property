import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface PropertyImageGalleryProps {
  images: string[];
  title: string;
  children?: React.ReactNode; // For overlay badges
}

const PropertyImageGallery = ({ images, title, children }: PropertyImageGalleryProps) => {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  return (
    <div className="relative rounded-2xl overflow-hidden aspect-[16/9] group">
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={images[current]}
          alt={`${title} - Photo ${current + 1}`}
          className="w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      </AnimatePresence>

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                i === current ? "bg-primary-foreground w-5" : "bg-primary-foreground/50"
              )}
            />
          ))}
        </div>
      )}

      {/* Counter */}
      {images.length > 1 && (
        <div className="absolute bottom-4 right-4 bg-card/80 backdrop-blur-sm text-foreground text-xs font-medium px-2.5 py-1 rounded-full">
          {current + 1} / {images.length}
        </div>
      )}

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "w-14 h-10 rounded-lg overflow-hidden border-2 transition-all",
                i === current ? "border-primary scale-110" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Overlay children (badges etc) */}
      {children}
    </div>
  );
};

export default PropertyImageGallery;
