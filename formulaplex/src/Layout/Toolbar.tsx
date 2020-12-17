import { ContextMenu, ContextMenuTrigger, MenuItem } from "react-contextmenu";
import { useDispatch, useSelector } from "react-redux";
import {
  actionOpenWindow,
  actionSetIsRecordingMelody,
  actionSetMelodies,
  actionSetRecordingMelody,
} from "../Context/Actions";
import {
  selectIsRecordingMelody,
  selectMelodies,
  selectRecordingMelody,
} from "../Context/Selectors";
import { Melody } from "../Types/Types";
const Toolbar = () => {
  const dispatch = useDispatch();
  const openWindow = (window: string) => dispatch(actionOpenWindow(window));

  const openPatternEditor = () => openWindow("patternEditor");
  const openTracklist = () => openWindow("tracklist");
  const openInstrumentEditor = () => openWindow("instrumentEditor");
  const openMelodyEditor = () => openWindow("melodyEditor");

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
      <ContextMenuTrigger id="viewMenu" mouseButton={0}>
        <div>View</div>
      </ContextMenuTrigger>

      <ContextMenu id="viewMenu">
        <MenuItem onClick={openPatternEditor}>Pattern Editor</MenuItem>
        <MenuItem onClick={openTracklist}>TrackList</MenuItem>
        <MenuItem onClick={openInstrumentEditor}>Instrument Editor</MenuItem>
        <MenuItem onClick={openMelodyEditor}>Melody Editor</MenuItem>
      </ContextMenu>

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
export default Toolbar;
