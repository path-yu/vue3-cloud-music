
export function parseLyric(lrc:string): LineItem[] {
  const lyrics = lrc.split('\n');
  const lrcObj:LineItem[] = [];
  for (let i = 0; i < lyrics.length; i++) {
    const lyric = decodeURIComponent(lyrics[i]);
    const timeReg = /\[\d*:\d*((\.|:)\d*)*\]/g;
    const timeRegExpArr = lyric.match(timeReg);
    if (!timeRegExpArr) continue;
    const content = lyric.replace(
      timeReg, ''
    );
    for (let k = 0, h = timeRegExpArr.length; k < h; k++) {
      const t = timeRegExpArr[k];
      const min = Number(String(t.match(/\[\d*/i)).slice(1));
      const sec = Number(String(t.match(/:\d*/i)).slice(1));
      const time = min * 60 + sec;
      if (content !== '') {
        lrcObj.push({ time: time, content, isFind: false });
      }
    }
  }
  return lrcObj;
}
export interface LineItem{
  time:number;
  content:string;
  translateContent?:string;
  isFind:boolean;
}