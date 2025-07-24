import React, { useRef, useEffect, useState } from "react";
import "./CustomScroll.css";

const Scrollbar = () => {
  const tableWrapperRef = useRef(null);
  const scrollbarRef = useRef(null);
  const thumbRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const table = tableWrapperRef.current;
    const thumb = thumbRef.current;
    const scrollbar = scrollbarRef.current;

    const updateThumb = () => {
      const scrollRatio = table.clientWidth / table.scrollWidth;
      const thumbWidth = scrollRatio * scrollbar.offsetWidth;
      const scrollLeftRatio = table.scrollLeft / table.scrollWidth;
      const thumbLeft = scrollLeftRatio * scrollbar.offsetWidth;

      thumb.style.width = `${thumbWidth}px`;
      thumb.style.left = `${thumbLeft}px`;
    };

    table.addEventListener("scroll", updateThumb);
    window.addEventListener("resize", updateThumb);
    updateThumb();

    return () => {
      table.removeEventListener("scroll", updateThumb);
      window.removeEventListener("resize", updateThumb);
    };
  }, []);

  const startDrag = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    const table = tableWrapperRef.current;
    const scrollbar = scrollbarRef.current;
    const thumb = thumbRef.current;

    const doDrag = (e) => {
      if (!isDragging) return;

      const scrollbarRect = scrollbar.getBoundingClientRect();
      const thumbWidth = thumb.offsetWidth;
      let newLeft = e.clientX - scrollbarRect.left - thumbWidth / 2;

      newLeft = Math.max(0, Math.min(newLeft, scrollbar.offsetWidth - thumbWidth));

      const scrollRatio = newLeft / (scrollbar.offsetWidth - thumbWidth);
      table.scrollLeft = scrollRatio * (table.scrollWidth - table.clientWidth);
    };

    const stopDrag = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener("mousemove", doDrag);
      document.addEventListener("mouseup", stopDrag);
    }

    return () => {
      document.removeEventListener("mousemove", doDrag);
      document.removeEventListener("mouseup", stopDrag);
    };
  }, [isDragging]);

  return (
    <div className="scroll-table-container">
      <div className="custom-scrollbar" ref={scrollbarRef} onMouseDown={startDrag}>
        <div className="custom-thumb" ref={thumbRef}></div>
      </div>

      <div className="table-wrapper" ref={tableWrapperRef}>
        <table className="wide-table">
          <thead>
            <tr>
              {Array.from({ length: 12 }).map((_, i) => (
                <th key={i}>Header {i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 10 }).map((_, r) => (
              <tr key={r}>
                {Array.from({ length: 12 }).map((_, c) => (
                  <td key={c}>R{r + 1}-C{c + 1}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Scrollbar;
