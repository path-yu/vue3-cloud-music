import { isArray, isPlainObject } from 'lodash';

export const markSearchKeyword = (
  data:any[], keys:(string | string[])[], keyword:string, color:string
) => {
  return data.map(item => {
    keys.forEach(key => {
      if (typeof key === 'string') {
        const itemValue = item[key];
        if (typeof itemValue === 'string') {
          const value = replaceMarkValue(
            itemValue, keyword, color
          );
          item[key+'RichText'] = value;
        }
        if (isArray(itemValue) && typeof itemValue[0] === 'string') {
          item[key] = item[key].map((target:string) => {
            const replaceValue = replaceMarkValue(
              target, keyword, color
            );
            if (replaceValue) return replaceValue;
            return target;
          });
        }
      } else {
        const itemValue = item[key[0]];
        const target = item[key[0]][key[1]];
        if (isPlainObject(itemValue)) {
          item[key[0]][key[1]+'RichText'] = replaceMarkValue(
            target, keyword, color
          );
        }
      }
    });
    return item;
  });
};
const replaceMarkValue = (
  value:string, keyword:string, color:string
) => {
  if (value.includes(keyword)) {
    let markValue = value.
      replace(keyword, `<span style="color:${color}">${keyword}</span>`);
    if (value !== keyword) {
      markValue = markValue.padStart(markValue.length+6, '<span>');
      markValue = markValue.padEnd(markValue.length+7, '</span>');
    }
    return markValue; 
  }
  return `<span>${value}</span>`;
};