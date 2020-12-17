import React from "react";
import { ImCross } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import { Rnd } from "react-rnd";
import { actionSetWindows } from "../Context/Actions";
import { selectWindows } from "../Context/Selectors";
import useUpdateWindow from "../Hooks/useUpdateWindow";
import { ScreenWindow } from "../Types/Types";
import InstrumentEditor from "../Windows/InstrumentEditor";
import MelodyEditor from "../Windows/MelodyEditor";
import PatternEditor from "../Windows/PatternEditor";
import TimedMelodyEditor from "../Windows/TimedMelodyEditor";
import Tracklist from "../Windows/Tracklist";
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
      case "patternEditor": {
        return <PatternEditor />;
      }

      case "tracklist": {
        return <Tracklist />;
      }

      case "melodyEditor": {
        return <MelodyEditor />;
      }

      case "instrumentEditor": {
        return <InstrumentEditor />;
      }

      case "timedMelodyEditor": {
        return <TimedMelodyEditor />;
      }
    }

    return defaultWindow;
  };

  return content();
};

const Windows = () => {
  const windows = useSelector(selectWindows);
  const updateWindow = useUpdateWindow();
  const dispatch = useDispatch();

  const setWindows = (windows: ScreenWindow[]) =>
    dispatch(actionSetWindows(windows));

  return (
    <div>
      {windows.map(({ title, id, width, height, x, y, routeName, params }) => {
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
            style={{
              border: "1px solid black",
              backgroundColor: "#404040",
              borderRadius: 5,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <div style={{ color: "white", fontWeight: "bold" }}>{title}</div>
              <ImCross
                style={{ cursor: "pointer" }}
                size={18}
                color="white"
                onClick={() => {
                  setWindows(windows.filter((x) => x.id !== id));
                }}
              />
            </div>

            <div
              style={{
                flex: 1,
                minHeight: "100%",
                cursor: "default",
              }}
            >
              <Content routeName={routeName} params={params} />
            </div>
          </Rnd>
        );
      })}
    </div>
  );
};

export default Windows;
