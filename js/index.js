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

var jingleSound;

var Snowflake = function() {
  this.speed = getRandomBetween(SNOWFLAKE_SPEED_MIN, SNOWFLAKE_SPEED_MAX);
  this.size = getRandomBetween(SNOWFLAKE_SIZE_MIN, SNOWFLAKE_SIZE_MAX);
  this.rotateSpeed = getRandomBetween(SNOWFLAKE_ROTATE_SPEED_MIN, SNOWFLAKE_ROTATE_SPEED_MAX);
  this.graphics = createGraphics(this.size, getRandomStartingPosition(this.size), getRandomStartingRotation());
  this.colliding = false;
};

Snowflake.prototype.getPosition = function() {
  return this.graphics.position;
};

Snowflake.prototype.updatePosition = function() {
  this.graphics.position.y += this.speed;
};

Snowflake.prototype.updateRotation = function() {
  this.graphics.rotation += this.rotateSpeed;
};

/**
 * @returns boolean Whether or not it is newly colliding
 */
Snowflake.prototype.updateCollisions = function(snowflakes) {

  var newCollision = false;
  var thisPosition = this.getPosition();

  if (thisPosition.y < 0) {
    // Off-screen
    this.colliding = false;
    return newCollision;
  }

  if (this.colliding) {
    return newCollision;
  }

  var colliding = false;

  for (var i=0; i < snowflakes.length; i++) {

    var snowflake = snowflakes[i];
    var snowflakePosition = snowflake.getPosition();

    // Check it's not this snowflake
    if (snowflake.index !== this.index) {

      var xdist = snowflakePosition.x - thisPosition.x;
      if (xdist > -snowflake.size/2 && xdist < snowflake.size/2) {

        var ydist = snowflakePosition.y - thisPosition.y;
        if (ydist > -snowflake.size/2 && ydist < snowflake.size/2) {

          colliding = true;
        }
      }

      if (colliding) {

        // If snowflake we're colliding with isn't already colliding, register a new one
        if (!snowflake.colliding) {
          console.log('Collision', this.index, snowflake.index);
          newCollision = true;
        }

        break;
      }
    }
  }

  this.colliding = colliding;

  return newCollision;

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
    snowflake.index = i;
    stage.addChild( snowflake.graphics );
    snowflakes.push( snowflake );
  }

  jingleSound = new Howl({
    src: ['audio/jingle.mp3', 'audio/jingle.wav']
  });

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
    var position = snowflake.getPosition();

    if (position.y < height + snowflake.size) {

      // Still going...
      snowflake.updatePosition();
      snowflake.updateRotation();

      var hasNewCollisions = snowflake.updateCollisions(snowflakes);

      if (hasNewCollisions) {
        console.log('New collisions, play song', snowflake.index, snowflake.collidingWith);
        jingleSound.play();
      }

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
