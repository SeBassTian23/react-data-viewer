import pako from 'pako';

import { exportJSON } from '../../modules/database'
import cloneDeep from 'lodash/cloneDeep'


const saveAnalysisToFile = (store = null) => {

  let storeCopy = null
  if (store) {
    storeCopy = cloneDeep(store)
    delete storeCopy.bookmarks;
  }

  let data = {
    store: storeCopy,
    db: exportJSON()
  }

  let filename = store?.analysis?.saveAs+".zip" || 'my-analysis.zip'

  // Download element
  var blob = new Blob([data], { type: 'application/zip' });

  // IE Compatibility
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    // Download element
    var pom = document.createElement('a');
    var url = URL.createObjectURL(blob);
    pom.href = url;
    pom.setAttribute('download', filename);
    document.body.appendChild(pom);
    pom.click();
    pom.parentNode.removeChild(pom);
  }
}

export default saveAnalysisToFile;