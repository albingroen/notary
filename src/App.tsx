import CommandPalette from "./components/CommandPalette";
import Sidebar from "./components/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { fs } from "@tauri-apps/api";
import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "react-query";

function App() {
  // Server state
  const queryClient = useQueryClient();

  // Router state
  const navigate = useNavigate();

  // Local state
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Handlers
  const handleCreateNote = useCallback(async () => {
    const newName = "New note";

    const parsedNewName = newName + ".md";

    await fs.writeFile(`notes/${parsedNewName}`, "", {
      dir: fs.BaseDirectory.Home,
    });

    navigate(`/notes/${parsedNewName}`);

    queryClient.invalidateQueries(["notes"]);
  }, []);

  // Side-effects
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.metaKey && e.key === "n") {
        e.preventDefault();
        e.stopPropagation();

        handleCreateNote();
      }

      if (e.key === "p" && e.metaKey) {
        e.preventDefault();
        e.stopPropagation();

        setIsCommandPaletteOpen((open) => !open);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="h-screen w-screen flex overflow-hidden rounded-xl">
      <Sidebar onCreateNote={handleCreateNote} />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onChangeIsOpen={setIsCommandPaletteOpen}
      />

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
