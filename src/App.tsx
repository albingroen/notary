import Sidebar from "./components/Sidebar";
import { Outlet } from "react-router-dom";
import { fs } from "@tauri-apps/api";
import { useQuery } from "react-query";

async function getNotes() {
  const files = await fs.readDir("notes", {
    dir: fs.BaseDirectory.Home,
  });

  return files.filter((file) => file.name?.endsWith(".md"));
}

function App() {
  // Server state
  const { data: notes } = useQuery(["notes"], getNotes);

  return (
    <div className="h-screen w-screen flex overflow-hidden rounded-xl">
      <Sidebar notes={notes ?? []} />

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
