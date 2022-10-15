import { Dialog, Transition } from "@headlessui/react";
import { useState, useEffect, Fragment } from "react";
import ReactMarkdown from "react-markdown";

interface NotePreviewProps {
  onClose: () => void;
  noteContent: string;
}

export default function NotePreview({
  noteContent,
  onClose,
}: NotePreviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        className="fixed z-10 inset-0 overflow-y-auto antialiased h-screen p-8"
        onClose={handleClose}
        as="div"
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed rounded-xl inset-0 bg-stone-500/40" />
        </Transition.Child>

        <Transition.Child
          leaveFrom="opacity-100 scale-100"
          enterTo="opacity-100 scale-100"
          enterFrom="opacity-0 scale-90"
          enter="ease-out duration-200"
          leaveTo="opacity-0 scale-90"
          leave="ease-in duration-200"
          as={Fragment}
        >
          <Dialog.Panel className="bg-white rounded-lg w-full max-w-screen-md min-h-full p-8 pt-10 shadow-2xl shadow-stone-400/70 mx-auto">
            <article className="prose prose-stone prose-headings:font-medium">
              <ReactMarkdown>{noteContent}</ReactMarkdown>
            </article>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
