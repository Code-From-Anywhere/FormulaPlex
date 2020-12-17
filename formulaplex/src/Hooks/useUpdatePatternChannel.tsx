import { produce } from "immer";
import { useDispatch, useSelector } from "react-redux";
import { actionSetPatterns } from "../Context/Actions";
import { selectPatterns, selectSelectedPatternId } from "../Context/Selectors";
import { Channel } from "../Types/Types";

const useUpdatePatternChannel = () => {
  const dispatch = useDispatch();
  const patterns = useSelector(selectPatterns);

  const selectedPatternId = useSelector(selectSelectedPatternId);
  const setChannel = (
    channelIndex: number,
    key: keyof Channel,
    value: Channel[keyof Channel]
  ) => {
    if (patterns && selectedPatternId && channelIndex !== undefined) {
      dispatch(
        actionSetPatterns(
          produce(patterns, (draft) => {
            const pattern = draft.find(
              (pattern) => pattern.id === selectedPatternId
            );
            if (pattern) {
              pattern.channels[channelIndex][key] = value as never;
            }
          })
        )
      );
    }
  };

  return setChannel;
};

export default useUpdatePatternChannel;
