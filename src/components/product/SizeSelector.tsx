import { cn } from '@/lib/utils';

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string | null;
  onSizeSelect: (size: string) => void;
  sizeType?: 'letter' | 'number';
}

const letterSizes = ['S', 'M', 'L', 'XL', 'XXL'];
const numberSizes = ['38', '40', '42', '44', '46'];

export default function SizeSelector({ 
  sizes, 
  selectedSize, 
  onSizeSelect,
  sizeType = 'letter' 
}: SizeSelectorProps) {
  // Use provided sizes or fall back to defaults based on type
  const availableSizes = sizes.length > 0 
    ? sizes 
    : (sizeType === 'number' ? numberSizes : letterSizes);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="font-sans font-semibold text-sm uppercase tracking-wider text-muted-foreground">
          Select Size
        </label>
        {selectedSize && (
          <span className="text-sm font-sans text-primary font-medium">
            Selected: {selectedSize}
          </span>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {availableSizes.map((size) => (
          <button
            key={size}
            onClick={() => onSizeSelect(size)}
            className={cn(
              "min-w-[48px] h-12 px-4 rounded-lg font-sans font-medium text-sm transition-all duration-200",
              "border-2 hover:border-primary",
              selectedSize === size
                ? "bg-primary text-primary-foreground border-primary shadow-gold"
                : "bg-background text-foreground border-border hover:bg-muted"
            )}
          >
            {size}
          </button>
        ))}
      </div>

      {!selectedSize && (
        <p className="text-xs text-muted-foreground font-sans">
          Please select a size to continue
        </p>
      )}
    </div>
  );
}
