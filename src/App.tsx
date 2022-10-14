import CommandPalette from "./components/CommandPalette";
import Sidebar from "./components/Sidebar";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="h-screen w-screen flex overflow-hidden rounded-xl">
      <Sidebar />

      <CommandPalette />

      <main
        style={{ width: "calc(100% - 250px)" }}
        className="flex flex-col bg-white"
      >
        <Outlet />
      </main>
    </div>
  );
}

export default App;
