import debounce from 'lodash/debounce';
import opfs from '../../modules/opfs'

const triggerOPFSSync = debounce(async (file=null, content={}) => {
  try {
    if(file && opfs.isSupported() && localStorage.length > 0){
      await opfs.fileWrite(file, JSON.stringify(content, null, 0), false, true );
      console.log('State saved')
    }
  } catch (error) {
    console.error('Failed to sync to OPFS:', error);
  }
}, 1000); // Write 1 second after last change

export default triggerOPFSSync