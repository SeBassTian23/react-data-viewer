/**
 * Write to File
 * 
 * @param {string} filename file name
 * @param {string} data data to write
 * @param {boolean} append append to file (default: false)
 * @param {boolean} dispatch dispatch change event (default: false)
 */
const fileWrite = async (filename, data, append=false, dispatch=false) => {

  const root = await navigator.storage.getDirectory();

  const fileHandle = await root.getFileHandle(filename, {
    create: true
  });

  const writable = await fileHandle.createWritable({ keepExistingData: append });
  
  if(append){
    const file = await fileHandle.getFile();
    await writable.seek(file.size);
  }
  
  await writable.write(data);
  await writable.close();

  dispatch && window.dispatchEvent(new Event("opfs-change"))
}

export default fileWrite