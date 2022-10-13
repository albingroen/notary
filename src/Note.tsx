import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import IconButton from "./components/IconButton";
import Markdown from "react-markdown";
import classNames from "./lib/classNames";
import {
  ClipboardDocumentCheckIcon,
  ClipboardDocumentIcon,
  EyeIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { clipboard, dialog, fs } from "@tauri-apps/api";
import { githubLight } from "@uiw/codemirror-theme-github";
import { markdown } from "@codemirror/lang-markdown";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import { vim } from "@replit/codemirror-vim";

function getNote(noteName: string) {
  return fs.readTextFile(`notes/${noteName}`, {
    dir: fs.BaseDirectory.Home,
  });
}

export default function Note() {
  // Router state
  const navigate = useNavigate();
  const { noteName } = useParams<{ noteName: string }>();

  // Server state
  const queryClient = useQueryClient();

  const {
    data: noteContent,
    refetch: refetchNoteContent,
    isLoading: isNoteContentLoading,
  } = useQuery([noteName], () => getNote(noteName!), {
    enabled: Boolean(noteName),
  });

  // Local state
  const [isValueCopied, setIsValueCopied] = useState<boolean>(false);
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

    refetchNoteContent();
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

  return (
    <>
      <div className="p-3 border-b flex items-center gap-1">
        <div className="flex items-center justify-betwen w-full">
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
              isUpdated && !isNoteContentLoading ? "scale-100" : "scale-0"
            )}
          />
        </div>

        <div className="flex items-center gap-2">
          <IconButton
            icon={
              isValueCopied ? ClipboardDocumentCheckIcon : ClipboardDocumentIcon
            }
            title="Copy raw file contents"
            onClick={handleCopyNote}
          />

          <IconButton
            onClick={handleDeleteNote}
            title="Delete document"
            icon={TrashIcon}
            variant="danger"
          />
        </div>
      </div>

      <div className="h-full" style={{ height: "calc(100% - 55px)" }}>
        <CodeMirror
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
          className="text-lg h-full"
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
      </div>

      {value && (
        <button className="absolute bottom-5 right-5 shadow-lg shadow-stone-200/80 bg-white border origin-bottom-right hover:transform hover:scale-110 transition h-64 w-56 rounded-lg overflow-hidden group">
          <div className="h-full w-full relative">
            <div className="p-4 !pr-0">
              <Markdown className="w-full text-left prose prose-sm prose-indigo transform scale-[65%] origin-top-left overflow-y-auto">
                {value}
              </Markdown>
            </div>

            <div className="absolute inset-0 bg-stone-700/60 backdrop-blur-sm flex flex-col gap-2 items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <EyeIcon className="w-5 text-white" />
              <p className="font-medium text-lg text-white">Preview</p>
            </div>
          </div>
        </button>
      )}
    </>
  );
}
