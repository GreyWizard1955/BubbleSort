let canvas;

let base = 360;
let count = base;

let ll = 0.30;
let llD = 0.03;
let mU = 7;

let colors, sort, state, stateCount;
let sounds = true;

let compares = 0;
let swaps = 0;
let cycles = 0;

let i, j, k;
let ox, oy;
let swapped, toSwap;
let gap;
let len;
let begDate, midDate, endDate;
let begTime, midTime, endTime;
let click, ding;

let osc;
let frq = 600;
let fInc = 10;
let fDec = 100;
let aDef = 0.25;
let aMin = 0.005; // 0.010;
let aDec = 0.01; // 0.0025;
let amp = aDef;

function preload() {
  click = loadSound('sounds/click.mp3');
  ding = loadSound('sounds/ding.mp3');
  if (sounds) {
    osc = new p5.Oscillator();
    osc.start();
    osc.freq(frq);
    osc.amp(amp);
  }
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  strokeWeight(8);
  sort = 'Bubble Sort';
  colors = [];
  stateCount = 0;
  state = 'Shuffling';
  for (let i = 0; i < count; i++) {
    colors.push(i / count * base);
  }
  begDate = new Date();
  begTime = begDate.getTime();
}

function draw() {
  background(0);
  if (state === 'Shuffling') {
    if (stateCount >= count) {
      state = 'Sorting';
      stateCount = 0;
      cycles++;
      click.play();
      i = 0;
      j = colors.length - 1;
      osc.freq(frq);
      if (sounds) {
        osc.amp(amp);
      } else {
        osc.stop();
      }
      midDate = new Date();
      midTime = midDate.getTime();
    } else {
      myShuffle(colors);
    }
  } else if (state === 'Sorting') {
    if (i < 0) {
      state = "Shuffle";
      stateCount = 0;
    } else {
      if (i <= j) {
        mySort(colors);
        if (amp > aMin) {
          amp -= aDec;
          if (sounds) {
            osc.amp(amp);
          } else {
            osc.stop();
          }
        }
        i++;
      } else if (i > j) {
        osc.stop();
        if (cycles == count) {
          i = -1;
          j = -1;
          endDate = new Date();
          endTime = endDate.getTime();
          console.log('Shuffle Seconds: ', secondsToHMS((midTime - begTime) / 1000));
          console.log('Sorting Seconds: ', secondsToHMS((endTime - midTime) / 1000));
          console.log('Total   Seconds: ', secondsToHMS((endTime - begTime) / 1000));
          state = 'Done!!!'
          ding.play();
          noLoop();
        } else {
          cycles++;
          click.play();
          frq += fInc;
          amp = aDef;
          if (sounds) {
            osc.stop();
            osc.start();
            osc.freq(frq);
            osc.amp(amp);
          } else {
            osc.stop();
          }
          i = 0;
          j--;
        }
      }
    }
  }
  stateCount++;
  translate(width / 2, height / 2);
  push();
  rotate(-HALF_PI);
  let hw = width / 2;
  let hh = height / 2;
  let m = min(width, height) * 0.4;
  colors.forEach((hu, z, arr) => {
    stroke(hu, 100, 100);
    let t = z / arr.length;
    var tau = t * TAU;
    let x, y;
    if (z == i || z == j) {
      x = cos(tau) * (m + mU);
      y = sin(tau) * (m + mU);
      ox = x * (ll - llD);
      oy = y * (ll - llD);
    } else {
      x = cos(tau) * m;
      y = sin(tau) * m;
      ox = x * ll;
      oy = y * ll;
    }
    line(ox, oy, x, y);
    if (z == 0) {
      stroke(0);
      text('>', x + 25, y);
    }
  });
  pop();

  stroke(0);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(24);
  text(sort, -width / 2.5, -height / 2.2);
  text(state, 0, 0);
  textSize(14);
  lR_w = width / 2.5;
  lR_h = height / 2.6;
  textAlign(LEFT);
  text('Frequency: ', lR_w - 75, lR_h - 80);
  if (state == 'Shuffling') {
    text('Shuffling: ', lR_w - 75, lR_h - 40);
  } else {
    text(' ', lR_w - 75, lR_h - 40);
  }
  text('# of Cycles: ', lR_w - 75, lR_h);
  text('Compares: ', lR_w - 75, lR_h + 20);
  text('Swaps: ', lR_w - 75, lR_h + 40);
  text('S/C (%): ', lR_w - 75, lR_h + 60);
  textAlign(RIGHT);
  if (state == 'Shuffling') {
    text('Random', lR_w + 75, lR_h - 80);
  } else {
    text(frq, lR_w + 75, lR_h - 80);
  }
  if (state == 'Shuffling') {
    text(stateCount, lR_w + 75, lR_h - 40)
  } else {
    text(' ', lR_w + 75, lR_h - 40);
  }
  text(cycles, lR_w + 75, lR_h);
  text(compares, lR_w + 75, lR_h + 20);
  text(swaps, lR_w + 75, lR_h + 40);
  if (compares > 0) {
    text(nf((swaps / compares) * 100, 0, 4) + '%', lR_w + 75, lR_h + 60);
  }
}

function myShuffle(arr) {
  var i = floor(random(arr.length));
  var j = floor(random(arr.length));
  swap(arr, i, j);
  if (sounds) {
    osc.freq(floor(random(80, 300) + 1) * 5);
  } else {
    osc.stop();
  }
}

function bubbleSort(arr) {
  compares++;
  if (arr[i] > arr[i + 1]) {
    swap(arr, i, i + 1);
    swaps++;
  }
  return arr;
}

function keypressed() {
  if (key = 'S') {
    sounds = !sounds;
  }
}

function mySort(arr) {
  bubbleSort(arr);
  // BubbleSort(arr);
  // noLoop();
}

function swap(arr, i, j) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function delay(ms) {
  var cur_d = new Date();
  var cur_ticks = cur_d.getTime();
  var ms_passed = 0;
  while (ms_passed < ms) {
    // console.log('IN DELAY...');
    var d = new Date(); // Possible memory leak?
    var ticks = d.getTime();
    ms_passed = ticks - cur_ticks;
    // d = null; // Prevent memory leak?
  }
}

function secondsToHMS(secs) {
  let sPd = 86400;
  let sPh = 3600;
  let sPm = 60;
  var d = Math.floor(secs / sPd);
  var h = Math.floor(secs % sPd / sPh);
  var m = Math.floor(secs % sPd % sPh / sPm);
  var s = Math.floor(secs % sPd % sPh % sPm);
  var l = (secs % sPd % sPh % sPm) - s;

  var dDisplay = padStr(d, '0', 2, true);
  var hDisplay = padStr(h, '0', 2, true);
  var mDisplay = padStr(m, '0', 2, true);
  var sDisplay = padStr(s, '0', 2, true);
  var lDisplay = nf(l, 0, 3).substring(2, 5);
  return 'd' + dDisplay + ':h' + hDisplay + ':m' + mDisplay + ':s' + sDisplay + '.' + lDisplay;
}

function padStr(s, pad, len, left) {
  var p = "";
  for (var i = 0; i < len; i++) {
    p += pad;
  }
  if (left == true) {
    p += s;
    s = p.substring(p.length - len);
  } else {
    s += p;
    s = s.substring(0, len)
  };
  return s;
}

// Original sort
function BubbleSort(arr) {
  for (var i = 0; i < arr.length; i++) {
    for (var j = i; j < arr.length; j++) {
      if ((arr[i] > arr[j])) {
        swap(arr, i, j);
      }
    }
  }
  return arr;
}
