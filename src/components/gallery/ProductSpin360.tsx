import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw, Maximize2, X, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductSpin360Props {
  images: string[];
  productName: string;
}

export default function ProductSpin360({ images, productName }: ProductSpin360Props) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);
  const frameAtDragStart = useRef(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const totalFrames = images.length;
  const sensitivity = 5; // pixels per frame

  // Preload all images with proper URL handling
  useEffect(() => {
    const loadImage = (index: number) => {
      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => new Set([...prev, index]));
      };
      img.onerror = () => {
        // Still mark as loaded to prevent infinite loading state
        console.warn(`Failed to load image at index ${index}:`, images[index]);
        setLoadedImages(prev => new Set([...prev, index]));
      };
      // Ensure proper URL - handle both absolute and relative paths
      const imageUrl = images[index];
      img.src = imageUrl.startsWith('http') || imageUrl.startsWith('/') 
        ? imageUrl 
        : `/${imageUrl}`;
    };

    if (images.length > 0) {
      images.forEach((_, index) => loadImage(index));
    }
  }, [images]);

  // Check if all images are loaded
  useEffect(() => {
    if (loadedImages.size === totalFrames) {
      setIsLoading(false);
    }
  }, [loadedImages, totalFrames]);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && !isDragging) {
      autoPlayRef.current = setInterval(() => {
        setCurrentFrame(prev => (prev + 1) % totalFrames);
      }, 80);
    } else {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, isDragging, totalFrames]);

  const handleDragStart = useCallback((clientX: number) => {
    setIsDragging(true);
    setIsAutoPlaying(false);
    dragStartX.current = clientX;
    frameAtDragStart.current = currentFrame;
  }, [currentFrame]);

  const handleDragMove = useCallback((clientX: number) => {
    if (!isDragging) return;

    const deltaX = clientX - dragStartX.current;
    const frameDelta = Math.round(deltaX / sensitivity);
    let newFrame = (frameAtDragStart.current + frameDelta) % totalFrames;
    
    if (newFrame < 0) {
      newFrame = totalFrames + newFrame;
    }

    setCurrentFrame(newFrame);
  }, [isDragging, totalFrames, sensitivity]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) handleDragEnd();
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  const SpinnerContent = ({ fullscreen = false }: { fullscreen?: boolean }) => (
    <div
      ref={!fullscreen ? containerRef : undefined}
      className={cn(
        "relative select-none overflow-hidden",
        fullscreen ? "w-full h-full flex items-center justify-center" : "aspect-[3/4] rounded-2xl",
        isDragging ? "cursor-grabbing" : "cursor-grab"
      )}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted z-10">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
            <div 
              className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"
              style={{
                clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%)`,
              }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-xs font-sans font-semibold text-primary">
              {Math.round((loadedImages.size / totalFrames) * 100)}%
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground font-sans">Loading 360° view...</p>
        </div>
      )}

      {/* Image Stack */}
      <div className={cn(
        "relative w-full h-full",
        fullscreen && "max-w-4xl max-h-full"
      )}>
        {images.map((image, index) => {
          // Ensure proper URL handling for storage paths
          const imageUrl = image.startsWith('http') || image.startsWith('/') 
            ? image 
            : `/${image}`;
          return (
            <img
              key={index}
              src={imageUrl}
              alt={`${productName} - Angle ${index + 1}`}
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-opacity duration-75",
                fullscreen && "object-contain",
                index === currentFrame ? "opacity-100" : "opacity-0"
              )}
              draggable={false}
              onError={(e) => {
                console.warn(`360 image failed to load:`, image);
                e.currentTarget.style.display = 'none';
              }}
            />
          );
        })}
      </div>

      {/* Rotation Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
        <div className="px-4 py-2 rounded-full bg-background/90 backdrop-blur-sm shadow-luxury flex items-center gap-3">
          {/* Progress Ring */}
          <div className="relative w-8 h-8">
            <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                strokeDasharray={`${(currentFrame / (totalFrames - 1)) * 94.2} 94.2`}
                strokeLinecap="round"
              />
            </svg>
            <RotateCw className="absolute inset-0 m-auto w-4 h-4 text-primary" />
          </div>
          
          <span className="text-xs font-sans text-muted-foreground">
            {isDragging ? 'Rotating...' : 'Drag to rotate'}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Inline Viewer */}
      <div className="relative bg-gradient-to-br from-muted to-secondary rounded-2xl overflow-hidden shadow-luxury">
        {/* Controls */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={cn(
              "p-2 rounded-full backdrop-blur-sm transition-all",
              isAutoPlaying 
                ? "bg-primary text-primary-foreground" 
                : "bg-background/80 text-foreground hover:bg-background"
            )}
            title={isAutoPlaying ? 'Pause' : 'Auto rotate'}
          >
            {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsFullscreen(true)}
            className="p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-all"
            title="Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* 360 Badge */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-sans font-semibold">
          <RotateCw className="w-3.5 h-3.5" />
          360° View
        </div>

        <SpinnerContent />
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background"
          >
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-background to-transparent">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-sans font-semibold">
                  <RotateCw className="w-4 h-4" />
                  360° View
                </div>
                <h3 className="font-serif text-lg text-foreground">{productName}</h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className={cn(
                    "p-3 rounded-full transition-all",
                    isAutoPlaying 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-foreground hover:bg-muted/80"
                  )}
                >
                  {isAutoPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="p-3 rounded-full bg-muted text-foreground hover:bg-muted/80 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Full Spinner */}
            <SpinnerContent fullscreen />

            {/* Frame Counter */}
            <div className="absolute bottom-6 right-6 px-3 py-1.5 rounded-full bg-card/90 backdrop-blur-sm text-sm text-muted-foreground font-sans">
              Frame {currentFrame + 1} of {totalFrames}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
