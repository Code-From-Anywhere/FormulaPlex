import { useDispatch, useSelector } from "react-redux";
import {
  actionSetIsRecordingMelody,
  actionSetMelodies,
  actionSetRecordingMelody,
} from "../../Context/Actions";
import {
  selectIsRecordingMelody,
  selectMelodies,
  selectRecordingMelody,
} from "../../Context/Selectors";
import { Melody } from "../../Types/Types";
const RecordButton = () => {
  const dispatch = useDispatch();

  const recordingMelody = useSelector(selectRecordingMelody);
  const isRecordingMelody = useSelector(selectIsRecordingMelody);
  const melodies = useSelector(selectMelodies);

  const setRecordingMelody = (melody: Melody | null) =>
    dispatch(actionSetRecordingMelody(melody));

  const setMelodies = (melodies: Melody[]) =>
    dispatch(actionSetMelodies(melodies));

  const setIsRecordingMelody = (value: boolean) =>
    dispatch(actionSetIsRecordingMelody(value));

  return (
    <div>
      <button
        onClick={() => {
          setRecordingMelody(null);
          setIsRecordingMelody(!isRecordingMelody);
        }}
      >
        {isRecordingMelody ? "Stop recording" : "Start recording"}
      </button>
      {isRecordingMelody && (recordingMelody?.melody.length || 0) > 0 && (
        <button
          onClick={() => {
            setMelodies([...melodies, recordingMelody as Melody]);
            setRecordingMelody(null);
            setIsRecordingMelody(false);
          }}
        >
          Save Melody
        </button>
      )}
    </div>
  );
};

export default RecordButton;
