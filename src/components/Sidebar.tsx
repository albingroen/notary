import classNames from "../lib/classNames";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  PencilSquareIcon,
} from "@heroicons/react/20/solid";
import { appWindow } from "@tauri-apps/api/window";
import { getNotes } from "../lib/notes";
import { useQuery, useQueryClient } from "react-query";
import { useCallback, useEffect, useState } from "react";
import { fs } from "@tauri-apps/api";
import { register, unregisterAll } from "@tauri-apps/api/globalShortcut";
import SearchNotes from "./SearchNotes";

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

  // Local state
  const [search, setSearch] = useState<string>("");

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
    <aside className="bg-stone-100 dark:bg-stone-700/10 w-[250px] flex flex-col border-stone-200 dark:border-stone-700">
      <div className="p-5 border-r border-stone-200 dark:border-stone-700">
        <h5 className="text-sm font-medium text-stone-400 dark:text-stone-500">
          Documents
        </h5>

        <div className="relative">
          <MagnifyingGlassIcon className="w-3.5 absolute left-2 top-1/2 transform -translate-y-[1.5px] text-stone-500" />

          <input
            className="py-1.5 pr-2 pl-[27px] w-full border border-transparent rounded-md bg-stone-200 dark:bg-stone-700/30 dark:border dark:border-stone-700 mt-3 text-sm placeholder-stone-500 focus:outline-none hover:bg-stone-200 dark:hover:bg-stone-800 focus:bg-stone-200 dark:focus:bg-stone-800 focus:border-stone-500 dark:focus:border-stone-600 transition"
            onChange={(e) => {
              setSearch(e.currentTarget.value);
            }}
            placeholder="Search"
            value={search}
          />
        </div>
      </div>

      {search && notes ? (
        <SearchNotes search={search} notes={notes} />
      ) : (
        <ul className="flex flex-col px-5 pb-5 flex-1 overflow-y-auto border-r border-stone-200 dark:border-stone-700">
          {notes
            ?.sort((a, b) => {
              if (a.metadata?.createdAt > b.metadata?.createdAt) {
                return -1;
              } else if (b.metadata?.createdAt > a.metadata?.createdAt) {
                return 1;
              }
              return 0;
            })
            .map((note) => {
              const isActive = note.name === noteName;

              return (
                <li key={note.name}>
                  <Link
                    to={`notes/${note.name}`}
                    className={classNames(
                      "flex py-[5px] transition",
                      isActive
                        ? "text-black dark:text-white"
                        : "text-stone-500 hover:text-black dark:hover:text-white"
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
      )}

      <div className="p-5 w-full border-r border-stone-200 dark:border-stone-700">
        <button
          onClick={handleCreateNote}
          className="flex justify-between items-center p-2.5 bg-stone-700 dark:bg-stone-600 text-white hover:bg-stone-600 dark:hover:bg-stone-500 font-medium rounded-lg w-full transition text-sm"
        >
          <span />
          <span>New document</span>
          <PencilSquareIcon className="w-3.5" />
        </button>
      </div>
    </aside>
  );
}
