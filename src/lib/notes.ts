import { fs, path } from "@tauri-apps/api";
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

export async function getNote(noteName: string) {
  return fs.readTextFile(`notes/${noteName}`, {
    dir: fs.BaseDirectory.Home,
  });
}

export async function getNoteMetadata(noteName: string) {
  const homeDir = await path.homeDir();

  const notePath = `${homeDir}notes/${noteName}`;

  const md = await metadata(notePath);

  return {
    ...md,
    path: notePath,
  };
}

export async function updateNote(noteName: string, value: string) {
  return fs.writeFile(`notes/${noteName}`, value, {
    dir: fs.BaseDirectory.Home,
  });
}

export async function renameNote(oldName: string, newName: string) {
  console.log({
    oldName,
    newName,
  });
  return fs.renameFile(`notes/${oldName}`, `notes/${newName}`, {
    dir: fs.BaseDirectory.Home,
  });
}

export async function deleteNote(noteName: string) {
  return fs.removeFile(`notes/${noteName}`, {
    dir: fs.BaseDirectory.Home,
  });
}

export function handleNotesFolder() {
  fs.readDir("notes", { dir: fs.BaseDirectory.Home }).catch(() => {
    fs.createDir("notes", { dir: fs.BaseDirectory.Home }).catch(() => {});
  });
}
