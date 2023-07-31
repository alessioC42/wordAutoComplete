function probabilityWithStart(start, wordDict, words) {
  let dictCount = {};
  let lenStart = start.length;

  if (lenStart > 0 && start[lenStart - 1] == " ") return [[], []];

  let validWords = words.filter((word) => word.startsWith(start));

  for (let word of validWords) {
    if (word[lenStart] in dictCount) {
      dictCount[word[lenStart]] += wordDict[word];
    } else {
      dictCount[word[lenStart]] = wordDict[word];
    }
  }
  return [
    Object.keys(dictCount).sort((a, b) => dictCount[b] - dictCount[a]),
    validWords,
  ];
}

function getAllFollowingChars(start, words, wordDict) {
  let returnObj = [];

  let [chars, validWords] = probabilityWithStart(start, wordDict, words);

  for (let i = 0; i < chars.length; i++) {
    let char = chars[i];
    let appendObj = {
      l: char,
      p: i,
      f: getAllFollowingChars(start + char, validWords, wordDict),
    };
    returnObj.push(appendObj);
  }
  return returnObj;
}

function generateModel(text, transformtolowercase, removepunctuation, wordcountcb,progresscb) {
  
  if (transformtolowercase) {
    text = text.toLowerCase();
  }
  if (removepunctuation) {
    text = text.replace(/[.,\/#?"!$%\^&\*;:{}\r=\-<>|_`~()«»©]/g, " ");
  }

  text = text.replace(/\n/g, " ");

  let words = text.split(" ");

  words = words.filter((x) => x != "");
  words = words.map((x) => x + " ");
  let wordDict = {};
  for (let word of words) {
    if (word in wordDict) {
      wordDict[word]++;
    } else {
      wordDict[word] = 1;
    }
  }
  words = Object.keys(wordDict);

  wordcountcb("Generating model with a total of " + words.length + " different words");

  //generate JSON
  let returnObj = [];
  let [chars, _x] = probabilityWithStart("", wordDict, words);
  for (let i = 0; i < chars.length; i++) {
    progresscb(Math.round((i/chars.length)*100))
    let char = chars[i];
    let appendObj = {
      l: char,
      p: i,
      f: getAllFollowingChars(char, words, wordDict),
    };
    returnObj.push(appendObj);
  }
  progresscb(100);
  return (returnObj);
}

function getPromise(model, input) {
    word = input;

    for (let i = 0; i < word.length; i++) {
        model = model.find(node => node.l === word[i]);
        if (!model) return word;
        model = model.f;
    }
    while (model && model[0].l !== ' ') {
        model = model.reduce((a, b) => a.p < b.p ? a : b);
        word += model.l;
        model = model.f;
    }
    return word;
}
