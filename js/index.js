var SNOWFLAKE_COLOUR = 0xFFFFFF;
var SNOWFLAKE_RATE_DEFAULT = 10;
var SNOWFLAKE_SIZE = 50;
var SNOWFLAKE_SPEED = 1;

var snowflakeRate = SNOWFLAKE_RATE_DEFAULT;

var width = window.innerWidth;
var height = window.innerHeight;
var container = document.getElementById('container');

var renderer = new PIXI.autoDetectRenderer(width, height, {transparent: true});

var stage = new PIXI.Container();
var snowflakes = [];

init();

function init() {

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

function createSnowflake() {

  var triangle = new PIXI.Graphics();
  var pos = getRandomStartingPosition();

  triangle.lineStyle(5, SNOWFLAKE_COLOUR, 1);
  triangle.moveTo(pos.x, pos.y);
  triangle.lineTo(pos.x + SNOWFLAKE_SIZE, pos.y + SNOWFLAKE_SIZE);
  triangle.lineTo(pos.x, pos.y + SNOWFLAKE_SIZE);
  triangle.lineTo(pos.x, pos.y);

  return triangle;

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
