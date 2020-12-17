import { produce } from "immer";
import { useDispatch, useSelector } from "react-redux";
import { actionSetWindows } from "../Context/Actions";
import { selectWindows } from "../Context/Selectors";
import { ScreenWindow } from "../Types/Types";

const useUpdateWindow = () => {
  const dispatch = useDispatch();
  const windows = useSelector(selectWindows);
  const updateWindowDispatch = (
    windowId: string,
    value: Partial<ScreenWindow>
  ) => {
    dispatch(
      actionSetWindows(
        produce(windows, (draft) => {
          let window = draft.find((x) => x.id === windowId);
          if (window) {
            window = { ...window, ...value };
          }
        })
      )
    );
  };

  return updateWindowDispatch;
};

export default useUpdateWindow;
