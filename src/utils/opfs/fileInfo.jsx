/**
 * File Info
 * 
 * @param {string} filename file name
 */
const fileInfo = async (filename) => {

  const root = await navigator.storage.getDirectory();

  const fileHandle = await root.getFileHandle(filename);
  return await fileHandle.getFile();

}

export default fileInfo