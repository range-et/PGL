/**
 *
 * Converts Rgb to hex
 *
 * @param r red value
 * @param g green value
 * @param b blue value
 * @returns the hex value
 */
declare function rgbToHex(r: number, g: number, b: number): string;
/**
 *
 * @param hex the hex color code
 * @returns RGB values as r, g, b values
 */
declare function hexToRgb(hex: string | number): {
    r: number;
    g: number;
    b: number;
} | null;
export { rgbToHex, hexToRgb };
