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
        "rounded-md py-2 px-3.5 transition group",
        {
          default: "bg-gray-100 hover:bg-gray-200",
          danger: "bg-red-100 hover:bg-red-200",
        }[variant],
        className
      )}
    >
      <Icon
        className={classNames(
          "w-4 transition",
          {
            default: "text-gray-500 group-hover:text-gray-700",
            danger: "text-red-500 group-hover:text-red-700",
          }[variant]
        )}
      />
    </button>
  );
}
