// https://stackoverflow.com/questions/36129721/convert-number-to-alphabet-letter

const number2letter = num => num <= 0 ? '' : number2letter(Math.floor((num - 1) / 26)) + String.fromCharCode((num - 1) % 26 + 65);

export default number2letter;