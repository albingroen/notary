import CommandPalette from "../components/CommandPalette";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

function Start() {
  return (
    <>
      <div className="h-screen w-screen flex">
        <Sidebar />

        <main style={{ width: "calc(100% - 250px)" }} className="flex flex-col">
          <Outlet />
        </main>
      </div>

      <CommandPalette />
    </>
  );
}

export default Start;
