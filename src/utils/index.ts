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
  return new Promise((resolve, reject) => {
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
export const batchLoadImg = async (list:string[]) => {
  for (const src of list) {
    await preloadImg(src);
  }
  return true;
};