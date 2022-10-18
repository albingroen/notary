import CommandPalette from "../components/CommandPalette";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

function Start() {
  return (
    <>
      <div className="h-screen w-screen flex">
        <Sidebar />

        <main className="flex flex-col">
          <Outlet />
        </main>
      </div>

      <CommandPalette />
    </>
  );
}

export default Start;
