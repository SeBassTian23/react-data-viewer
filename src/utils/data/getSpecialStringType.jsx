import dayjs from 'dayjs'
import tinycolor from 'tinycolor2'
// import chroma from 'chroma-js'

const getSpecialStringType = (arr) => {

   let types = []
   for (let i in arr) {

      // Check if it is a date
      try {
         if (dayjs(arr[i]).isValid()){
            types.push('date-time');
            continue;
         }
      } catch (error) { }

      // Check if string is an Array or Object
      try {
         let parsed = JSON.parse(arr[i])
         if (parsed !== null && Array.isArray(parsed)) {
            types.push('array');
            continue;
         }
         else if (parsed !== null && !Array.isArray(parsed)) {
            types.push('object');
            continue;
         }
      } catch (error) { }

      // Check if input is an Array
      if (typeof arr[i] == 'object' && arr[i] !== null && Array.isArray(arr[i])) {
         types.push('array');
         continue;
      }

      // Check if input is an object
      if (typeof arr[i] == 'object' && arr[i] !== null && !Array.isArray(arr[i])) {
         types.push('object');
         continue;
      }

      // Check if it is a color
      if (tinycolor(arr[i]).isValid()) {
         types.push('color')
         continue;
      }
      // TODO: perhaps use chroma later if (chroma.valid(arr[i])){

      // Default type for strings
      types.push('string');
   }
   return [...new Set(types)]
};

export default getSpecialStringType