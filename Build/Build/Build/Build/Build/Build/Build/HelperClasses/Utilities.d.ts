import { default as Point } from './Point';
/**
 * calculate the average of an array of numberss
 * @param arr an array of number whose average has to be calculated
 * @returns the average
 */
declare function calculateAverage(arr: number[]): number;
/**
 * Calculate the distance betweeen two points
 * @param p1 the first point
 * @param p2 the second point
 * @returns the distance between the points
 */
declare function calculateDistance(p1: Point, p2: Point): number;
/**
 * Calculate the squared distance between two points
 * @param p1 the first point
 * @param p2 the second point
 * @returns the squared distance between the two points
 */
declare function calculateSquaredDistance(p1: Point, p2: Point): number;
/**
 * get a random subset of something from a array of things must provide the number of things we want from that array
 * @param arr the array from which the subset has to be made
 * @param n number of items to select
 * @returns a new array made up of a random sample from the original array
 */
declare function getRandomSubset(arr: any[], n: number): any[];
/**
 * This is a super useful method to get a random number of edges or something that you would like to draw
 * this is primarily done because there are way too many edges sometimes and and the number of edges is really
 * What slows the whole rendering process down
 * @param map - the map that youd like to reduce
 * @param n - the fraction of items that youd like to return from this map
 * @returns A reduced map with a fractio of those many entries
 */
declare function getRandomSubset_map(map: Map<number, any>, n: number): Map<any, any>;
declare const _default: {
    calculateAverage: typeof calculateAverage;
    calculateDistance: typeof calculateDistance;
    calculateSquaredDistance: typeof calculateSquaredDistance;
    getRandomSubset: typeof getRandomSubset;
    getRandomSubset_map: typeof getRandomSubset_map;
};
export default _default;
