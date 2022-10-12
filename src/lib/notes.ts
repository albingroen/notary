import { fs } from "@tauri-apps/api";

export async function getNotes() {
  const files = await fs.readDir("notes", {
    dir: fs.BaseDirectory.Home,
  });

  return files.filter((file) => file.name?.endsWith(".md"));
}
