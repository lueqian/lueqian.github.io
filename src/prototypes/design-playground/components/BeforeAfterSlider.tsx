import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, History } from 'lucide-react';

interface BeforeAfterSliderProps {
  Before: React.ComponentType;
  After: React.ComponentType;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ Before, After }) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // 0 to 100
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging.current) return;
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[500px] rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 select-none shadow-inner"
    >
      {/* Before Layer (Left/Background) */}
      <div className="absolute inset-0 w-full h-full">
        <Before />
        <div className="absolute top-4 left-4 bg-slate-900/85 backdrop-blur-md border border-slate-800 text-slate-300 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg">
          <History className="w-3.5 h-3.5" />
          Before (修改前)
        </div>
      </div>

      {/* After Layer (Right/Foreground with clip-path) */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-auto"
        style={{
          clipPath: `inset(0 0 0 ${sliderPosition}%)`
        }}
      >
        <After />
        <div className="absolute top-4 right-4 bg-primary-600/90 dark:bg-sky-500/90 backdrop-blur-md text-white border border-white/10 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg">
          <Sparkles className="w-3.5 h-3.5" />
          After (优化后)
        </div>
      </div>

      {/* Slider Line & Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white dark:bg-sky-400 cursor-ew-resize z-20 group"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-sky-500 border-2 border-slate-300 dark:border-sky-400 shadow-xl flex items-center justify-center cursor-ew-resize hover:scale-110 active:scale-95 transition-transform duration-100">
          <div className="flex gap-1">
            <span className="block w-1.5 h-3 border-l-2 border-slate-500 dark:border-white"></span>
            <span className="block w-1.5 h-3 border-r-2 border-slate-500 dark:border-white"></span>
          </div>
        </div>
      </div>
    </div>
  );
};
