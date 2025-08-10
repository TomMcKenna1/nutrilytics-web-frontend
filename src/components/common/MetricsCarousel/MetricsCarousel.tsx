import React, { useState } from "react";
import styles from "./MetricsCarousel.module.css";

const MetricsCarousel = ({ children }: { children: React.ReactNode }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [drag, setDrag] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [touchStart, setTouchStart] = useState(0);

  const childrenArray = React.Children.toArray(children);
  const minSwipeDistance = 50;

  const goToPrev = () => {
    setActiveIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  };

  const goToNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex < childrenArray.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentTouchX = e.targetTouches[0].clientX;
    setDrag(currentTouchX - touchStart);
  };

  const onTouchEnd = () => {
    setIsDragging(false);

    if (Math.abs(drag) > minSwipeDistance) {
      if (drag < 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }

    setDrag(0);
  };

  return (
    <div className={styles.carouselContainer}>
      <div
        className={styles.carouselInner}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          transform: `translateX(calc(-${activeIndex * 100}% + ${drag}px))`,
          transition: isDragging ? "none" : "transform 0.3s ease-in-out",
        }}
      >
        {childrenArray.map((child, index) => (
          <div className={styles.carouselItem} key={index}>
            {child}
          </div>
        ))}
      </div>
      <div className={styles.dotsContainer}>
        {childrenArray.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${
              activeIndex === index ? styles.active : ""
            }`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default MetricsCarousel;
