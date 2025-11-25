let isDefaultFirstLoop = true;
let defaultSheet, walkSheet, runSheet, slowSheet, rightToLeftSheet;
let defaultFrameCount = 11;
let defaultFrameWidth = 391 / 11;
let defaultFrameHeight = 39;
let walkFrameCount = 12;
let walkFrameWidth = 499 / 12;
let walkFrameHeight = 38;
let runFrameCount = 22;
let runFrameWidth = 961 / 23;
let runFrameHeight = 37;
let slowFrameCount = 15;
let slowFrameWidth = 625 / 15;
let slowFrameHeight = 36;
let rightToLeftFrameCount = 11;
let rightToLeftFrameWidth = 435 / 11;
let rightToLeftFrameHeight = 37;
let currentFrame = 0;
let charX = null;
let moveSpeed = 8;
let runSpeed = moveSpeed * 2;
let isFirstLoop = true;
let isRunning = false;
let isSlowing = false;
let isWalking = false;
let isTurning = false;
let isFlipped = false;
let rightToLeftFrame = 0;
let slowFrame = 0;
let bgMusic;


function preload() {
  defaultSheet = loadImage('索尼克move/默認.png');
  walkSheet = loadImage('索尼克move/walk.png');
  runSheet = loadImage('索尼克move/run.png');
  slowSheet = loadImage('索尼克move/slow.png');
  rightToLeftSheet = loadImage('索尼克move/右轉左.png');
  bgMusic = loadSound('索尼克move/music.mp3'); // 請將音樂檔放在此路徑
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(15);
  userStartAudio();
  if (bgMusic) {
    bgMusic.loop();
  }
  charX = width / 2;
}

function draw() {
  background('#006000');
  let x, y, frameToShow;

  // 處理移動
  let moving = false;
  if (isWalking || isRunning || isSlowing) {
    let speed = (isRunning ? runSpeed : moveSpeed);
    if (isFlipped && keyIsDown(65)) { // A鍵
      charX -= speed;
      moving = true;
    } else if (!isFlipped && keyIsDown(68)) { // D鍵
      charX += speed;
      moving = true;
    }
  }
  // 邊界限制
  charX = constrain(charX, 0, width);
  if (isTurning) {
    // 若A鍵已經持續按著，直接進入翻轉動畫，不播放默認動畫
    if (keyIsDown(65) || keyIsDown(97)) { // 'A' or 'a'
      isTurning = false;
      isFlipped = true;
      isWalking = true;
      currentFrame = 0;
    } else {
      // 播放右轉左銜接動畫
      let frameWidth = rightToLeftFrameWidth;
      let frameHeight = rightToLeftFrameHeight;
      x = charX - frameWidth * 0.75;
      y = (height - frameHeight) / 2;
      frameToShow = Math.floor(rightToLeftFrame);
      push();
      translate(x + frameWidth * 1.5, y);
      scale(-1, 1);
      image(
        rightToLeftSheet,
        0, 0,
        frameWidth*1.5, frameHeight*1.5,
        frameToShow * frameWidth, 0,
        frameWidth, frameHeight
      );
      pop();
      rightToLeftFrame += 1;
      if (rightToLeftFrame >= rightToLeftFrameCount) {
        isTurning = false;
        isFlipped = true;
        currentFrame = 0;
      }
      return;
    }
  }
  // 其餘動畫
  let flip = isFlipped ? -1 : 1;
  let flipOffset = isFlipped ? 1 : 0;
  if (isSlowing) {
    let frameWidth = slowFrameWidth;
    let frameHeight = slowFrameHeight;
    x = charX - frameWidth * 0.75;
    y = (height - frameHeight) / 2;
    frameToShow = Math.floor(slowFrame);
    push();
    if (isFlipped) {
      translate(x + frameWidth * 1.5, y);
      scale(-1, 1);
      image(
        slowSheet,
        0, 0,
        frameWidth*1.5, frameHeight*1.5,
        frameToShow * frameWidth, 0,
        frameWidth, frameHeight
      );
    } else {
      image(
        slowSheet,
        x, y,
        frameWidth*1.5, frameHeight*1.5,
        frameToShow * frameWidth, 0,
        frameWidth, frameHeight
      );
    }
    pop();
    slowFrame += 1;
    if (slowFrame >= slowFrameCount) {
      isSlowing = false;
      currentFrame = 0;
    }
    return;
  }
  if (isRunning) {
    let frameWidth = runFrameWidth;
    let frameHeight = runFrameHeight;
    x = charX - frameWidth * 0.75;
    y = (height - frameHeight) / 2;
    frameToShow = Math.floor(currentFrame);
    push();
    if (isFlipped) {
      translate(x + frameWidth * 1.5, y);
      scale(-1, 1);
      image(
        runSheet,
        0, 0,
        frameWidth*1.5, frameHeight*1.5, 
        frameToShow * frameWidth, 0,
        frameWidth, frameHeight
      );
    } else {
      image(
        runSheet,
        x, y,
        frameWidth*1.5, frameHeight*1.5, 
        frameToShow * frameWidth, 0,
        frameWidth, frameHeight
      );
    }
    pop();
    currentFrame += 1;
    if (currentFrame < 18) {
      currentFrame = 18;
    }
    if (currentFrame > 21) {
      currentFrame = 18;
    }
    return;
  }
  if (isWalking) {
    let frameWidth = walkFrameWidth;
    let frameHeight = walkFrameHeight;
    x = charX - frameWidth * 0.75;
    y = (height - frameHeight) / 2;
    frameToShow = Math.floor(currentFrame);
    push();
    if (isFlipped) {
      translate(x + frameWidth * 1.5, y);
      scale(-1, 1);
      image(
        walkSheet,
        0, 0,
        frameWidth*1.5, frameHeight*1.5, 
        frameToShow * frameWidth, 0,
        frameWidth, frameHeight
      );
    } else {
      image(
        walkSheet,
        x, y,
        frameWidth*1.5, frameHeight*1.5, 
        frameToShow * frameWidth, 0,
        frameWidth, frameHeight
      );
    }
    pop();
    currentFrame += 1;
    if (currentFrame >= walkFrameCount) {
      currentFrame = 0;
    }
    return;
  }
  // 默認動畫
  let frameWidth = defaultFrameWidth;
  let frameHeight = defaultFrameHeight;
  x = charX - frameWidth * 0.75;
  y = (height - frameHeight) / 2;
  frameToShow = Math.floor(currentFrame);
  push();
  if (isFlipped) {
    translate(x + frameWidth * 1.5, y);
    scale(-1, 1);
    image(
      defaultSheet,
      0, 0,
      frameWidth*1.5, frameHeight*1.5,
      frameToShow * frameWidth, 0,
      frameWidth, frameHeight
    );
  } else {
    image(
      defaultSheet,
      x, y,
      frameWidth*1.5, frameHeight*1.5,
      frameToShow * frameWidth, 0,
      frameWidth, frameHeight
    );
  }
  pop();
  currentFrame += 1;
  if (isDefaultFirstLoop) {
    if (currentFrame >= defaultFrameCount) {
      isDefaultFirstLoop = false;
      currentFrame = 5; // 只循環第6~11張
    }

  } else {
    if (currentFrame > 10) {
      currentFrame = 5;
    }
  }
}
function keyPressed() {
  if (key === 'Shift') {
    if (!isRunning) {
      isRunning = true;
      isFirstLoop = true;
      currentFrame = 0;
    }
  }
  if (key === 'd' || key === 'D') {
    if (isFlipped) {
      // A轉D，直接切回右向
      isFlipped = false;
      isTurning = false;
      rightToLeftFrame = 0;
    }
    if (!isWalking) {
      isWalking = true;
      currentFrame = 0;
    }
  }
  if (key === 'a' || key === 'A') {
    if (!isFlipped) {
      isFlipped = true;
    }
    if (!isWalking) {
      isWalking = true;
      currentFrame = 0;
    }
  }
}
function keyReleased() {
  if (key === 'Shift') {
    if (isRunning) {
      isRunning = false;
      isSlowing = true;
      slowFrame = 0;
    }
  }
  if (key === 'd' || key === 'D') {
    if (isWalking) {
      isWalking = false;
      isDefaultFirstLoop = true;
      currentFrame = 0;
    }
  }
  if (key === 'a' || key === 'A') {
    if (isWalking) {
      isWalking = false;
      isDefaultFirstLoop = true;
      currentFrame = 0;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (charX === null) charX = width / 2;
}
