var SNOWFLAKE_COLOUR = 0xFFFFFF;
var SNOWFLAKE_RATE_DEFAULT = 10;
var SNOWFLAKE_SIZE = 30;
var TRIANGLE_LENGTH = SNOWFLAKE_SIZE / 3;
var SNOWFLAKE_SPEED = 1;

var snowflakeRate = SNOWFLAKE_RATE_DEFAULT;

var width = window.innerWidth;
var height = window.innerHeight;
var container = document.getElementById('container');

var renderer = new PIXI.autoDetectRenderer(width, height, {transparent: false, antialias: true});

var stage = new PIXI.Container();
var snowflakes = [];

init();

function init() {

  renderer.backgroundColor = 0x987fff;

  container.style.width = width;
  container.style.height = height;
  container.appendChild(renderer.view);

  for (var i=0; i < snowflakeRate; i++) {
    var snowflake = createSnowflake();
    stage.addChild( snowflake );
    snowflakes.push( snowflake );
  }

  animate();

}

/**
 * We're making the second shape shown here:
 * http://mathworld.wolfram.com/KochSnowflake.html
 */
function createSnowflake() {

  var snowflake = new PIXI.Graphics();

  // Start at the edge of the top left triangle
  // a^2 + b^2 = c^2, a=TRIANGLE_LENGTH/2, b=?, c=SNOWFLAKE_TRIANGLE
  var triangleHeight = Math.sqrt((TRIANGLE_LENGTH/2 * TRIANGLE_LENGTH/2) + (TRIANGLE_LENGTH * TRIANGLE_LENGTH));
  var pos = {x: 0, y: triangleHeight};

  snowflake.lineStyle(2, SNOWFLAKE_COLOUR, 1);
  snowflake.moveTo(pos.x, pos.y);
  snowflake.lineTo(pos.x += TRIANGLE_LENGTH, pos.y);
  snowflake.lineTo(pos.x += TRIANGLE_LENGTH/2, pos.y -= triangleHeight);
  snowflake.lineTo(pos.x += TRIANGLE_LENGTH/2, pos.y += triangleHeight);
  snowflake.lineTo(pos.x += TRIANGLE_LENGTH, pos.y);
  snowflake.lineTo(pos.x -= TRIANGLE_LENGTH/2, pos.y += TRIANGLE_LENGTH);
  snowflake.lineTo(pos.x += TRIANGLE_LENGTH/2, pos.y += TRIANGLE_LENGTH);
  snowflake.lineTo(pos.x -= TRIANGLE_LENGTH, pos.y);
  snowflake.lineTo(pos.x -= TRIANGLE_LENGTH/2, pos.y += TRIANGLE_LENGTH);
  snowflake.lineTo(pos.x -= TRIANGLE_LENGTH/2, pos.y -= TRIANGLE_LENGTH);
  snowflake.lineTo(pos.x -= TRIANGLE_LENGTH, pos.y);
  snowflake.lineTo(pos.x += TRIANGLE_LENGTH/2, pos.y -= TRIANGLE_LENGTH);
  snowflake.lineTo(pos.x -= TRIANGLE_LENGTH/2, pos.y -= TRIANGLE_LENGTH);

  var pos = getRandomStartingPosition();
  snowflake.position.x = pos.x;
  snowflake.position.y = pos.y;

  snowflake.rotation = getRandomStartingRotation();

  return snowflake;

}

/**
 * Start above the top of the screen
 */
function getRandomStartingPosition() {

  var rnd = Math.random();
  var x = rnd * width;
  rnd = Math.random();
  var y = rnd * -height/2;

  return {x: x, y: y};

}

function getRandomStartingRotation() {
  return Math.random() * Math.PI * 2;
}

function updateOnFrame() {

  for (var i=0; i < snowflakes.length; i++) {
    var snowflake = snowflakes[i];
    snowflake.position.y += SNOWFLAKE_SPEED;
  }

}

function animate() {
  // start the timer for the next animation loop
  requestAnimationFrame(animate);

  updateOnFrame();

  // this is the main render call that makes pixi draw your container and its children.
  renderer.render(stage);
}
