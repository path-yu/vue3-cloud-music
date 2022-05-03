
// 格式化数字
export function formateNumber(num:number) {
  // 小于999的数字直接返回
  if (num < 99999) return num.toString();
  // 大于1万 小于1亿
  if (num < 100000000) return Math.round(num / 10000) + '万';
  // 大于1亿
  if (num >= 100000000) return Math.round(num / 100000000) + '亿';
 
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

export const generalTimeOptions = (
  start:number, end:number, label:string
) => {
  const arr = [];
  for (let i = start; i <= end; i++) {
    arr.push({
      label: i+label,
      value: i
    });
  }
  return arr;
};
export const getDayOptions = (
  month:number, year:number=new Date().getFullYear()
) => {
  let day;
  if ([
    1, 3, 5, 7, 8, 10, 12
  ].includes(month)) {
    day = 31;
  }
  if ([
    4, 6, 9, 11
  ].includes(month)) {
    day = 30;
  }
  // 如果此时为闰年 并且是2月
  if (month === 2) {
    if (year % 4 === 0) {
      day = 29;
    } else {
      day = 28;
    }
  }
  return generalTimeOptions(
    1, day as number, '日'
  );
}; 
// 对比两个对象是否相等
export const compareObject = (
  obj1:any, obj2:any
) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;
  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }
  return true;
};
export function getImgSize(file: File):Promise<{width:number, height:number}> {
  return new Promise((
    resolve, reject
  ) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (theFile) {
      const image = new Image();
      if (theFile.target) {
        image.src = theFile.target.result as string;
        image.onload = function () {
          resolve({
            width: image.width,
            height: image.height
          });
        };
      }
      
    };
  });
}