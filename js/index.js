var SNOWFLAKE_COLOUR = 0xFFFFFF;
var SNOWFLAKE_RATE_DEFAULT = 100;

var SNOWFLAKE_SIZE_MIN = 30;
var SNOWFLAKE_SIZE_MAX = 60;

var SNOWFLAKE_SPEED_MIN = 0.75;
var SNOWFLAKE_SPEED_MAX = 2;

var SNOWFLAKE_ROTATE_SPEED_MIN = -0.025;
var SNOWFLAKE_ROTATE_SPEED_MAX = 0.025;

var LOGOS = ['sbrowser5.svg', 'bubble.svg', 'podle.svg', 'snapwat.svg'];
var LOGOS_RATIO = 0.25;

var snowflakeRate = SNOWFLAKE_RATE_DEFAULT;

var width = window.innerWidth;
var height = window.innerHeight;
var container = document.getElementById('container');

var renderer = new PIXI.autoDetectRenderer(width, height, {transparent: false, antialias: true});
var stage = new PIXI.Container();

var Snowflake = function() {
  this.speed = getRandomBetween(SNOWFLAKE_SPEED_MIN, SNOWFLAKE_SPEED_MAX);
  this.size = getRandomBetween(SNOWFLAKE_SIZE_MIN, SNOWFLAKE_SIZE_MAX);
  this.position = getRandomStartingPosition(this.size);
  this.rotation = getRandomStartingRotation();
  this.rotateSpeed = getRandomBetween(SNOWFLAKE_ROTATE_SPEED_MIN, SNOWFLAKE_ROTATE_SPEED_MAX);
  this.graphics = createGraphics(this.size, this.position, this.rotation);
};

var snowflakes = [];

init();

function init() {

  renderer.backgroundColor = 0x987fff;

  container.style.width = width;
  container.style.height = height;
  container.appendChild(renderer.view);

  for (var i=0; i < snowflakeRate; i++) {
    var snowflake = new Snowflake();
    stage.addChild( snowflake.graphics );
    snowflakes.push( snowflake );
  }

  animate();

}

/**
 * We're making a Koch Snowflake - a shape made up of 6 equilateral triangles (60 degs)
 * It's the second shape shown here: http://mathworld.wolfram.com/KochSnowflake.html
 */
function createGraphics(size, position, rotation) {

  var rnd = Math.random();
  var graphics;

  if (rnd <= LOGOS_RATIO) {
    graphics = createRandomLogoSprite(size);
  } else {
    graphics = createSnowflakeGraphic(size);
  }

  graphics.position.x = position.x;
  graphics.position.y = position.y;

  graphics.rotation = rotation;

  // Set the centre for rotation
  graphics.pivot.x = size/2;
  graphics.pivot.y = size/2;

  return graphics;

}

function createSnowflakeGraphic(size) {

  var graphics = new PIXI.Graphics();
  var triangleLength = size/3;

  // Start at the edge of the top left triangle
  // a^2 + b^2 = c^2, a=triangleLength/2, b=?, c=triangleLength
  var triangleHeight = Math.sqrt((triangleLength * triangleLength) - (triangleLength/2 * triangleLength/2));
  var pos = {x: 0, y: triangleHeight};

  graphics.lineStyle(2, SNOWFLAKE_COLOUR, 1);
  graphics.moveTo(pos.x, pos.y);
  graphics.lineTo(pos.x += triangleLength, pos.y);
  graphics.lineTo(pos.x += triangleLength/2, pos.y -= triangleHeight);
  graphics.lineTo(pos.x += triangleLength/2, pos.y += triangleHeight);
  graphics.lineTo(pos.x += triangleLength, pos.y);
  graphics.lineTo(pos.x -= triangleLength/2, pos.y += triangleLength);
  graphics.lineTo(pos.x += triangleLength/2, pos.y += triangleLength);
  graphics.lineTo(pos.x -= triangleLength, pos.y);
  graphics.lineTo(pos.x -= triangleLength/2, pos.y += triangleLength);
  graphics.lineTo(pos.x -= triangleLength/2, pos.y -= triangleLength);
  graphics.lineTo(pos.x -= triangleLength, pos.y);
  graphics.lineTo(pos.x += triangleLength/2, pos.y -= triangleLength);
  graphics.lineTo(pos.x -= triangleLength/2, pos.y -= triangleLength);

  return graphics;

}

function createRandomLogoSprite(size) {

  var logoIndex = Math.floor(Math.random() * LOGOS.length);
  var sprite = new PIXI.Sprite.fromImage('img/' + LOGOS[logoIndex]);
  sprite.width = size;
  sprite.height = size;
  return sprite;

}

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

function updateOnFrame() {

  for (var i=0; i < snowflakes.length; i++) {

    var snowflake = snowflakes[i];

    if (snowflake.graphics.position.y < height + snowflake.size) {

      // Still going...
      snowflake.graphics.position.y += snowflake.speed;
      snowflake.graphics.rotation += snowflake.rotateSpeed;

    } else {

      // Fallen off the bottom, reset to another starting position
      var pos = getRandomStartingPosition(snowflake.size);
      snowflake.graphics.position.x = pos.x;
      snowflake.graphics.position.y = pos.y;
    }
  }

}

function animate() {
  // start the timer for the next animation loop
  requestAnimationFrame(animate);

  updateOnFrame();

  // this is the main render call that makes pixi draw your container and its children.
  renderer.render(stage);
}
