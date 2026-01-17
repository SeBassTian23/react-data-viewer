import isSupported from '../utils/opfs/isSupported'
import fileExists from '../utils/opfs/fileExists'
import fileInfo from '../utils/opfs/fileInfo'
import fileRead from '../utils/opfs/fileRead'
import fileWrite from '../utils/opfs/fileWrite'
import fileList from '../utils/opfs/fileList'
import fileRemove from '../utils/opfs/fileRemove'
import infoStorage from '../utils/opfs/infoStorage'
import clearStorage from '../utils/opfs/clearStorage'
import isPersistent from '../utils/opfs/isPersistent'

/**
 * Using Files accessing the Origin Private File System
 * 
 * https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system
 */
const opfs = {
  isSupported,
  fileExists,
  fileInfo,
  fileRead,
  fileWrite,
  fileList,
  infoStorage,
  clearStorage,
  fileRemove,
  isPersistent
}

export default opfs