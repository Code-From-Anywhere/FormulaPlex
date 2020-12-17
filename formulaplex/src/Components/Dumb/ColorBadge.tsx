const ColorBadge = ({ color }: { color: string }) => (
  <div
    style={{
      backgroundColor: color,
      width: 15,
      height: 30,
      borderRadius: 3,
      marginRight: 10,
    }}
  />
);

export default ColorBadge;
