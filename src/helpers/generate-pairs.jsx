// generate pairs
export default function pairs(arr) {
  let res = [],
    l = arr.length;
  for (let i = 0; i < l; ++i)
    for (let j = i + 1; j < l; ++j)
      res.push([arr[i], arr[j]]);
  return res;
}