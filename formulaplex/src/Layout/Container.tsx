import Piano from "../Components/Smart/Piano";
import Sidebar from "./Sidebar";
import Menus from "./Toolbar/Menus";
import Monitor from "./Toolbar/Monitor";
import PeakMeter from "./Toolbar/PeakMeter";
import PlayActions from "./Toolbar/PlayActions";
import RecordButton from "./Toolbar/RecordButton";
import TimeIndicator from "./Toolbar/TimeIndicator";
import Windows from "./Windows";

function Container() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        flex: 1,
        height: "100vh",
        width: "100vw",
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ height: "5vh", display: "flex", flexDirection: "row" }}>
          <Menus />
          <PlayActions />
          <TimeIndicator />
          <Monitor />
          <PeakMeter />
          <RecordButton />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flex: 1,
            height: "75vh",
          }}
        >
          <div
            style={{
              width: 200,
              backgroundColor: "#DDD",
              height: "100%",
              overflowY: "scroll",
            }}
          >
            <Sidebar />
          </div>
          <div style={{ flex: 1 }}>
            <Windows />
          </div>
        </div>
      </div>

      <Piano />
    </div>
  );
}
export default Container;
