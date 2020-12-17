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
          const windowIndex = draft.findIndex(
            (x: ScreenWindow) => x.id === windowId
          );
          if (windowIndex > -1) {
            draft[windowIndex] = { ...draft[windowIndex], ...value };
          }
        })
      )
    );
  };

  return updateWindowDispatch;
};

export default useUpdateWindow;
