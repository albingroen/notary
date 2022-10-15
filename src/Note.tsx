import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import IconButton from "./components/IconButton";
import Markdown from "react-markdown";
import classNames from "./lib/classNames";
import {
  EyeIcon,
  TrashIcon,
  InformationCircleIcon,
} from "@heroicons/react/20/solid";
import {
  FolderIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/solid";
import { clipboard, dialog, fs, path, shell } from "@tauri-apps/api";
import { githubLight } from "@uiw/codemirror-theme-github";
import { markdown } from "@codemirror/lang-markdown";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import { vim } from "@replit/codemirror-vim";
import NotePreview from "./components/NotePreview";
import { metadata } from "tauri-plugin-fs-extra-api";
import { formatBytes } from "./lib/utils";

async function getNote(noteName: string) {
  const content = await fs.readTextFile(`notes/${noteName}`, {
    dir: fs.BaseDirectory.Home,
  });

  const homeDir = await path.homeDir();

  const notePath = `${homeDir}notes/${noteName}`;

  const md = await metadata(notePath);

  return {
    content,
    metadata: md,
    path: notePath,
  };
}

export default function Note() {
  // Router state
  const navigate = useNavigate();
  const { noteName } = useParams<{ noteName: string }>();

  // Server state
  const queryClient = useQueryClient();

  const {
    data: note,
    refetch: refetchNote,
    isLoading: isNoteLoading,
  } = useQuery([noteName], () => getNote(noteName!), {
    enabled: Boolean(noteName),
  });

  const noteContent = note?.content;

  // Local state
  const [isShowingMetadata, setIsShowingMetadata] = useState<boolean>(false);
  const [isValueCopied, setIsValueCopied] = useState<boolean>(false);
  const [isPreviewing, setIsPreviewing] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  const isUpdated = value !== noteContent;

  // Refs
  const editor = useRef<ReactCodeMirrorRef>(null);

  // Side-effects
  useEffect(() => {
    if (typeof noteContent === "string") {
      setValue(noteContent);
    }

    if (editor.current?.view && !editor.current.view.hasFocus) {
      editor.current.view.focus();
    }
  }, [noteContent, noteName]);

  // Handler
  async function handleSaveNote() {
    await fs.writeFile(`notes/${noteName}`, value, {
      dir: fs.BaseDirectory.Home,
    });

    refetchNote();
  }

  async function handleRenameNote(newName: string) {
    if (newName === noteName) return;

    const parsedNewName = newName + ".md";

    await handleSaveNote();

    await fs.renameFile(`notes/${noteName}`, `notes/${parsedNewName}`, {
      dir: fs.BaseDirectory.Home,
    });

    navigate(`/notes/${parsedNewName}`);

    queryClient.invalidateQueries(["notes"]);
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

    await fs.removeFile(`notes/${noteName}`, {
      dir: fs.BaseDirectory.Home,
    });

    navigate("/");

    queryClient.invalidateQueries(["notes"]);
  }

  async function handleCopyNote() {
    if (!value) return;

    await clipboard.writeText(value);

    setIsValueCopied(true);

    setTimeout(() => {
      setIsValueCopied(false);
    }, 5000);
  }

  async function handleShowNoteInFinder() {
    const homeDir = await path.homeDir();
    return shell.open(`${homeDir}/notes`);
  }

  return (
    <>
      {isPreviewing && value && (
        <NotePreview
          noteContent={value}
          onClose={() => {
            setIsPreviewing(false);
          }}
        />
      )}

      <div className="border-b border-stone-200 flex items-center">
        <div className="flex justify-betwen w-full">
          <div className="p-3 flex items-center gap-1">
            <h2
              contentEditable
              dangerouslySetInnerHTML={{
                __html: noteName?.split(".md")[0] ?? "",
              }}
              className="focus:outline-none pl-1.5 pr-2 py-2 hover:bg-stone-100 border border-transparent focus:border-indigo-400 rounded-md -my-1 transition leading-none"
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
                "h-1.5 w-1.5 bg-indigo-500 rounded-full transition transform origin-center",
                isUpdated && !isNoteLoading ? "scale-100" : "scale-0"
              )}
            />
          </div>

          <div data-tauri-drag-region className="flex-1" />
        </div>

        <div className="flex items-center gap-2 p-3">
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
            onClick={() => {
              setIsShowingMetadata(!isShowingMetadata);
            }}
            title={
              isShowingMetadata
                ? "Hide document information"
                : "Show document information"
            }
            icon={InformationCircleIcon}
          />

          <IconButton
            onClick={handleDeleteNote}
            title="Delete document"
            icon={TrashIcon}
            variant="danger"
          />
        </div>
      </div>

      <div className="h-full flex" style={{ height: "calc(100% - 55px)" }}>
        <div className="h-full w-full relative flex-1 overflow-hidden">
          <CodeMirror
            autoFocus
            value={value}
            ref={editor}
            onChange={setValue}
            onKeyDown={async (e) => {
              if (e.metaKey && e.key === "s") {
                e.preventDefault();
                e.stopPropagation();

                handleSaveNote();
              }
            }}
            height="100%"
            extensions={[vim(), markdown()]}
            className="text-lg h-full w-full"
            theme={githubLight}
            basicSetup={{
              highlightSelectionMatches: false,
              highlightSpecialChars: false,
              highlightActiveLine: false,
              bracketMatching: false,
              lineNumbers: false,
              foldGutter: false,
            }}
          />

          {value && (
            <button
              onClick={() => {
                setIsPreviewing(true);
              }}
              className={classNames(
                "absolute bottom-5 right-5 shadow-lg shadow-stone-200/80 bg-white border border-stone-200 origin-bottom-right transform transition h-64 w-56 rounded-lg overflow-hidden group duration-300",
                isPreviewing
                  ? "scale-50 opacity-0 -rotate-3"
                  : "scale-100 opacity-100 rotate-0 hover:scale-110"
              )}
            >
              <div className="h-full w-full relative">
                <div className="p-4 !pr-0">
                  <Markdown className="w-full text-left prose prose-headings:font-medium prose-sm prose-indigo transform scale-[65%] origin-top-left overflow-y-auto">
                    {value}
                  </Markdown>
                </div>

                <div className="absolute inset-0 bg-stone-700/60 group-active:bg-stone-700/80 backdrop-blur-sm flex flex-col gap-1 items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <EyeIcon className="w-5 text-white" />
                  <p className="font-medium text-lg text-white">Preview</p>
                </div>
              </div>
            </button>
          )}
        </div>

        {isShowingMetadata && note?.metadata && (
          <aside className="w-[400px] bg-white border-l border-stone-200 p-3.5">
            <ul className="flex flex-col rounded-md overflow-hidden border border-stone-200">
              <MetadataItem
                value={note.metadata.createdAt.toString()}
                label="Created"
              />

              <MetadataItem
                value={note.metadata.modifiedAt.toString()}
                label="Modified"
                isEven
              />

              <MetadataItem
                value={note.path.replaceAll(" ", "\\ ")}
                label="Path"
              />

              <MetadataItem
                value={
                  note.metadata.blksize
                    ? formatBytes(note.metadata.blksize)
                    : "Uknown"
                }
                label="File size"
                isEven
              />
            </ul>
          </aside>
        )}
      </div>
    </>
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
