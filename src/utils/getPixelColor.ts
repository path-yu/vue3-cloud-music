export function getPixelColor(
  context:CanvasRenderingContext2D, x:number, y:number
) {
  // x轴坐标 ， y轴坐标， 1，1取色的范围像素值
  const imageData = context.getImageData(
    x, y, 1, 1
  ); 
  const pixel = imageData.data;
  const r = pixel[0];
  const g = pixel[1];
  const b = pixel[2];
  let rHex = r.toString(16);
  r < 16 && (rHex = '0' + rHex);
  let gHex = g.toString(16);
  g < 16 && (gHex = '0' + gHex);
  let bHex = b.toString(16);
  b < 16 && (bHex = '0' + bHex);
  const rgbColor = 'rgb(' + r + ',' + g + ',' + b + ')';
  const hexColor = '#' + rHex + gHex + bHex;
  return {
    rgb: rgbColor,
    hex: hexColor
  };
}