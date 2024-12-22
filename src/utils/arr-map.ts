import { formateSongsAuthor } from '.';

export function mapSongs(songs:any[]) {
  return songs.map((item:any) => {
    const target = item.song
      ? item.song
      : item;
    item.dt = target.dt ? target.dt : target.duration;
    item.al = target.al ? target.al: target.album;
    item.ar = target.ar ? target.ar : target.artists;
    item.formatAuthor = formateSongsAuthor( item.ar );
    return item;
  });
} 