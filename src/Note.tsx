import CodeMirror from "@uiw/react-codemirror";
import Markdown from "react-markdown";
import { EyeIcon } from "@heroicons/react/20/solid";
import { fs } from "@tauri-apps/api";
import { githubLight } from "@uiw/codemirror-theme-github";
import { markdown } from "@codemirror/lang-markdown";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { vim } from "@replit/codemirror-vim";

export default function Note() {
  // Router state
  const { path } = useParams<{ path: string }>();

  // Local state
  const [value, setValue] = useState<string>("");

  // Side-effects
  useEffect(() => {
    if (path) {
      fs.readTextFile(`notes/${path}`, {
        dir: fs.BaseDirectory.Home,
      }).then(setValue);
    }
  }, [path]);

  return (
    <>
      <div className="p-4 border-b">
        <p>{path?.split(".md")[0]}</p>
      </div>

      <div className="h-full" style={{ height: "calc(100% - 55px)" }}>
        <CodeMirror
          autoFocus
          key={path}
          value={value}
          height="100%"
          extensions={[markdown(), vim()]}
          onChange={setValue}
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
