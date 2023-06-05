///////////////
// color convert by Tim Down
// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
/**
 * 
 * converts hex to RGB
 * 
 * @param c Hex ccomponent
 * @returns returns an object with r g b component values
 */
function componentToHex(c:number) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

/**
 * 
 * Converts Rgb to hex
 * 
 * @param r red value
 * @param g green value
 * @param b blue value
 * @returns the hex value
 */
function rgbToHex(r:number, g:number, b:number) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

/**
 * 
 * @param hex the hex color code
 * @returns RGB values as r, g, b values 
 */
function hexToRgb(hex:string|number) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.toString().replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}


export{
    rgbToHex,
    hexToRgb
}