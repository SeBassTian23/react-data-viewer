// https://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript

export const fileExtension = ( filename = '' ) => {

  if(filename === undefined)
    return ''

  let re = /(?:\.([^.]+))?$/;
  let extension = re.exec(filename)
  if(extension[1])
    return re.exec(filename)[1].toLowerCase()
  return ''
}