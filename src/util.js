function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function getGDC(num1, num2) {
  if (num1 % num2 === 0) {
    return num2;
  }
  return getGDC(num2, num1 % num2);
}

function getLCM(num1, num2) {
  return num1 * num2 / getGDC(num1, num2);
}

function getMutiLCM(...nums) {
  return nums.reduce(getLCM);
}

function getProbabilityArr(probabilityObj) {
  const probs = Object.values(probabilityObj);
  const nums = Object.keys(probabilityObj);

  const denominator = probs.map(p => parseInt(1 / p, 10));

  const LCM = getLCM(...denominator);

  const arr = [];
  for (let i = 0; i < probs.length; i += 1) {
    let count = LCM * probs[i];
    while (count > 0) {
      arr.push(nums[i]);
      count -= 1;
    }
  }
  return arr;
}

function getRandomNumBySepcial(probabilityObj) {
  const probArr = getProbabilityArr(probabilityObj);
  return +probArr[getRandom(0, probArr.length)];
}

export default {
  getRandom,
  getGDC,
  getLCM,
  getMutiLCM,
  getRandomNumBySepcial,
};

