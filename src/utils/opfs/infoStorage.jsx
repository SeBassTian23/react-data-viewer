/**
 * File Info
 * @returns object with quota
 */
const infoStorage = async () => {
  return await navigator.storage.estimate();
}

export default infoStorage