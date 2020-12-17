import React from "react";
const OnOffButton = ({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (value: boolean) => void;
}) => {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: value ? "lime" : "red",
      }}
    />
  );
};

export default OnOffButton;
