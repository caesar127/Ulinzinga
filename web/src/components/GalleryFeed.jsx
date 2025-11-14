import React, { useState, useEffect, useRef } from "react";

const GalleryFeed = ({ images, columns = 4, gap = "1rem", rowHeight = 60 }) => {
  const [imageDimensions, setImageDimensions] = useState({});
  const [loadedImages, setLoadedImages] = useState({});
  const containerRef = useRef(null);

  // Calculate grid row spans based on actual naturalWidth/naturalHeight
  const getRowSpan = (width, height) => {
    const colWidth = containerRef.current
      ? (containerRef.current.offsetWidth - (columns - 1) * parseInt(gap)) /
        columns
      : 300;

    const scaledHeight = (height * colWidth) / width;
    return Math.ceil(scaledHeight / rowHeight);
  };

  useEffect(() => {
    setImageDimensions({});
    setLoadedImages({});

    images.forEach((src, index) => {
      const img = new Image();
      img.src = src.image;

      img.onload = () => {
        setImageDimensions((prev) => ({
          ...prev,
          [index]: { width: img.naturalWidth, height: img.naturalHeight },
        }));

        setLoadedImages((prev) => ({ ...prev, [index]: true }));
      };

      img.onerror = () => {
        console.error(`Failed to load image: ${src.image}`);
        setLoadedImages((prev) => ({ ...prev, [index]: true }));
      };
    });
  }, [images]);

  return (
    <div ref={containerRef} className="w-full py-8 my-12">
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridAutoRows: `${rowHeight}px`,
          gap: gap,
          gridAutoFlow: "dense",
        }}
      >
        {images.map((src, index) => {
          const dim = imageDimensions[index];
          const loaded = loadedImages[index];

          if (!loaded || !dim) {
            return (
              <div
                key={index}
                className="rounded-2xl bg-gray-200 animate-pulse"
                style={{ gridRow: "span 12" }}
              />
            );
          }

          const rowSpan = getRowSpan(dim.width, dim.height);

          return (
            <div
              key={index}
              className="rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition"
              style={{ gridRow: `span ${rowSpan}` }}
            >
              <img
                src={src.image}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GalleryFeed;
