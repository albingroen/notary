import { FileEntry } from "@tauri-apps/api/fs";
import { PencilSquareIcon } from "@heroicons/react/20/solid";
import { appWindow } from "@tauri-apps/api/window";
import { Link, useParams } from "react-router-dom";
import classNames from "../lib/classNames";

interface SidebarProps {
  notes: FileEntry[];
}

export default function Sidebar({ notes }: SidebarProps) {
  // Router state
  const { path } = useParams<{ path: string }>();

  return (
    <aside className="bg-gray-100 w-[280px] flex flex-col border-r">
      <div
        data-tauri-drag-region
        className="flex items-center gap-2 p-5 w-full"
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

      <div className="px-5 w-full">
        <h1 className="text-2xl font-medium">My notes</h1>

        <button className="flex justify-between items-center py-2 px-2.5 bg-gray-200 hover:bg-gray-300 rounded-md w-full mt-5 transition text-sm">
          <span />
          <span>New note</span>
          <PencilSquareIcon className="w-3.5" />
        </button>
      </div>

      <ul className="flex flex-col mt-5 gap-2.5 px-5 flex-1 overflow-y-auto">
        {notes.map((note) => {
          const isActive = note.name === path;

          return (
            <li key={note.path}>
              <Link
                to={`notes/${note.name}`}
                className={classNames(
                  "flex p-2.5 border hover:bg-gray-200 rounded-md",
                  isActive
                    ? "border-gray-400"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <h5 className="text-sm">{note.name?.split(".md")[0]}</h5>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
