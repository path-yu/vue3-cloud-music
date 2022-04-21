
// 格式化数字
export function formateNumber(num:number) {
  if (num < 99999) return num.toString();
  if (num >= 10000 && num < 1000000000) {
    return Math.round(num / 10000) + '万';
  }
  if (num >= 1000000000) {
    return Math.round(num / 1000000000) + '亿';
  }
  return num.toString();
}


export const getArrLast = (arr:any[]) => {
  return arr[arr.length - 1];
};

// 节流
export const throttle = (
  fn:Function, delay:number
) => {
  let timer:any = null;
  return function () {
    if (timer) return;
    timer = setTimeout(
      (...rest) => {
        fn(...rest);
        timer = null;
      }, delay
    );
  };
};

// 根据不同类型记忆函数
export const memorize = (fn:Function) => {
  const cache = new Map();
  return (...args:any[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(
      key, result
    );
    return result;
  };
};
export const formateSongsAuthor = (attr: any[]) => {
  return attr.map(item => item.name).join('/');
};
// 根据指定的数量将数组切片
export const sliceArr = (
  count=20, list:any[]
) => {
  const arr = [];
  let index = 0;
  let nextSliceIndex = 0;
  while (index < list.length) {
    const item = list.slice(
      nextSliceIndex, nextSliceIndex+count
    );
    arr.push(item);
    index++;
    nextSliceIndex+=count;
  }
  return arr;
};