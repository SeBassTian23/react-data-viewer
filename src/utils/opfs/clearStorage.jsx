/**
 * Clear all files from Storage
 */
const clearStorage = async () => {

  const root = await navigator.storage.getDirectory();

  for await (const [name, handle] of root.entries()) {
    if (handle.kind === "file") {
      await root.removeEntry(name);
    }
  }
  window.dispatchEvent(new Event("opfs-change"))
}

export default clearStorage