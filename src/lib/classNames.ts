/**
 * Combines an array of CSS class names, filtering out falsy and undefined values,
 * and returns a single space-separated string of class names.
 *
 * @param classes - An array of strings representing CSS class names, including possible falsy and undefined values.
 * @returns A string containing the combined and filtered class names.
 */
export default function cn(
    ...classes: Array<string | false | undefined>
): string {
    // Filter out falsy and undefined class names
    const validClasses = classes.filter(Boolean)

    // Join the valid class names with a space
    const combinedClasses = validClasses.join(' ')

    return combinedClasses
}
