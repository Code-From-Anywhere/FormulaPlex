import { ContextMenu, ContextMenuTrigger, MenuItem } from "react-contextmenu";
import { useDispatch, useSelector } from "react-redux";
import { actionOpenWindow, actionSetProjects } from "../../Context/Actions";
import { selectProjects } from "../../Context/Selectors";
import { Project, WindowInitializer } from "../../Types/Types";
import { generateProject } from "../../Util/Util";

const Menus = () => {
  const dispatch = useDispatch();
  const openWindow = (window: WindowInitializer) =>
    dispatch(actionOpenWindow(window));

  const projects = useSelector(selectProjects);

  const openPatternEditor = () =>
    openWindow({ routeName: "patternEditor", title: "Pattern Editor" });
  const openTracklist = () =>
    openWindow({ routeName: "tracklist", title: "Track list" });
  const openInstrumentEditor = () =>
    openWindow({ routeName: "instrumentEditor", title: "Instrument Editor" });
  const openMelodyEditor = () =>
    openWindow({ routeName: "melodyEditor", title: "Melody Editor" });
  const openTimedMelodyEditor = () =>
    openWindow({
      routeName: "timedMelodyEditor",
      title: "Timed Melody Editor",
    });

  const openProjectSettings = () =>
    openWindow({
      routeName: "projectSettings",
      title: "Project Settings",
    });

  const openNewProject = () => {
    const newProject: Project = generateProject("New project");

    dispatch(actionSetProjects([...projects, newProject]));
  };

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <ContextMenuTrigger id="newMenu" mouseButton={0}>
        <div>New</div>
      </ContextMenuTrigger>

      <ContextMenu id="newMenu">
        <div style={{ backgroundColor: "white" }}>
          <MenuItem onClick={openNewProject}>New Project</MenuItem>
        </div>
      </ContextMenu>

      <ContextMenuTrigger id="viewMenu" mouseButton={0}>
        <div>View</div>
      </ContextMenuTrigger>

      <ContextMenu id="viewMenu">
        <div style={{ backgroundColor: "white" }}>
          <MenuItem onClick={openPatternEditor}>Pattern Editor</MenuItem>
          <MenuItem onClick={openTracklist}>TrackList</MenuItem>
          <MenuItem onClick={openInstrumentEditor}>Instrument Editor</MenuItem>
          <MenuItem onClick={openMelodyEditor}>Melody Editor</MenuItem>

          <MenuItem onClick={openTimedMelodyEditor}>
            Timed Melody Editor
          </MenuItem>
        </div>
      </ContextMenu>

      <ContextMenuTrigger id="settingsMenu" mouseButton={0}>
        <div>Settings</div>
      </ContextMenuTrigger>

      <ContextMenu id="settingsMenu">
        <div style={{ backgroundColor: "white" }}>
          <MenuItem onClick={openProjectSettings}>Project Settings</MenuItem>
        </div>
      </ContextMenu>
    </div>
  );
};

export default Menus;
