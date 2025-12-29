
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { bannerService } from '../services/bannerService';
import { Banner as BannerType } from '../types';

interface BannerProps {
  onExploreClick: () => void;
}

const Banner: React.FC<BannerProps> = ({ onExploreClick }) => {
  const [bannerItems, setBannerItems] = useState<BannerType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef(0);

  useEffect(() => {
    setBannerItems(bannerService.getBanners());
  }, []);

  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const goToNext = useCallback(() => {
    if (bannerItems.length === 0) return;
    setCurrentIndex(prevIndex => prevIndex === bannerItems.length - 1 ? 0 : prevIndex + 1);
  }, [bannerItems.length]);

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(goToNext, 5000);
    return () => resetTimeout();
  }, [currentIndex, goToNext, resetTimeout]);

  const goToPrev = () => {
    if (bannerItems.length === 0) return;
    setCurrentIndex(prevIndex => prevIndex === 0 ? bannerItems.length - 1 : prevIndex - 1);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };
  
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchDiff = touchStartX.current - touchEndX;

    if (touchDiff > 50) {
      goToNext();
    } else if (touchDiff < -50) {
      goToPrev();
    }
  };

  if (bannerItems.length === 0) {
    return null; // Don't render banner if there's no data
  }

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div 
        className="relative aspect-[2/1] md:aspect-[3/1] rounded-3xl overflow-hidden group shadow-lg shadow-slate-200/50 bg-slate-100"
        onMouseEnter={resetTimeout}
        onMouseLeave={() => { timeoutRef.current = setTimeout(goToNext, 5000); }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-roledescription="carousel"
      >
        <div 
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {bannerItems.map((item, index) => (
            <div 
              key={item.id} 
              className="relative w-full h-full flex-shrink-0"
              onClick={onExploreClick}
              role="group"
              aria-label={`Slide ${index + 1} of ${bannerItems.length}`}
            >
              <img 
                src={item.imgUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white">
                <h2 className="text-xl sm:text-2xl md:text-4xl font-black tracking-tighter max-w-lg">
                  {item.title}
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-slate-200 max-w-md mt-1">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button onClick={goToPrev} className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 w-10 h-10 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Previous">‹</button>
        <button onClick={goToNext} className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 w-10 h-10 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Next">›</button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex space-x-2">
          {bannerItems.map((_, slideIndex) => (
            <button 
              key={slideIndex}
              onClick={() => goToSlide(slideIndex)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${currentIndex === slideIndex ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/70'}`}
              aria-label={`Go to slide ${slideIndex + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Banner;
