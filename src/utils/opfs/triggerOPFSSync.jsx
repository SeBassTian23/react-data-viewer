import debounce from 'lodash/debounce';
import fileWrite from './fileWrite'

const triggerOPFSSync = debounce(async (file=null, content={}) => {
  try {
    if(file)
      await fileWrite(file, JSON.stringify(content, null, 0) );
  } catch (error) {
    console.error('Failed to sync to OPFS:', error);
  }
}, 1000); // Write 1 second after last change

export default triggerOPFSSync