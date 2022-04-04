// 格式化数字
export function formateNumber(num:number){
  if(num < 99999) return num;
  if(num >= 10000 && num < 1000000000){
    return Math.round(num / 10000) + '万'
  }
  if(num >= 1000000000 ){
    return Math.round(num / 1000000000) + '亿'
  }
}