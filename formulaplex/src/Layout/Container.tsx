import Piano from "../Components/Piano";
import Sidebar from "./Sidebar";
import Toolbar from "./Toolbar";
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
        <div style={{ height: "5vh" }}>
          <Toolbar />
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
