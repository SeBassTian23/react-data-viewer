import debounce from 'lodash/debounce';
import opfs from '../../modules/opfs'

/**
 * Trigger for syncing a file with opfs
 * It uses lodash's debounce with a 1 sec delay
 * Further the localStorage needs the item `APP_USER_COOKIES`
 * to allow writing to opfs
 */
const triggerOPFSSync = debounce(async (file=null, content={}) => {
  try {
    if(file && opfs.isSupported() && localStorage.getItem('APP_USER_COOKIES') ){
      await opfs.fileWrite(file, JSON.stringify(content, null, 0), false, true );
    }
  } catch (error) {
    console.error('Failed to sync to OPFS:', error);
  }
}, 1000); // Write 1 second after last change

export default triggerOPFSSync