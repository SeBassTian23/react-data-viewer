/**
 * List files in the directory
 * 
 */
const fileList = async () => {
  const root = await navigator.storage.getDirectory();
  const files = [];

  for await (const [name, handle] of root.entries()) {
    if (handle.kind !== "file") continue;

    const file = await handle.getFile();

    files.push({
      name,
      handle,
      size: file.size,
      lastModified: file.lastModified,
      lastModifiedDate: new Date(file.lastModified)
    });
  }

  // Sort newest → oldest
  files.sort((a, b) => b.lastModified - a.lastModified);

  // files.sort((a, b) => a.lastModified - b.lastModified);

  // files.sort((a, b) => a.name.localeCompare(b.name));

  // files.sort((a, b) => b.size - a.size);

  return files;
}

export default fileList