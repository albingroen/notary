import classNames from "../lib/classNames";
import { DetailedHTMLProps, ButtonHTMLAttributes } from "react";
import { HeroIcon } from "../types";

interface IconButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  icon: HeroIcon;
  variant?: "default" | "danger";
}

export default function IconButton({
  variant = "default",
  icon: Icon,
  className,
  ...rest
}: IconButtonProps) {
  return (
    <button
      {...rest}
      className={classNames(
        "rounded py-2 px-3.5 transition group",
        {
          default:
            "bg-indigo-50 dark:bg-indigo-200/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/50",
          danger:
            "bg-red-100 dark:bg-red-200/10 hover:bg-red-200 dark:hover:bg-red-500/50",
        }[variant],
        className
      )}
    >
      <Icon
        className={classNames(
          "w-4 transition",
          {
            default:
              "text-indigo-500 dark:text-indigo-300 group-hover:text-indigo-700 dark:group-hover:text-white",
            danger:
              "text-red-500 dark:text-red-500 group-hover:text-red-700 dark:group-hover:text-white",
          }[variant]
        )}
      />
    </button>
  );
}
