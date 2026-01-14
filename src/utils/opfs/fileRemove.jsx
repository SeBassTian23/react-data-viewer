/**
 * File remove
 * 
 * @param {string} filename file name
 */
const fileRemove = async (filename) => {

  const root = await navigator.storage.getDirectory();

  root.removeEntry(name);(filename);

  window.dispatchEvent(new Event("opfs-change"))
}

export default fileRemove