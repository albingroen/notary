import classNames from "../lib/classNames";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  PencilSquareIcon,
} from "@heroicons/react/20/solid";
import { appWindow } from "@tauri-apps/api/window";
import { getNotes } from "../lib/notes";
import { useQuery, useQueryClient } from "react-query";
import { useCallback, useEffect } from "react";
import { fs } from "@tauri-apps/api";
import { register, unregisterAll } from "@tauri-apps/api/globalShortcut";

function handleNotesFolder() {
  fs.readDir("notes", { dir: fs.BaseDirectory.Home }).catch(() => {
    fs.createDir("notes", { dir: fs.BaseDirectory.Home }).catch(() => {});
  });
}

export default function Sidebar() {
  // Router state
  const navigate = useNavigate();
  const { noteName } = useParams<{ noteName: string }>();

  // Server state
  const queryClient = useQueryClient();
  const { data: notes } = useQuery(["notes"], getNotes);

  // Handlers
  const handleCreateNote = useCallback(async () => {
    const newName = "New note";

    const parsedNewName = newName + ".md";

    await fs.writeTextFile(`notes/${parsedNewName}`, "", {
      dir: fs.BaseDirectory.Home,
    });

    queryClient.invalidateQueries(["notes"]);

    navigate(`/notes/${parsedNewName}`);
  }, []);

  // Side-effects
  useEffect(() => {
    handleNotesFolder();

    register("Command+N", () => {
      handleCreateNote();
    }).catch(() => {});

    return () => {
      unregisterAll();
    };
  }, []);

  return (
    <aside className="bg-stone-100 w-[250px] flex flex-col border-r">
      <div
        data-tauri-drag-region
        className="flex items-center gap-2 pt-5 px-5 w-full"
      >
        <button
          className="bg-[#FF5F57] h-3 w-3 rounded-full cursor-default"
          tabIndex={-1}
          onClick={() => {
            appWindow.close();
          }}
          aria-label="Close window"
        />

        <button
          className="bg-[#FFBC2E] h-3 w-3 rounded-full cursor-default"
          tabIndex={-1}
          onClick={() => {
            appWindow.minimize();
          }}
          aria-label="Minimize window"
        />

        <button
          className="bg-[#29CC42] h-3 w-3 rounded-full cursor-default"
          tabIndex={-1}
          onClick={() => {
            appWindow.maximize();
          }}
          aria-label="Maximize window"
        />
      </div>

      <div className="px-5 mt-5">
        <h5 className="text-sm font-medium text-stone-400">Documents</h5>

        <div className="relative">
          <MagnifyingGlassIcon className="w-3.5 absolute left-2 top-1/2 transform -translate-y-[1.5px] text-stone-500" />

          <input
            className="pb-1.5 pt-[5px] pr-2 pl-[27px] w-full border border-transparent rounded-md bg-stone-200 mt-3 text-sm placeholder-stone-500 focus:outline-none hover:bg-stone-200 focus:bg-stone-200 focus:border-stone-500 transition"
            placeholder="Search"
            type="search"
          />
        </div>
      </div>

      <ul className="flex flex-col mt-4 px-5 flex-1 overflow-y-auto">
        {notes?.map((note) => {
          const isActive = note.name === noteName;

          return (
            <li key={note.name}>
              <Link
                to={`notes/${note.name}`}
                className={classNames(
                  "flex py-[5px] transition",
                  isActive ? "text-black" : "text-stone-500 hover:text-black"
                )}
              >
                <h5 className="w-full truncate">
                  {note.name?.split(".md")[0]}
                </h5>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="p-5 w-full">
        <button
          onClick={handleCreateNote}
          className="flex justify-between items-center p-2.5 bg-stone-700 text-white hover:bg-stone-600 font-medium rounded-lg w-full transition text-sm"
        >
          <span />
          <span>New document</span>
          <PencilSquareIcon className="w-3.5" />
        </button>
      </div>
    </aside>
  );
}
