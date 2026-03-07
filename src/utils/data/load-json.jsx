const loadJSON = (file) => {
  return new Promise((resolve, reject) => {
    let content = '';
    const reader = new FileReader();
    reader.onloadend = function (e) {
      content = e.target.result;
      try{
        content = JSON.parse(reader.result)
        resolve(content);
      }
      catch(e){
        reject(e);
      }
    };
    reader.onerror = function (e) {
      reject(e);
    };
    reader.readAsText(file);
  });
}

export default loadJSON