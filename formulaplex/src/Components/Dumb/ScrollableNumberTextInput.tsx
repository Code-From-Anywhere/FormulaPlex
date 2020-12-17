import React from "react";
import { makeIntOrZero } from "../../Util/Util";

const ScrollableNumberTextInput = ({
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
  return (
    <div>
      <input
        style={{ width: 30 }}
        type="text"
        value={value}
        onChange={(e) => {
          onChange(makeIntOrZero(e.target.value));
        }}
      />
    </div>
  );
};

export default ScrollableNumberTextInput;
