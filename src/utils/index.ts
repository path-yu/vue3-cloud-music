
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
// 图片预加载
export const preloadImg = (src: string) => {
  return new Promise((
    resolve, reject
  ) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      resolve(img);
    };
    img.onerror = () => {
      reject(src);
    };
  });
};
export const batchLoadImg = async (
  list:string[], itemCallback:{load:(index:number)=>void, error:(index:number) => void}
) => {
  list.forEach((
    src, index
  ) => {
    preloadImg(src).then(() => itemCallback.load(index))
      .catch(() => itemCallback.error(index));
  });

  return true;
};

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