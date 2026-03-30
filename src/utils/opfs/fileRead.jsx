/**
 * Read File
 * @param {string} filename file name
 * @returns file content as string
 */
const fileRead = async (filename) => {

  const root = await navigator.storage.getDirectory();

  const fileHandle = await root.getFileHandle(filename);
  const file = await fileHandle.getFile();
  
  return await file.text();
}

export default fileRead