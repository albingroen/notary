import Sidebar from "./components/Sidebar";
import { Outlet } from "react-router-dom";
import CommandPalette from "./components/CommandPalette";

function App() {
  return (
    <div className="h-screen w-screen flex overflow-hidden rounded-xl">
      <Sidebar />

      <CommandPalette />

      <main
        style={{ width: "calc(100% - 280px)" }}
        className="flex flex-col bg-white"
      >
        <Outlet />
      </main>
    </div>
  );
}

export default App;
