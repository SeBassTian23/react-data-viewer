/**
 * Async function to get an image from a provided
 * url as a base64 encoded string
 * @param {string} url 
 * @returns promise with base64 encoded string
 */
export const getBase64ImageFromURL = (url) => {
  return fetch(url)
  .then(response => response.blob())
  .then(blob => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  }))
};
