// Generate Combinations
// Based on https://stackoverflow.com/questions/15298912/javascript-generating-combinations-from-n-arrays-with-m-elements

function generateFilterCombinations(args) {
  var r = [], max = args.length - 1;
  function helper(arr, i) {
    for (var j = 0, l = args[i].values.length; j < l; j++) {
      var a = arr.slice(0); // clone arr
      a.push({ ...args[i], ...{ values: [args[i].values[j]] } });
      if (i === max)
        r.push(a);
      else
        helper(a, i + 1);
    }
  }
  if (max > -1)
    helper([], 0);
  return r;
}

export const calculatePossibleCombinations = (args) => {
  var combinationCount = 1
  for (var i in args) {
    combinationCount *= args[i].values.length
  }
  return combinationCount
}

export default generateFilterCombinations