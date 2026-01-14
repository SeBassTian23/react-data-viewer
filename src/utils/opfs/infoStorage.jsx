/**
 * File Info
 */
const infoStorage = async () => {

  return await navigator.storage.estimate();

}

export default infoStorage