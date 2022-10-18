import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import NoteMetadata from "../components/NoteMetadata";
import NotePreview from "../components/NotePreview";
import NotePreviewWindow from "../components/NotePreviewWindow";
import NoteToolbar from "../components/NoteToolbar";
import { TauriEvent } from "@tauri-apps/api/event";
import { appWindow } from "@tauri-apps/api/window";
import { clipboard, fs } from "@tauri-apps/api";
import { getNote } from "../lib/notes";
import { githubDark, githubLight } from "@uiw/codemirror-theme-github";
import { markdown } from "@codemirror/lang-markdown";
import { register } from "@tauri-apps/api/globalShortcut";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import { vim } from "@replit/codemirror-vim";

export default function Note() {
  // Router state
  const navigate = useNavigate();
  const { noteName } = useParams<{ noteName: string }>();

  // Server state
  const queryClient = useQueryClient();

  const { data: noteContent, isLoading: isNoteContentLoading } = useQuery(
    [noteName],
    () => getNote(noteName!),
    {
      enabled: Boolean(noteName),
    }
  );

  const { data: theme, refetch: refetchTheme } = useQuery(["theme"], () =>
    window.matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light"
  );

  // Local state
  const [isShowingMetadata, setIsShowingMetadata] = useState<boolean>(false);
  const [isPreviewing, setIsPreviewing] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

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
  }, [noteContent]);

  useEffect(() => {
    function handleChangeTheme() {
      refetchTheme();
    }

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", handleChangeTheme);

    return () => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", handleChangeTheme);
    };
  }, []);

  useEffect(() => {
    handleRegisterCommands();

    appWindow.listen(TauriEvent.WINDOW_FOCUS, () => {
      handleRegisterCommands();
    });
  }, []);

  // Handler
  const handleRegisterCommands = useCallback(() => {
    register("Command+Y", () => {
      setIsPreviewing(($) => !$);
    });

    register("Command+I", () => {
      setIsShowingMetadata(($) => !$);
    });

    register("Command+W", () => {
      navigate("/");
    });
  }, []);

  async function handleSaveNote() {
    await fs.writeFile(`notes/${noteName}`, value, {
      dir: fs.BaseDirectory.Home,
    });

    queryClient.invalidateQueries([noteName]);
  }

  if (!noteName) {
    return null;
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

      <NoteToolbar
        isNoteLoading={isNoteContentLoading}
        isUpdated={value !== noteContent}
        onSaveNote={handleSaveNote}
        navigate={navigate}
        noteName={noteName}
        refetchNotes={() => {
          queryClient.invalidateQueries(["notes"]);
        }}
        onCopyNote={() => {
          return clipboard.writeText(value);
        }}
        onToggleMetadata={() => {
          setIsShowingMetadata(($) => !$);
        }}
      />

      <div className="h-full flex" style={{ height: "calc(100% - 50px)" }}>
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
            theme={theme === "light" ? githubLight : githubDark}
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
            <NotePreviewWindow
              isPreviewing={isPreviewing}
              value={value}
              onClick={() => {
                setIsPreviewing(true);
              }}
            />
          )}
        </div>

        {isShowingMetadata && noteName && <NoteMetadata noteName={noteName} />}
      </div>
    </>
  );
}
