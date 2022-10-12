import classNames from "../lib/classNames";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PencilSquareIcon } from "@heroicons/react/20/solid";
import { appWindow } from "@tauri-apps/api/window";
import { useQuery } from "react-query";
import { getNotes } from "../lib/notes";
import { fs } from "@tauri-apps/api";

export default function Sidebar() {
  // Server state
  const { data: notes, refetch: refetchNotes } = useQuery(["notes"], getNotes);

  // Router state
  const navigate = useNavigate();
  const { noteName } = useParams<{ noteName: string }>();

  // Handlers
  async function handleCreateNote() {
    const newName = "New note";

    const parsedNewName = newName + ".md";

    await fs.writeFile(`notes/${parsedNewName}`, "", {
      dir: fs.BaseDirectory.Home,
    });

    navigate(`/notes/${parsedNewName}`);

    refetchNotes();
  }

  return (
    <aside className="bg-stone-100 w-[250px] flex flex-col border-r">
      <div
        data-tauri-drag-region
        className="flex items-center gap-2 pt-5 px-5 w-full"
      >
        <button
          className="bg-[#FF5F57] h-3 w-3 rounded-full cursor-default"
          onClick={() => {
            appWindow.close();
          }}
          aria-label="Close window"
        />

        <button
          className="bg-[#FFBC2E] h-3 w-3 rounded-full cursor-default"
          onClick={() => {
            appWindow.minimize();
          }}
          aria-label="Minimize window"
        />

        <button
          className="bg-[#29CC42] h-3 w-3 rounded-full cursor-default"
          onClick={() => {
            appWindow.maximize();
          }}
          aria-label="Maximize window"
        />
      </div>

      <h5 className="text-sm font-medium text-stone-500 mt-5 px-5">
        Documents
      </h5>

      <ul className="flex flex-col mt-3 gap-[3px] px-5 flex-1 overflow-y-auto">
        {notes?.map((note) => {
          const isActive = note.name === noteName;

          return (
            <li key={note.name}>
              <Link
                to={`notes/${note.name}`}
                className={classNames(
                  "flex p-[11px] rounded-md -mx-[11px] transition",
                  isActive
                    ? "bg-white shadow-sm shadow-stone-300"
                    : "hover:bg-stone-200/70 active:bg-white active:shadow-sm active:shadow-stone-300"
                )}
              >
                <h5 className="text-sm w-full truncate leading-none">
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
          className="flex justify-between items-center py-2 px-2.5 bg-stone-200 hover:bg-stone-300 rounded-md w-full mt-5 transition text-sm"
        >
          <span />
          <span>New document</span>
          <PencilSquareIcon className="w-3.5" />
        </button>
      </div>
    </aside>
  );
}
