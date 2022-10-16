import { FileEntry } from "@tauri-apps/api/fs";
import { ComponentType, SVGProps } from "react";
import { Metadata } from "tauri-plugin-fs-extra-api";

export type HeroIcon = ComponentType<SVGProps<SVGSVGElement>>;

export type Note = FileEntry & { metadata: Metadata };
