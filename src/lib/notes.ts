import { fs } from "@tauri-apps/api";
import { metadata } from "tauri-plugin-fs-extra-api";

export async function getNotes() {
  const files = await fs.readDir("notes", {
    dir: fs.BaseDirectory.Home,
  });

  return Promise.all(
    files
      .filter((file) => file.name?.endsWith(".md"))
      .map(async (file) => {
        const md = await metadata(file.path);

        return {
          ...file,
          metadata: md,
        };
      })
  );
}
