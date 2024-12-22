import ColorThief from 'colorthief';

export function analyze(src:string) :Promise<string>{
 
  return new Promise((resolve, reject) => {
    const colorThief = new ColorThief();
    const image = new Image();
    image.src = src;
    image.crossOrigin = 'Anonymous';
    function handleLoad (){
      const color = colorThief.getColor(image);
      resolve(`rgb(${color.join(',')})`);
      image.removeEventListener('load', handleLoad);
    }
    image.addEventListener('load',handleLoad)
    image.onerror = (err) => {
      reject(err);
    };
  });
}