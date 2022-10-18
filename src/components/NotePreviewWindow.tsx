import ReactMarkdown from "react-markdown";
import classNames from "../lib/classNames";
import { EyeIcon } from "@heroicons/react/20/solid";

interface NotePreviewWindow {
  isPreviewing: boolean;
  onClick: () => void;
  value: string;
}

export default function NotePreviewWindow({
  isPreviewing,
  onClick,
  value,
}: NotePreviewWindow) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        "absolute bottom-4 right-4 shadow-lg shadow-stone-200/80 dark:shadow-stone-900/50 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 origin-bottom-right transform transition h-64 w-56 rounded-lg overflow-hidden group duration-300",
        isPreviewing
          ? "scale-50 opacity-0 -rotate-3"
          : "scale-100 opacity-100 rotate-0 hover:scale-110"
      )}
    >
      <div className="h-full w-full relative">
        <div className="p-4 !pr-0">
          <ReactMarkdown className="w-full text-left prose prose-stone dark:prose-invert prose-headings:font-medium prose-sm prose-a:no-underline prose-a:text-indigo-500 dark:prose-a:text-indigo-400 transform scale-[65%] origin-top-left overflow-y-auto">
            {value}
          </ReactMarkdown>
        </div>

        <div className="absolute inset-0 bg-stone-700/60 group-active:bg-stone-700/80 backdrop-blur-sm flex flex-col gap-1 items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <EyeIcon className="w-5 text-white" />
          <p className="font-medium text-lg text-white">Preview</p>
        </div>
      </div>
    </button>
  );
}
