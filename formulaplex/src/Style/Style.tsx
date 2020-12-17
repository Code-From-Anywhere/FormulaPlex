import React from "react";
const Style = {
  itemStyle: (selected: boolean): React.CSSProperties => ({
    display: "flex",
    flexDirection: "row",
    border: selected ? "1px dotted black" : undefined,
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "space-between",
  }),
};

export default Style;
