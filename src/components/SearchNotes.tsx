import { fs } from "@tauri-apps/api";
import { FileEntry } from "@tauri-apps/api/fs";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import classNames from "../lib/classNames";
import { chunkString } from "../lib/utils";

interface SearchNotesProps {
  search: string;
  notes: FileEntry[];
}

function getFullNotes(notes: FileEntry[]) {
  return notes.map(async (note) => {
    const content = await fs.readTextFile(`notes/${note.name}`, {
      dir: fs.BaseDirectory.Home,
    });

    return {
      ...note,
      content,
    };
  });
}

export default function SearchNotes({ notes, search }: SearchNotesProps) {
  const [fullNotes, setFullNotes] = useState<
    Array<FileEntry & { content: string }>
  >([]);

  useEffect(() => {
    const $ = getFullNotes(notes);
    Promise.all($).then(setFullNotes);
  }, [notes]);

  const filteredNotes = fullNotes.filter(
    ({ content, name: noteName }) =>
      content.toLowerCase().includes(search.toLowerCase()) ||
      noteName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ul className="flex flex-col px-5 flex-1 overflow-y-auto gap-5 border-r border-stone-200 dark:border-stone-700">
      {filteredNotes.map((fullNote) => (
        <Link
          to={`notes/${fullNote.name}`}
          className="flex transition flex flex-col gap-2 group focus:outline-none"
        >
          <h5 className="w-full truncate">{fullNote.name?.split(".md")[0]}</h5>

          <div className="rounded-md bg-white dark:bg-stone-700/50 shadow shadow-stone-200 dark:shadow-stone-800 flex flex-col divide-y divide-stone-200">
            <div className="p-3 w-full">
              <p className="text-sm group-hover:text-black dark:group-hover:text-white group-focus:text-black dark:group-focus:text-white transition text-stone-500 dark:text-stone-400 leading-relaxed whitespace-pre-wrap break-all">
                {fullNote.content.substr(0, 200)}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </ul>
  );
}
