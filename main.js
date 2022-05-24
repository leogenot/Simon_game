const startButton = document.querySelector('.js-start');
const easyButton = document.querySelector('.js-start-easy');
const hardButton = document.querySelector('.js-start-hard');

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



var bernoulli = Bernoulli(.7) //difficulty done
var uniform = Uniform(0, 4)//next tile done
var triangle = Triangle(5, 0, 30) // number of levels done 
var binomial = Binomial(10, .5) //rythm done 
var normal = Normal(600, 600) //colors 

bernoulliButton.addEventListener('click', event => {
  console.log(bernoulli.sampleMany(10));
});

uniformButton.addEventListener('click', event => {
  for (let i = 0; i < 10; i++)
    console.log(Math.floor(uniform.sample()));
});
triangleButton.addEventListener('click', event => {
  for (let i = 0; i < 10; i++)
    console.log(Math.floor(triangle.sample()));
});
binomialButton.addEventListener('click', event => {
  for (let i = 0; i < 10; i++)
    console.log(Math.floor(binomial.sample() * 100));
});




normalButton.addEventListener('click', event => {
  const num = Math.abs(normal.sample());
  var long_int = num + '';
  long_int = long_int.replace('.', '');
  long_int = parseInt(long_int);
  long_int = long_int.toFixed(6)


  var long_int_to_string = String(long_int).slice(0, 6);
  var final_number = Number(long_int_to_string);

  final_number = String(final_number)
  final_number = "#" + final_number

  console.log(final_number);



  const tile = document.querySelector(`[data-tile='1']`);
  var generated_color = generateColorFromNormal()
  console.log(generated_color)
  const tile_css = {
    'background-color': generated_color,
    'box-shadow': '0 0 0 1px ' + generated_color + ' inset, 0 0 0 4px ' + generated_color + ' inset, 0 0px 0 0 ' + generated_color + ' , 0 0px 0 0px ' + generated_color + ' , 0 8px 20px 0px ' + generated_color

  };

  for (let [key, val] of Object.entries(tile_css)) {
    tile.style[key] = val;
  }



});


/* GAME FUNCTIONS*/


let sequence = [];
let humanSequence = [];
let level = 0;
let rythm
var binomial



const info = document.querySelector('.js-info');
const heading = document.querySelector('.js-heading');
const tileContainer = document.querySelector('.js-container');



function generateColorFromNormal() {
  var normal = Normal(600, 600) //colors 
  const num = Math.abs(normal.sample());
  var long_int = num + '';
  long_int = long_int.replace('.', '');
  long_int = parseInt(long_int);
  long_int = long_int.toFixed(6)


  var long_int_to_string = String(long_int).slice(0, 6);
  var final_number = Number(long_int_to_string);

  final_number = String(final_number)
  final_number = "#" + final_number

  return final_number
}



function resetGame(text) {
  alert(text);
  sequence = [];
  humanSequence = [];
  level = 0;
  startButton.classList.remove('hidden');
  easyButton.classList.remove('hidden');
  hardButton.classList.remove('hidden');
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

function playRound(nextSequence, rythm) {
  nextSequence.forEach((color, index) => {
    setTimeout(() => {
      activateTile(color);
    }, (index + 1) * rythm);
  });

}

function nextStep() {
  const tiles = ['1', '2', '3', '4'];
  var uniform_tiles = Uniform(0, 4)
  const random = tiles[Math.floor(uniform_tiles.sample())];

  if (heading.textContent == `Level ${level} of 20`) {
    const tile1 = document.querySelector(`[data-tile='1']`);
    var generated_color = generateColorFromNormal()
    console.log(generated_color)
    const tile1_css = {
      'background-color': generated_color,
      'box-shadow': '0 0 0 1px ' + generated_color + ' inset, 0 0 0 4px ' + generated_color + ' inset, 0 0px 0 0 ' + generated_color + ' , 0 0px 0 0px ' + generated_color + ' , 0 8px 20px 0px ' + generated_color

    };

    for (let [key, val] of Object.entries(tile1_css)) {
      tile1.style[key] = val;
    }

    const tile2 = document.querySelector(`[data-tile='2']`);
    var generated_color = generateColorFromNormal()
    console.log(generated_color)
    const tile2_css = {
      'background-color': generated_color,
      'box-shadow': '0 0 0 1px ' + generated_color + ' inset, 0 0 0 4px ' + generated_color + ' inset, 0 0px 0 0 ' + generated_color + ' , 0 0px 0 0px ' + generated_color + ' , 0 8px 20px 0px ' + generated_color

    };

    for (let [key, val] of Object.entries(tile2_css)) {
      tile2.style[key] = val;
    }

    const tile3 = document.querySelector(`[data-tile='3']`);
    var generated_color = generateColorFromNormal()
    console.log(generated_color)
    const tile3_css = {
      'background-color': generated_color,
      'box-shadow': '0 0 0 1px ' + generated_color + ' inset, 0 0 0 4px ' + generated_color + ' inset, 0 0px 0 0 ' + generated_color + ' , 0 0px 0 0px ' + generated_color + ' , 0 8px 20px 0px ' + generated_color

    };

    for (let [key, val] of Object.entries(tile3_css)) {
      tile3.style[key] = val;
    }

    const tile4 = document.querySelector(`[data-tile='4']`);
    var generated_color = generateColorFromNormal()
    console.log(generated_color)
    const tile4_css = {
      'background-color': generated_color,
      'box-shadow': '0 0 0 1px ' + generated_color + ' inset, 0 0 0 4px ' + generated_color + ' inset, 0 0px 0 0 ' + generated_color + ' , 0 0px 0 0px ' + generated_color + ' , 0 8px 20px 0px ' + generated_color

    };

    for (let [key, val] of Object.entries(tile4_css)) {
      tile4.style[key] = val;
    }
  }

  return random;
}

function nextRoundEasy() {

  level += 1;

  tileContainer.classList.add('unclickable');

  info.textContent = 'Wait for the computer';


  console.log(level)
  heading.textContent = `Level ${level} of 10`;
  binomial = Binomial(8, .8) //rythm
  rythm = Math.floor(binomial.sample() * 100);

  while (rythm == 0)
    rythm = Math.floor(binomial.sample() * 100);


  const nextSequence = [...sequence];

  nextSequence.push(nextStep());
  playRound(nextSequence, rythm);

  sequence = [...nextSequence];
  setTimeout(() => {
    humanTurn(level);
  }, level * 600 + 1000);
}


function nextRoundHard() {

  level += 1;

  tileContainer.classList.add('unclickable');

  info.textContent = 'Wait for the computer';

  console.log(level)
  binomial = Binomial(4, .75) //rythm
  rythm = Math.floor(binomial.sample() * 100);
  while (rythm == 0)
    rythm = Math.floor(binomial.sample() * 100);
  heading.textContent = `Level ${level} of 20`;


  const nextSequence = [...sequence];

  nextSequence.push(nextStep());
  playRound(nextSequence, rythm);

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
      if (heading.textContent == `Level ${level} of 10`)
        nextRoundEasy();
      if (heading.textContent == `Level ${level} of 20`)
        nextRoundHard();
    }, 1000);
    return;
  }

  info.textContent = `Your turn: ${remainingTaps} Tap${remainingTaps > 1 ? 's' : ''
    }`;
}

function startGame() {
  startButton.classList.add('hidden');
  easyButton.classList.add('hidden');
  hardButton.classList.add('hidden');
  info.classList.remove('hidden');
  info.textContent = 'Wait for the computer';

  var value = this.value;
  if (value == 0)
    nextRoundEasy();
  if (value == 1) {
    random_level = bernoulli.sample()
    console.log(random_level)
    if (random_level == true)
      nextRoundEasy();
    if (random_level == false)
      nextRoundHard();
  }
  if (value == 2)
    nextRoundHard();
}

startButton.addEventListener('click', startGame, false);
easyButton.addEventListener('click', startGame, false);
hardButton.addEventListener('click', startGame, false);
tileContainer.addEventListener('click', event => {
  const { tile } = event.target.dataset;
  if (tile) handleClick(tile);
});