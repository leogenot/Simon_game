/*
R1: rythme loi exponentielle entre 900 lent et 100 rapide
R2: couleurs carrés
R3: difficulté facile
R4: difficulté difficile
R5: sons différents
*/


const startButton = document.querySelector('.js-start');
const GeometricButton = document.querySelector('.geometric-button');
const ExpoButton = document.querySelector('.expo-button');
const KhiSquareButton = document.querySelector('.khisquare-button');
const rademacherButton = document.querySelector('.rademacher-button');
const poissonButton = document.querySelector('.poisson-button');




const bernoulliButton = document.querySelector('.bernoulli-button');
const uniformButton = document.querySelector('.uniform-button');
const triangleButton = document.querySelector('.triangle-button');
const binomialButton = document.querySelector('.binomial-button');
const normalButton = document.querySelector('.normal-button');


/* RANDOM DISTRIBUTIONS */



var DistribSequence = function (n) {
  var result = [];
  for (var i = 0; i < n; i++) {
    result[i] = i;
  }
  return result;
};

function Bernoulli(p) {
  let type = "bernoulli";
  function sample() {
    var r = Math.random();
    if (r < p) {
      return true;
    } else {
      return false;
    }
  };

  function sampleMany(count) {
    return DistribSequence(count).map(sample);
  };

  function densityAt(value) {
    if (value) {
      return p;
    } else {
      return 1 - p;
    }
  };
  return {
    sample: sample,
    sampleMany: sampleMany,
    densityAt: densityAt
  };
}



function Uniform(start, end) {
  let type = "uniform";

  var length = end - start;

  function sample() {
    var r = Math.random() * length;
    return start + r;
  };

  function sampleMany(count) {
    return DistribSequence(count).map(sample);
  };

  function densityAt(value) {
    if (value < start) { return 0; }
    if (value >= end) { return 0; }
    return 1 / length;
  };
  return {
    sample: sample,
    sampleMany: sampleMany,
    densityAt: densityAt
  };
}

function Triangle(min, mode, max) {
  let type = "triangle";

  var l1 = mode - min;
  var l2 = max - mode;
  var h = 2 / (l1 + l2);
  var slope1 = h / l1;
  var slope2 = h / l2;

  function densityAt(value) {
    if (value <= min) return 0;
    if (value >= max) return 0;
    if (value > min && value <= mode) {
      return slope1 * (value - min);
    }
    if (value > mode && value < max) {
      return slope2 * (max - value);
    }
    return null;
  }

  var uniform1 = Uniform(min, max);
  var uniform2 = Uniform(0, densityAt(mode));

  function sample() {
    var r1 = uniform1.sample();
    var r2 = uniform2.sample();
    while (r2 > densityAt(r1)) {
      r1 = uniform1.sample();
      r2 = uniform2.sample();
    }
    return r1;
  };

  function sampleMany(count) {
    return DistribSequence(count).map(sample);
  };

  return {
    densityAt: densityAt,
    sample: sample,
    sampleMany: sampleMany
  };


}


var factorial = function (n) {
  var result = 1;
  for (var i = 2; i <= n; i++) {
    result = result * i;
  }
  return result;
};

var choose = function (n, k) {
  var denom = factorial(k) * factorial(n - k);
  return factorial(n) / denom;
};

function Binomial(trials, rate) {

  let type = "Binomial"

  function densityAt(value) {
    var a = choose(trials, value);
    var b = Math.pow(rate, value);
    var c = Math.pow(1 - rate, trials - value);
    return a * b * c;
  }

  function sample() {
    var r = Math.random();
    var sum = 0;
    var d = 0;
    for (var i = 0; i <= trials; i++) {
      d = densityAt(i);
      sum = sum + d;
      if (r <= sum) { return i; }
    }
  };

  function sampleMany(count) {
    return DistribSequence(count).map(sample);
  };

  return {
    densityAt: densityAt,
    sample: sample,
    sampleMany: sampleMany
  };

}


let twoPi = Math.PI * 2;

function Normal(mean, stdv) {
  let type = "Normal"
  let variance = stdv * stdv;
  let c = 1 / Math.sqrt(twoPi * variance);
  let twoV = 2 * variance;

  function densityAt(x) {
    let a = (x - mean) * (x - mean);
    let e = a / twoV;
    return c * Math.exp(-e);
  }

  function sample() {
    let u1 = Math.random();
    let u2 = Math.random();
    let r = Math.sqrt(-2 * Math.log(u1)) * Math.cos(twoPi * u2);
    return r * stdv + mean;
  };

  function sampleMany(count) {
    return DistribSequence(count).map(sample);
  };


  return {
    densityAt: densityAt,
    sample: sample,
    sampleMany: sampleMany
  };

}



var bernoulli = Bernoulli(.7) //difficulty
var uniform = Uniform(0, 4)
var triangle = Triangle(0, 0, 4) //sounds
var binomial = Binomial(10, .4) //rythm
var normal = Normal(600, 600) //colors

bernoulliButton.addEventListener('click', event => {
  console.log(bernoulli.sampleMany(10));
});

uniformButton.addEventListener('click', event => {
  for(let i = 0; i < 10; i++)
    console.log(Math.floor(uniform.sample()));
});
triangleButton.addEventListener('click', event => {
  for(let i = 0; i < 10; i++)
    console.log(Math.floor(triangle.sample()));
});
binomialButton.addEventListener('click', event => {
  for(let i = 0; i < 10; i++)
    console.log(Math.floor(binomial.sample() * 100));
});
normalButton.addEventListener('click', event => {
  console.log(normal.sampleMany(100));
});



/* GAME FUNCTIONS*/


let sequence = [];
let humanSequence = [];
let level = 0;
let rythm = Math.floor(binomial.sample() * 100);  //new rythm when page loads
console.log(rythm)



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
  }, 100);
}

function playRound(nextSequence) {
  nextSequence.forEach((color, index) => {
    setTimeout(() => {
      activateTile(color);
    }, (index + 1) * rythm);
  });

}

function nextStep() {
  const tiles = ['1', '2', '3', '4'];
  const random = tiles[Math.floor(triangle.sample())];
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