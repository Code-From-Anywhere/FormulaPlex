import { ContextMenu, ContextMenuTrigger, MenuItem } from "react-contextmenu";
import { useDispatch } from "react-redux";
import { actionOpenWindow } from "../Context/Actions";

const Toolbar = () => {
  const dispatch = useDispatch();
  const newWindow = (window: string) => dispatch(actionOpenWindow(window));

  const openWindow = (window: string) => {
    //add  to active windows;
    newWindow(window);
  };

  const openPatternEditor = () => openWindow("patternEditor");
  const openTracklist = () => openWindow("tracklist");
  const openInstrumentEditor = () => openWindow("instrumentEditor");
  const openMelodyEditor = () => openWindow("melodyEditor");

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
    </div>
  );
};
export default Toolbar;
