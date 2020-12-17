import React from "react";
import { useSelector } from "react-redux";
import { Rnd } from "react-rnd";
import { selectWindows } from "../Context/Selectors";
import useUpdateWindow from "../Hooks/useUpdateWindow";

const Content = ({
  routeName,
  params,
}: {
  routeName: string;
  params: object;
}) => {
  const content = () => {
    const defaultWindow = <div>DEFAULT WINDOW</div>;
    switch (routeName) {
      case "default": {
        return defaultWindow;
      }
    }

    return defaultWindow;
  };

  return content();
};

const Windows = () => {
  const windows = useSelector(selectWindows);
  const updateWindow = useUpdateWindow();

  return (
    <div>
      {windows.map(({ id, width, height, x, y, routeName, params }) => {
        return (
          <Rnd
            size={{ width, height }}
            position={{ x, y }}
            onDragStop={(e, d) => {
              updateWindow(id, { x: d.x, y: d.y });
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              updateWindow(id, {
                width: parseInt(ref.style.width),
                height: parseInt(ref.style.height),
                ...position,
              });
            }}
          >
            <Content routeName={routeName} params={params} />
          </Rnd>
        );
      })}
    </div>
  );
};

export default Windows;
