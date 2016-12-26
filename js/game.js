var score = 0;
var paused = true;
var jingleSound;

var snowflakes = [];

function onSnowflakeClick(snowflake) {
  console.log('click snowflake!', snowflake);
  updateScore(1);
  snowflake.markDeleted = true;
}

function onLogoSnowflakeClick(snowflake) {
  console.log('click logo snowflake!', snowflake);
  updateScore(-3);
  snowflake.markDeleted = true;
}

function getIndexOfSnowflake(snowflakeId) {

  for (var i=0; i < snowflakes.length; i++) {
    var snowflake = snowflakes[i];
    if (snowflake.id === snowflakeId) {
      return i;
    }
  }

  return -1;

}

function destroySnowflake(snowflake) {

  console.log('Destroy snowflake', snowflake.id);

  var index = getIndexOfSnowflake(snowflake.id);

  snowflakes.splice(index, 1);
  snowflake.destroy();
  snowflake = null;

  console.log('snowflakes now', snowflakes);
}

function updateScore(delta) {
  score += delta;
  scoreElement.innerHTML = score;
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
        console.log('New collisions, play song', snowflake.id, snowflake.collidingWith);
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

function updateIntroOnFrame() {
  introSnowflake.graphics.rotation += 0.01;
}

function destroyDeletedSnowflakes() {

  for (var i=snowflakes.length-1; i >= 0; i--) {
    var snowflake = snowflakes[i];
    if (snowflake.markDeleted) {
      destroySnowflake(snowflake);
    }
  }

}

function isGameComplete() {

  var nonLogoSnowflakesRemaining = false;

  for (var i=0; i < snowflakes.length; i++) {
    var snowflake = snowflakes[i];
    if (!snowflake.isLogo) {
      nonLogoSnowflakesRemaining = true;
      break;
    }
  }

  return !nonLogoSnowflakesRemaining;

}

function checkGameComplete() {

  if (isGameComplete()) {
    paused = true;
    displayResult();
  }

}
