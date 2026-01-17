/**
 * Check if OPFS has persistent storage in the browser
 * 
 * @param {boolean} set request persistent storage (defaut=false)
 */
const isPersistent = async (set=false) => {
  
  let persisted = await navigator.storage.persisted();

  if(set && !persisted)
    persisted = await navigator.storage.persist();

  return persisted;
}

export default isPersistent