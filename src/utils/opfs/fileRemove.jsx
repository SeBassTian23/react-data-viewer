/**
 * File remove
 * 
 * @param {string} filename file name
 * @param {boolean} dispatch dispatch change event (default: false)
 */
const fileRemove = async (filename, dispatch=false) => {

  const root = await navigator.storage.getDirectory();

  await root.removeEntry(filename);

  dispatch && window.dispatchEvent(new Event("opfs-change"))
}

export default fileRemove