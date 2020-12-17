import React, { useEffect, useRef, useState } from "react";

const ScrollableWheelInput = ({
  value,
  onChange,
  minValue,
  maxValue,
}: {
  value: number;
  onChange: (value: number) => void;
  minValue?: number;
  maxValue?: number;
}) => {
  maxValue = maxValue === undefined ? 1 : maxValue;
  minValue = minValue === undefined ? 0 : minValue;

  const [isMouseEntered, setIsMouseEntered] = useState(false);

  const wheelRef = useRef<HTMLDivElement | null>(null);

  const diff = maxValue - minValue;

  const relativeValue = (value - minValue) / diff;

  const size = 20;
  const radius = size / 2;
  const pointAngleInRadians = relativeValue * (2 * Math.PI);

  const x = Math.cos(pointAngleInRadians) * radius * 0.7;
  const y = Math.sin(pointAngleInRadians) * radius * 0.7;

  useEffect(() => {
    const setTrue = () => setIsMouseEntered(true);
    const setFalse = () => setIsMouseEntered(false);

    wheelRef.current?.addEventListener("mouseenter", setTrue);
    wheelRef.current?.addEventListener("mouseleave", setFalse);

    return () => {
      wheelRef.current?.removeEventListener("mouseenter", setTrue);
      wheelRef.current?.removeEventListener("mouseleave", setFalse);
    };
  }, []);

  const scroll = (e: any) => {
    e.preventDefault();

    const delta = e.wheelDelta;

    const maxNumber = maxValue as number;
    const totalValue = value + delta * diff * 0.001;
    const newValue = totalValue % maxNumber;

    onChange(newValue);
  };

  useEffect(() => {
    if (isMouseEntered) {
      document.body.addEventListener("wheel", scroll, { passive: false });

      return () => {
        document.body.removeEventListener("wheel", scroll);
      };
    }
  }, [isMouseEntered, value]);

  return (
    <div
      ref={wheelRef}
      style={{
        overflow: "hidden",
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: "black",
        position: "relative",
      }}
    >
      <div
        style={{
          width: 3,
          height: 3,
          borderRadius: 1.5,
          backgroundColor: "white",
          position: "absolute",
          top: y + radius - 1.5,
          left: x + radius - 1.5,
        }}
      />
    </div>
  );
};
export default ScrollableWheelInput;
