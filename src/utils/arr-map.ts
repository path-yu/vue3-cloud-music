export function mapSongs(songs:any[]) {
  return songs.map((item:any) => {
    item.dt = item.duration;
    item.al = item.album;
    item.ar = item.artists;
    return item;
  });
} 