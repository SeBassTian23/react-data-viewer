const loadJSON = (file) => {
  return new Promise((resolve, reject) => {
    let content = '';
    const reader = new FileReader();
    reader.onloadend = function (e) {
      content = e.target.result;
      content = JSON.parse(reader.result)
      resolve(content);
    };
    reader.onerror = function (e) {
      reject(e);
    };
    reader.readAsText(file);
  });
}

export default loadJSON