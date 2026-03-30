/**
 * File Info
 * 
 * @param {string} filename file name
 * @returns fileinfo
 */
const fileInfo = async (filename) => {

  const root = await navigator.storage.getDirectory();

  const fileHandle = await root.getFileHandle(filename);
  return await fileHandle.getFile();

}

export default fileInfo