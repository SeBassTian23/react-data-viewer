/**
 * File exists
 * 
 * @param {string} filename file name
 */
const fileExists = async (filename) => {

  const root = await navigator.storage.getDirectory();

  try{
    await root.getFileHandle(filename);
    return true;
  }
  catch(e){
    return false;
  }
}

export default fileExists