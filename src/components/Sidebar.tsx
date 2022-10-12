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
    <aside className="bg-gray-100 w-[280px] flex flex-col border-r">
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

      <ul className="flex flex-col mt-5 gap-2.5 px-5 flex-1 overflow-y-auto">
        {notes?.map((note) => {
          const isActive = note.name === noteName;

          return (
            <li key={note.name}>
              <Link
                to={`notes/${note.name}`}
                className={classNames(
                  "flex py-2.5 px-3 border rounded-lg",
                  isActive
                    ? "bg-gray-800 text-white"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-200"
                )}
              >
                <h5 className="text-sm">{note.name?.split(".md")[0]}</h5>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="p-5 w-full">
        <button
          onClick={handleCreateNote}
          className="flex justify-between items-center py-2 px-2.5 bg-gray-200 hover:bg-gray-300 rounded-md w-full mt-5 transition text-sm"
        >
          <span />
          <span>New note</span>
          <PencilSquareIcon className="w-3.5" />
        </button>
      </div>
    </aside>
  );
}
