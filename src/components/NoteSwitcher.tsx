import classNames from "../lib/classNames";
import { FileEntry } from "@tauri-apps/api/fs";
import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { useNavigate, useParams } from "react-router-dom";

interface NoteSwitcherProps {
  notes: FileEntry[];
}

export default function NoteSwitcher({ notes }: NoteSwitcherProps) {
  // Router state
  const navigate = useNavigate();
  const { path } = useParams<{ path: string }>();

  // Local state
  const [browsingNote, setBrowsingNote] = useState<string>();

  // Utils
  function scrollToNote(name: string, behavior: ScrollBehavior = "smooth") {
    const element = document.getElementById(`browse-${name}`);

    if (element) {
      element.scrollIntoView({
        inline: "center",
        behavior,
      });
    }
  }

  // Side-effects
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.shiftKey && e.key === "Tab") {
        setBrowsingNote((currentBrowsingNote) => {
          let newBrowsingNote: string | undefined;

          if (currentBrowsingNote || path) {
            const index = notes.findIndex(
              (n) => n.name === (currentBrowsingNote || path)
            );
            newBrowsingNote =
              notes[!index ? notes.length - 1 : index - 1]?.name;
          } else {
            newBrowsingNote = path;
          }

          return newBrowsingNote;
        });
      } else if (e.ctrlKey && e.key === "Tab") {
        setBrowsingNote((currentBrowsingNote) => {
          let newBrowsingNote: string | undefined;

          if (!path && !currentBrowsingNote) {
            newBrowsingNote = notes[0]?.name;
          } else {
            const index = notes.findIndex(
              (n) => n.name === (currentBrowsingNote || path)
            );
            newBrowsingNote =
              notes[index === notes.length - 1 ? 0 : index + 1]?.name;
          }

          return newBrowsingNote;
        });
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [notes, path]);

  useEffect(() => {
    function handleKeyUp(e: KeyboardEvent) {
      if (e.key === "Control") {
        setBrowsingNote(undefined);
        navigate(`notes/${browsingNote}`);
      }
    }

    if (browsingNote) {
      window.addEventListener("keyup", handleKeyUp);
      scrollToNote(browsingNote);
    }

    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [browsingNote]);

  return (
    <Dialog
      as="div"
      open
      className={classNames(
        "relative z-10",
        browsingNote ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClose={() => {}}
    >
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Dialog.Panel
            className={classNames(
              "max-w-2xl border rounded-lg bg-white/80 backdrop-blur shadow-lg shadow-stone-200 p-3 !pb-0"
            )}
          >
            <ul className="flex w-full overflow-x-auto pb-3" id="browse-notes">
              {notes.map((note) => {
                const isBrowsing = note.name === browsingNote;

                return (
                  <li
                    id={`browse-${note.name}`}
                    className={classNames(
                      "min-w-[192px] max-w-[192px] w-[192px] flex flex-col gap-2.5 p-2.5 transition rounded-lg",
                      isBrowsing && "bg-stone-100"
                    )}
                  >
                    <div className="h-28 w-full border rounded-md bg-white"></div>
                    <h5 className="w-full text-sm truncate text-center font-medium">
                      {note.name?.split(".md")[0]}
                    </h5>
                  </li>
                );
              })}
            </ul>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
