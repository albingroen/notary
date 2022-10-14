import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Command } from "cmdk";
import { Fragment, useEffect, useState } from "react";
import { Transition } from "@headlessui/react";
import { getNotes } from "../lib/notes";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";

export default function CommandPalette() {
  // Router state
  const navigate = useNavigate();

  // Server state
  const { data: notes } = useQuery(["notes"], getNotes);

  // Local state
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Side-effects
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.metaKey && e.key === "p") {
        e.preventDefault();
        e.stopPropagation();

        setIsOpen(($) => !$);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <Transition
      show={isOpen}
      as={Fragment}
      enter="ease-out duration-100"
      enterFrom="opacity-0 scale-95"
      enterTo="opacity-100 scale-100"
      leave="ease-in duration-100"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-95"
    >
      <Command.Dialog
        open={isOpen}
        onOpenChange={setIsOpen}
        className="fixed top-1/2 left-1/2 w-full transform -translate-y-1/2 -translate-x-1/2 max-w-lg border rounded-lg bg-black shadow-2xl shadow-stone-300 overflow-hidden h-[350px] flex flex-col"
      >
        <Command.Input
          placeholder="Open a document"
          className="text-lg p-3.5 w-full focus:outline-none bg-transparent placeholder-stone-600 text-white"
        />

        <Command.List className="flex-1 overflow-y-auto px-2.5 pb-2.5 overscroll-contain scroll-py-2.5">
          <Command.Group>
            {notes?.map((note) => (
              <Command.Item
                className="py-2 px-2.5 rounded flex items-center justify-between cursor-pointer"
                onSelect={() => {
                  navigate(`/notes/${note.name}`);
                  setIsOpen(false);
                }}
                key={note.name}
              >
                <span className="text-white opacity-50">
                  {note.name?.split(".md")[0]}
                </span>

                <ArrowRightIcon className="w-4 text-white note-arrow opacity-0" />
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>
      </Command.Dialog>
    </Transition>
  );
}
