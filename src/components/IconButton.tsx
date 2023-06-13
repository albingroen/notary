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
        "rounded-md py-2 px-3.5 transition group cursor-default",
        {
          default:
            "bg-gray-50 dark:bg-gray-200/10 hover:bg-gray-100 dark:hover:bg-gray-500/50",
          danger:
            "bg-red-100 dark:bg-red-200/10 hover:bg-red-200 dark:hover:bg-red-500/50",
        }[variant],
        className
      )}
    >
      <Icon
        strokeWidth={2}
        className={classNames(
          "w-[18px] transition",
          {
            default:
              "text-gray-500 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-white",
            danger:
              "text-red-500 dark:text-red-500 group-hover:text-red-700 dark:group-hover:text-white",
          }[variant]
        )}
      />
    </button>
  );
}
