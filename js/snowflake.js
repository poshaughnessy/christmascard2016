var DISPLAY_ONLY_SIZE = 90;
var DISPLAY_ONLY_X = 75;
var DISPLAY_ONLY_Y = 75;

var Snowflake = function(isLogo, callbacks, options) {

  // Refactor me!
  this.callbacks = callbacks || {};
  this.options = options || {};

  this.speed = getRandomBetween(SNOWFLAKE_SPEED_MIN, SNOWFLAKE_SPEED_MAX);
  this.size = this.options.displayOnly ? DISPLAY_ONLY_SIZE : getRandomBetween(SNOWFLAKE_SIZE_MIN, SNOWFLAKE_SIZE_MAX);
  this.rotateSpeed = getRandomBetween(SNOWFLAKE_ROTATE_SPEED_MIN, SNOWFLAKE_ROTATE_SPEED_MAX);

  this.isLogo = isLogo;
  var position = this.options.displayOnly ? {x: DISPLAY_ONLY_X, y: DISPLAY_ONLY_Y} :
    getRandomStartingPosition(this.size);
  var rotation = this.options.displayOnly ? 0 : getRandomStartingRotation();

  this.graphics = createGraphics(this.isLogo, this.size, position, rotation);

  this.colliding = false;
  this.markDeleted = false;

  this.graphics.interactive = true;

  var onClick = this.callbacks.onClick;

  if (onClick) {
    this.graphics.on('mousedown', function() {onClick(this)}.bind(this));
    this.graphics.on('touchstart', function() {onClick(this)}.bind(this));
  }

};

Snowflake.prototype.markDeleted = function() {
  this.markDeleted = true;
};

Snowflake.prototype.destroy = function() {
  this.graphics.destroy();
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
 * Refactor me!
 * @returns boolean Whether or not it is newly colliding
 */
Snowflake.prototype.updateCollisions = function(snowflakes) {

  var isNewCollision = false;

  if (this.markDeleted) {
    return isNewCollision;
  }

  var thisPosition = this.getPosition();

  if (thisPosition.y < 0) {
    // Off-screen
    this.colliding = false;
    return isNewCollision;
  }

  if (this.colliding) {
    return isNewCollision;
  }

  var colliding = false;

  for (var i=0; i < snowflakes.length; i++) {

    var snowflake = snowflakes[i];
    var snowflakePosition = snowflake.getPosition();

    // Check it's not this snowflake
    if (snowflake.id !== this.id) {

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
          console.log('Collision', this.id, snowflake.id);
          isNewCollision = true;
        }

        break;
      }
    }
  }

  this.colliding = colliding;

  return isNewCollision;

};


/**
 * We're making a Koch Snowflake - a shape made up of 6 equilateral triangles (60 degs)
 * It's the second shape shown here: http://mathworld.wolfram.com/KochSnowflake.html
 */
function createGraphics(isLogo, size, position, rotation) {

  var graphics;

  if (isLogo) {
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

  graphics.hitArea = new PIXI.Rectangle(0, 0, size, size);

  return graphics;

}

function createRandomLogoSprite(size) {

  var logoId = Math.floor(Math.random() * LOGOS.length);
  var sprite = new PIXI.Sprite.fromImage('img/' + LOGOS[logoId]);

  sprite.width = size;
  sprite.height = size;

  return sprite;

}
