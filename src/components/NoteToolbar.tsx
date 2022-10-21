import IconButton from "./IconButton";
import classNames from "../lib/classNames";
import {
  ClipboardDocumentCheckIcon,
  ClipboardDocumentIcon,
  FolderIcon,
  InformationCircleIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { NavigateFunction } from "react-router-dom";
import { deleteNote, renameNote } from "../lib/notes";
import { dialog, path, shell } from "@tauri-apps/api";
import { useState } from "react";

interface NoteToolbarProps {
  onSaveNote: () => Promise<void>;
  onCopyNote: () => Promise<void>;
  onToggleMetadata: () => void;
  navigate: NavigateFunction;
  refetchNotes: () => void;
  isNoteLoading: boolean;
  isUpdated: boolean;
  noteName: string;
}

export default function NoteToolbar({
  noteName,
  navigate,
  isUpdated,
  onSaveNote,
  onCopyNote,
  refetchNotes,
  isNoteLoading,
  onToggleMetadata,
}: NoteToolbarProps) {
  // Local state
  const [isValueCopied, setIsValueCopied] = useState<boolean>(false);

  // Handlers
  async function handleRenameNote(newName: string) {
    if (newName === noteName) return;

    const parsedNewName = newName + ".md";

    await onSaveNote();

    await renameNote(noteName, parsedNewName);

    navigate(`/notes/${parsedNewName}`);

    refetchNotes();
  }

  async function handleDeleteNote() {
    const shouldDeleteNote = await dialog.ask(
      "Are you sure you want to delete this document?",
      {
        title: "Delete document",
        type: "warning",
      }
    );

    if (!shouldDeleteNote) return;

    await deleteNote(noteName);

    navigate("/");

    refetchNotes();
  }

  async function handleCopyNote() {
    await onCopyNote();

    setIsValueCopied(true);

    setTimeout(() => {
      setIsValueCopied(false);
    }, 5000);
  }

  async function handleShowNoteInFinder() {
    const homeDir = await path.homeDir();
    console.log(`${homeDir}notes`)
    return shell.open(`${homeDir}notes`);
  }

  return (
    <div className="px-2 h-12 border-b border-stone-200 dark:border-stone-700 flex items-center dark:bg-stone-700/10">
      <div className="flex justify-betwen w-full">
        <div className="flex items-center gap-1">
          <h2
            contentEditable
            dangerouslySetInnerHTML={{
              __html: noteName?.split(".md")[0] ?? "",
            }}
            className="text-stone-500 dark:text-stone-400 focus:outline-none pl-1.5 pr-2 py-2 hover:text-black dark:hover:text-white focus:text-black dark:focus:text-white hover:bg-stone-100 dark:hover:bg-stone-900/50 border border-transparent focus:border-indigo-400 dark:focus:border-indigo-500 rounded -my-1 transition leading-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();

                e.currentTarget.blur();
              }
            }}
            onBlur={(e) => {
              handleRenameNote(e.currentTarget.innerText);
            }}
          />

          <div
            aria-label="Note changed"
            className={classNames(
              "h-1.5 w-1.5 bg-indigo-500 dark:bg-indigo-300 rounded-full transition transform origin-center",
              isUpdated && !isNoteLoading ? "scale-100" : "scale-0"
            )}
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <IconButton
          icon={FolderIcon}
          title="Show document in finder"
          onClick={handleShowNoteInFinder}
        />

        <IconButton
          icon={
            isValueCopied ? ClipboardDocumentCheckIcon : ClipboardDocumentIcon
          }
          title="Copy raw file contents"
          onClick={handleCopyNote}
        />

        <IconButton
          title="Toggle document information"
          icon={InformationCircleIcon}
          onClick={onToggleMetadata}
        />

        <IconButton
          onClick={handleDeleteNote}
          title="Delete document"
          icon={TrashIcon}
          variant="danger"
        />
      </div>
    </div>
  );
}
