import kindOf from 'kind-of'

const countTypes = arr => {
   return arr.reduce((acc, val) => {
      const dataType = kindOf(val);
      if (acc.has(dataType)) {
         acc.set(dataType, acc.get(dataType) + 1);
      } else {
         acc.set(dataType, 1);
      };
      return acc;
   }, new Map());
};

export default countTypes