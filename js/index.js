var SNOWFLAKE_COLOUR = 0xFFFFFF;
var SNOWFLAKE_RATE_DEFAULT = 30;

var SNOWFLAKE_SIZE_MIN = 30;
var SNOWFLAKE_SIZE_MAX = 60;

var SNOWFLAKE_SPEED_MIN = 0.75;
var SNOWFLAKE_SPEED_MAX = 2;

var SNOWFLAKE_ROTATE_SPEED_MIN = -0.025;
var SNOWFLAKE_ROTATE_SPEED_MAX = 0.025;

var LOGOS = ['sbrowser5-simple.svg', 'bubble.svg', 'podle-simple.svg', 'snapwat-simple.svg'];
var LOGOS_RATIO = 0.25;

var snowflakeRate = SNOWFLAKE_RATE_DEFAULT;

var width = window.innerWidth;
var height = window.innerHeight;
var container = document.getElementById('container');
var snowflakeContainer = document.getElementById('snowflake');
var scoreElement = document.getElementById('score');
var introElement = document.getElementById('intro');
var resultElement = document.getElementById('result');
var startButton = document.getElementById('intro-start');
var replayButton = document.getElementById('result-retry');

var renderer = new PIXI.autoDetectRenderer(width, height, {transparent: false, antialias: true});
var stage = new PIXI.Container();

var introRenderer = new PIXI.autoDetectRenderer(150, 150, {transparent: false, antialias: true});
var introSnowflakeStage = new PIXI.Container();

var introSnowflake;

function init() {

  renderer.backgroundColor = 0x987fff;
  introRenderer.backgroundColor = 0x987fff;

  container.style.width = width;
  container.style.height = height;
  container.appendChild(renderer.view);

  setupSnowflakes();

  snowflakeContainer.appendChild(introRenderer.view);

  introSnowflake = new Snowflake(null, {displayOnly: true});
  introSnowflakeStage.addChild( introSnowflake.graphics );

  jingleSound = new Howl({
    src: ['audio/jingle.mp3', 'audio/jingle.wav']
  });
  jingleSound.volume(0.5);

  startButton.addEventListener('click', function() {
    introElement.style.display = 'none';
    container.style.display = 'block';
    paused = false;
  });

  replayButton.addEventListener('click', function() {
    for (var i=snowflakes.length; i >= 0; i--) {
      var snowflake = snowflakes[i];
      destroySnowflake(snowflake);
    }
    snowflakes = [];
    setupSnowflakes();
    resultElement.style.display = 'none';
    paused = false;
  });

  animate();

}

function setupSnowflakes() {

  for (var i=0; i < snowflakeRate; i++) {
    var snowflake = new Snowflake({onClick: onSnowflakeClick});
    snowflake.id = i;
    stage.addChild( snowflake.graphics );
    snowflakes.push( snowflake );
  }

}

function displayResult() {
  resultElement.style.display = 'block';
}


function animate() {
  // start the timer for the next animation loop
  requestAnimationFrame(animate);

  if (paused) {

    updateIntroOnFrame();

    introRenderer.render(introSnowflakeStage);

  } else {

    updateOnFrame();
    destroyDeletedSnowflakes();
    checkGameComplete();

    renderer.render(stage);
  }

}

init();
