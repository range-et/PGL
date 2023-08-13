import Point from "./Point";

// Calculate average
/**
 * calculate the average of an array of numberss
 * @param arr an array of number whose average has to be calculated
 * @returns the average
 */
function calculateAverage(arr: number[]) {
  let runningSum = 0;
  for (let i = 0; i < arr.length; i++) {
    runningSum = runningSum + arr[i];
  }
  const avg = runningSum / arr.length;
  if (Number.isNaN(avg)) {
    return 0;
  }
  return avg;
}

// calculate distance between two points
/**
 * Calculate the distance betweeen two points
 * @param p1 the first point
 * @param p2 the second point
 * @returns the distance between the points
 */
function calculateDistance(p1: Point, p2: Point) {
  const d = Math.pow(
    Math.pow(p1.x - p2.x, 2) +
      Math.pow(p1.y - p2.y, 2) +
      Math.pow(p1.z - p2.z, 2),
    0.5
  );
  return d;
}

// calculate squared distance sometimes we dont really need
// the actual root but just a rough idea
/**
 * Calculate the squared distance between two points
 * @param p1 the first point
 * @param p2 the second point
 * @returns the squared distance between the two points
 */
function calculateSquaredDistance(p1: Point, p2: Point) {
  const d =
    Math.pow(p1.x - p2.x, 2) +
    Math.pow(p1.y - p2.y, 2) +
    Math.pow(p1.z - p2.z, 2);
  return d;
}

// get a random subset of something from a array of things
// must provide the number of things we want from that array
/**
 * get a random subset of something from a array of things must provide the number of things we want from that array
 * @param arr the array from which the subset has to be made
 * @param n number of items to select
 * @returns a new array made up of a random sample from the original array
 */
function getRandomSubset(arr: any[], n: number) {
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len)
    throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

/**
 * This is a super useful method to get a random number of edges or something that you would like to draw
 * this is primarily done because there are way too many edges sometimes and and the number of edges is really
 * What slows the whole rendering process down
 * @param map - the map that youd like to reduce
 * @param n - the fraction of items that youd like to return from this map
 * @returns A reduced map with a fractio of those many entries
 */
function getRandomSubset_map(map: Map<number, any>, n: number) {
  const newMap = new Map();
  let prob;
  for (const item of map.keys()) {
    prob = Math.random();
    if (prob < n) {
      newMap.set(item, map.get(item));
    }
  }
  return newMap;
}

export default {
  calculateAverage,
  calculateDistance,
  calculateSquaredDistance,
  getRandomSubset,
  getRandomSubset_map,
};
