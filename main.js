/*
R1: rythme loi exponentielle
R2: couleurs carrés
R3: difficulté facile
R4: difficulté difficile
R5: sons différents
*/




let sequence = [];
let humanSequence = [];
let level = 0;

const startButton = document.querySelector('.js-start');
const GeometricButton = document.querySelector('.geometric-button');
const ExpoButton = document.querySelector('.expo-button');
const KhiSquareButton = document.querySelector('.khisquare-button');
const rademacherButton = document.querySelector('.rademacher-button');
const poissonButton = document.querySelector('.poisson-button');
const info = document.querySelector('.js-info');
const heading = document.querySelector('.js-heading');
const tileContainer = document.querySelector('.js-container');

function resetGame(text) {
  alert(text);
  sequence = [];
  humanSequence = [];
  level = 0;
  startButton.classList.remove('hidden');
  heading.textContent = 'Simon Game';
  info.classList.add('hidden');
  tileContainer.classList.add('unclickable');
}

function humanTurn(level) {
  tileContainer.classList.remove('unclickable');
  info.textContent = `Your turn: ${level} Tap${level > 1 ? 's' : ''}`;
}

function activateTile(color) {
  const tile = document.querySelector(`[data-tile='${color}']`);
  const sound = document.querySelector(`[data-sound='${color}']`);

  tile.classList.add('activated');
  sound.play();

  setTimeout(() => {
    tile.classList.remove('activated');
  }, 300);
}

function playRound(nextSequence) {
  nextSequence.forEach((color, index) => {
    setTimeout(() => {
      activateTile(color);
    }, (index + 1) * 600);
  });
}

function nextStep() {
  const tiles = ['red', 'green', 'blue', 'yellow'];
  const random = tiles[Math.floor(Math.random() * tiles.length)];
  for (let i = 0; i < 10; i++)
    console.log(gaussianRandom(1, 4))
  return random;
}

function nextRound() {
  level += 1;

  tileContainer.classList.add('unclickable');
  info.textContent = 'Wait for the computer';
  heading.textContent = `Level ${level} of 20`;


  const nextSequence = [...sequence];
  nextSequence.push(nextStep());
  playRound(nextSequence);

  sequence = [...nextSequence];
  setTimeout(() => {
    humanTurn(level);
  }, level * 600 + 1000);
}

function handleClick(tile) {
  const index = humanSequence.push(tile) - 1;
  const sound = document.querySelector(`[data-sound='${tile}']`);
  sound.play();

  const remainingTaps = sequence.length - humanSequence.length;

  if (humanSequence[index] !== sequence[index]) {
    resetGame('Oops! Game over, you pressed the wrong tile');
    return;
  }

  if (humanSequence.length === sequence.length) {
    if (humanSequence.length === 20) {
      resetGame('Congrats! You completed all the levels');
      return
    }

    humanSequence = [];
    info.textContent = 'Success! Keep going!';
    setTimeout(() => {
      nextRound();
    }, 1000);
    return;
  }

  info.textContent = `Your turn: ${remainingTaps} Tap${remainingTaps > 1 ? 's' : ''
    }`;
}

function startGame() {
  startButton.classList.add('hidden');
  info.classList.remove('hidden');
  info.textContent = 'Wait for the computer';
  nextRound();
}

startButton.addEventListener('click', startGame);
tileContainer.addEventListener('click', event => {
  const { tile } = event.target.dataset;

  if (tile) handleClick(tile);
});


function geometricDistribution(min, max, prob) {
  var q = 0;
  var p = Math.pow(prob, 1 / (max - min));
  while (true) {
    q = Math.ceil(Math.log(1 - Math.random()) / Math.log(p)) + (min - 1);
    if (q <= max) {
      return q;
    }
  }
}


GeometricButton.addEventListener('click', event => {
  console.log(geometricDistribution(0, 100, 10));
});


function exponentialDistribution(lambda) {
  return -Math.log(1.0 - Math.random()) / lambda;
}

ExpoButton.addEventListener('click', event => {
  console.log(exponentialDistribution(10));
});

function gamma(z) {
  return Math.sqrt(2 * Math.PI / z) * Math.pow((1 / Math.E) * (z + 1 / (12 * z - 1 / (10 * z))), z);
}

function khiSquareDistribution(x, k_) {
  if (x < 0) return 0;
  var k = k_ / 2;
  return 1 / (Math.pow(2, k) * gamma(k))
    * Math.pow(x, k - 1)
    * Math.exp(-x / 2)

};


KhiSquareButton.addEventListener('click', event => {
  console.log(khiSquareDistribution(10, 2));
});


function rademacherDistribution(min, max, skew) {
  let u = 0, v = 0;
  while (u === 0) u = Math.random() //Converting [0,1) to (0,1)
  while (v === 0) v = Math.random()
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)

  num = num / 10.0 + 0.5 // Translate to 0 -> 1
  if (num > 1 || num < 0)
    num = rademacherDistribution(min, max, skew) // resample between 0 and 1 if out of range

  else {
    num = Math.pow(num, skew) // Skew
    num *= max - min // Stretch to fill range
    num += min // offset to min
  }
  return num
}

function gaussianRand() {
  var rand = 0;

  for (var i = 0; i < 6; i += 1) {
    rand += Math.random();
  }

  return rand / 6;
}

function gaussianRandom(start, end) {
  return Math.floor(start + gaussianRand() * (end - start + 1));
}


function customRnd(c) {
  // (1 - Math.random()) to keep [0;1[ instead of ]0;1]
  /*     return 1 - Math.sqrt(1 - Math.random());     */

  // More general method, using parameter c indicating the highest probability point:
  c = c || 0;
  var u = Math.random();
  if (u < c) return Math.sqrt(u * c);
  return 1 - Math.sqrt((1 - u) * (1 - c));
}


rademacherButton.addEventListener('click', event => {
  console.log(customRnd(4));
});

function poissonRand(mean) {

  var L = Math.exp(-mean);
  var p = 1.0;
  var k = 0;

  do {
    k++;
    p *= Math.random();
  } while (p > L);

  k - 1;

  return p;
}

poissonButton.addEventListener('click', event => {
  console.log(poissonRand(2));
});