/**
 * Start above the top of the screen
 */
function getRandomStartingPosition(size) {

  var rnd = Math.random();
  var x = rnd * width;
  rnd = Math.random();
  var y = -size - rnd * (height - size);

  return {x: x, y: y};

}

function getRandomStartingRotation() {
  return Math.random() * Math.PI * 2;
}

function getRandomBetween(min, max) {
  var rnd = Math.random();
  return min + rnd * (max - min);
}
