// Calculate average
function calculateAverage(arr) {
  let runningSum = 0;
  for (let i = 0; i < arr.length; i++) {
    runningSum = runningSum + arr[i];
  }
  const avg = runningSum / arr.length;
  return avg;
}

// calculate distance between two points
function calculateDistance(p1, p2) {
  const d = Math.pow(
    Math.pow(p1.x - p2.x, 2) +
      Math.pow(p1.y - p2.y, 2) +
      Math.pow(p1.z - p2.z, 2),
    0.5
  );
  return d;
}

function calculateSquaredDistance(p1, p2) {
  const d =
    Math.pow(p1.x - p2.x, 2) +
    Math.pow(p1.y - p2.y, 2) +
    Math.pow(p1.z - p2.z, 2);
  return d;
}

function getRandomSubset(arr, n) {
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

export { calculateAverage, calculateDistance, calculateSquaredDistance, getRandomSubset};
