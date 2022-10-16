import { clipboard, path } from "@tauri-apps/api";
import { useQuery, useQueryClient } from "react-query";
import { metadata } from "tauri-plugin-fs-extra-api";
import classNames from "../lib/classNames";
import { formatBytes } from "../lib/utils";
import { Note } from "../types";

interface NoteMetadataProps {
  noteName: string;
}

async function getNoteMetadata(noteName: string) {
  const homeDir = await path.homeDir();

  const notePath = `${homeDir}notes/${noteName}`;

  const md = await metadata(notePath);

  return {
    ...md,
    path: notePath,
  };
}

export default function NoteMetadata({ noteName }: NoteMetadataProps) {
  // Server state
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery(
    [noteName, "metadata"],
    () => getNoteMetadata(noteName),
    {
      initialData: () => {
        const notes = queryClient.getQueryData<Note[]>(["notes"]);

        const globalNote = notes?.find((note) => note.name === noteName);

        return globalNote
          ? {
              ...globalNote.metadata,
              path: "",
            }
          : {};
      },
    }
  );

  return (
    <aside className="w-[400px] bg-white border-l border-stone-200 p-3.5">
      {data ? (
        <ul className="flex flex-col rounded-md overflow-hidden border border-stone-200">
          <MetadataItem
            value={data.createdAt ? data.createdAt.toString() : "Unknown"}
            label="Created"
          />

          <MetadataItem
            value={data.modifiedAt ? data.modifiedAt.toString() : "Unknown"}
            label="Modified"
            isEven
          />

          <MetadataItem
            value={data.path ? data.path.replaceAll(" ", "\\ ") : "Unknown"}
            label="Path"
          />

          <MetadataItem
            value={data.blksize ? formatBytes(data.blksize) : "Uknown"}
            label="File size"
            isEven
          />
        </ul>
      ) : isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Oh no! Something went wrong. Please try again later...</p>
      ) : null}
    </aside>
  );
}

function MetadataItem({
  isEven,
  label,
  value,
}: {
  label: string;
  value: string;
  isEven?: boolean;
}) {
  return (
    <li
      className={classNames(
        "px-4 flex items-center justify-between gap-8 text-sm",
        isEven ? "bg-white" : "bg-stone-100"
      )}
    >
      <h5 className="text-stone-500 w-20">{label}</h5>{" "}
      <button
        type="button"
        title="Copy to clipboard"
        className="flex-1 text-right truncate cursor-copy hover:text-indigo-600 transition py-3.5 active:text-indigo-900 focus:text-indigo-900 focus:outline-none"
        onClick={() => {
          clipboard.writeText(value);
        }}
      >
        {value}
      </button>
    </li>
  );
}
