import { Point } from "./Point";

// Calculate average
function calculateAverage(arr: number[]) {
  let runningSum = 0;
  for (let i = 0; i < arr.length; i++) {
    runningSum = runningSum + arr[i];
  }
  const avg = runningSum / arr.length;
  return avg;
}

// calculate distance between two points
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
function calculateSquaredDistance(p1: Point, p2: Point) {
  const d =
    Math.pow(p1.x - p2.x, 2) +
    Math.pow(p1.y - p2.y, 2) +
    Math.pow(p1.z - p2.z, 2);
  return d;
}

// get a random subset of something from a array of things
// must provide the number of things we want from that array
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

export default {
  calculateAverage,
  calculateDistance,
  calculateSquaredDistance,
  getRandomSubset,
};
