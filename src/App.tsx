import CommandPalette from "./components/CommandPalette";
import Sidebar from "./components/Sidebar";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="h-screen w-screen flex overflow-hidden rounded-xl dark:border-t border-stone-600 bg-white dark:bg-stone-800">
      <Sidebar />

      <CommandPalette />

      <main style={{ width: "calc(100% - 250px)" }} className="flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
