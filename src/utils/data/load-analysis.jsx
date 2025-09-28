import pako from 'pako';

const loadAnalysisFromFile = (file) => {

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = function (e) {
      try {
        const inflated = pako.inflate(reader.result, { to: 'string' });
        const content = JSON.parse(inflated);
        resolve(content);
      }
      catch(err) {
        reject(err);
      }
    };
    reader.onerror = function (e) {
      reject(e);
    };
    reader.readAsArrayBuffer(file);
  });
}

export default loadAnalysisFromFile