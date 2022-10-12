import CodeMirror from "@uiw/react-codemirror";
import Markdown from "react-markdown";
import classNames from "./lib/classNames";
import { EyeIcon } from "@heroicons/react/20/solid";
import { Vim, vim } from "@replit/codemirror-vim";
import { fs } from "@tauri-apps/api";
import { githubLight } from "@uiw/codemirror-theme-github";
import { markdown } from "@codemirror/lang-markdown";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";

function getNote(name: string) {
  return fs.readTextFile(`notes/${name}`, {
    dir: fs.BaseDirectory.Home,
  });
}

export default function Note() {
  // Router state
  const { path } = useParams<{ path: string }>();

  // Server state
  const { data: noteContent, refetch: refetchNoteContent } = useQuery(
    ["notes", path],
    () => getNote(path!),
    {
      enabled: Boolean(path),
    }
  );

  // Local state
  const [value, setValue] = useState<string>("");

  const isUpdated = value !== noteContent;

  // Handler
  async function handleSaveNote() {
    await fs.writeFile(`notes/${path}`, value, {
      dir: fs.BaseDirectory.Home,
    });

    refetchNoteContent();
  }

  // Side-effects
  useEffect(() => {
    if (noteContent) {
      setValue(noteContent);
    }
  }, [noteContent]);

  useEffect(() => {
    Vim.defineEx("write", "w", () => {
      handleSaveNote();
    });
  }, [value]);

  return (
    <>
      <div className="p-4 border-b flex items-center gap-2.5">
        <p>{path?.split(".md")[0]}</p>

        <div
          aria-label="Note changed"
          className={classNames(
            "h-2 w-2 bg-blue-500 rounded-full transition",
            isUpdated ? "opacity-100" : "opacity-0"
          )}
        />
      </div>

      <div className="h-full" style={{ height: "calc(100% - 55px)" }}>
        <CodeMirror
          autoFocus
          key={path}
          value={value}
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
          className="text-lg h-full pl-5"
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
        <button className="absolute bottom-5 right-5 shadow-lg shadow-gray-200/80 bg-white border origin-bottom-right hover:transform hover:scale-110 transition h-64 w-56 rounded-lg overflow-hidden group">
          <div className="h-full w-full relative">
            <div className="p-4 !pr-0">
              <Markdown className="w-full text-left prose prose-sm prose-blue transform scale-[65%] origin-top-left overflow-y-auto">
                {value}
              </Markdown>
            </div>

            <div className="absolute inset-0 bg-gray-700/60 backdrop-blur-sm flex flex-col gap-2 items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <EyeIcon className="w-5 text-white" />
              <p className="font-medium text-lg text-white">Preview</p>
            </div>
          </div>
        </button>
      )}
    </>
  );
}
