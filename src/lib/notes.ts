import { FileEntry } from '@tauri-apps/api/fs'
import { Metadata, metadata } from 'tauri-plugin-fs-extra-api'
import { NOTES_DIR } from './consts'
import { fs, path } from '@tauri-apps/api'

/**
 * Retrieves a list of notes with their metadata.
 *
 * @returns A promise that resolves to an array of note objects.
 */
export async function getNotes(): Promise<
    Array<FileEntry & { metadata: Metadata }>
> {
    const files = await fs.readDir(NOTES_DIR, {
        dir: fs.BaseDirectory.Home
    })

    return Promise.all(
        files
            .filter((file) => file.name?.endsWith('.md'))
            .map(async (file) => {
                const md = await metadata(file.path)

                return {
                    ...file,
                    metadata: md
                }
            })
    )
}

/**
 * Retrieves the content of a specific note.
 *
 * @param noteName - The name of the note.
 * @returns A promise that resolves to the content of the note.
 */
export async function getNote(noteName: string): Promise<string> {
    return fs.readTextFile(`${NOTES_DIR}/${noteName}`, {
        dir: fs.BaseDirectory.Home
    })
}

/**
 * Retrieves metadata for a specific note.
 *
 * @param noteName - The name of the note.
 * @returns A promise that resolves to the metadata of the note.
 */
export async function getNoteMetadata(
    noteName: string
): Promise<Metadata & { path: string }> {
    const homeDir = await path.homeDir()
    const notePath = `${homeDir}${NOTES_DIR}/${noteName}`
    const md = await metadata(notePath)

    return {
        ...md,
        path: notePath
    }
}

/**
 * Updates the content of a specific note.
 *
 * @param noteName - The name of the note.
 * @param value - The new content of the note.
 * @returns A promise that resolves when the update is complete.
 */
export async function updateNote(
    noteName: string,
    value: string
): Promise<void> {
    return fs.writeFile(`${NOTES_DIR}/${noteName}`, value, {
        dir: fs.BaseDirectory.Home
    })
}

/**
 * Renames a note.
 *
 * @param oldName - The current name of the note.
 * @param newName - The new name for the note.
 * @returns A promise that resolves when the rename is complete.
 */
export async function renameNote(
    oldName: string,
    newName: string
): Promise<void> {
    return fs.renameFile(`${NOTES_DIR}/${oldName}`, `${NOTES_DIR}/${newName}`, {
        dir: fs.BaseDirectory.Home
    })
}

/**
 * Deletes a note.
 *
 * @param noteName - The name of the note to delete.
 * @returns A promise that resolves when the note is deleted.
 */
export async function deleteNote(noteName: string): Promise<void> {
    return fs.removeFile(`${NOTES_DIR}/${noteName}`, {
        dir: fs.BaseDirectory.Home
    })
}

/**
 * Ensures the existence of the 'notes' folder, creating it if it doesn't exist.
 * This function is used to manage the folder where notes are stored.
 */
export function handleNotesFolder(): void {
    fs.readDir(NOTES_DIR, { dir: fs.BaseDirectory.Home }).catch(() => {
        fs.createDir(NOTES_DIR, { dir: fs.BaseDirectory.Home }).catch(() => {})
    })
}
