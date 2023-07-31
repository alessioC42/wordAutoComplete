import argparse
import collections
from string import punctuation
from time import time
from tqdm import tqdm
import json

def propability_with_start(start: str, word_dict: dict, words: list[str]):
    dict_count = {}
    len_start = len(start)

    if (len(start)>0 and start[-1] == " "): return ([], [])

    validWords = list(filter(lambda x: x.startswith(start), words))

    for word in validWords:
        if word[len_start] in dict_count:
            dict_count[word[len_start]] += word_dict[word]
        else:
            dict_count[word[len_start]] = word_dict[word]
    return (sorted(dict_count, key=lambda x: dict_count[x], reverse=True), validWords)


def main(textpath, outpath):
    with open(textpath, "r") as textfile:
        text = textfile.read().lower()

        #remove punctation and \n
        text = text.translate(str.maketrans('', '', punctuation+"«»©"))
        text = text.replace("\n", " ")

        #split in words
        words = text.split(" ")
        
        words = [x for x in words if x != '']
        words = list(map(lambda x: x+" ", words))
        word_dict = collections.Counter(words)
        words = list(word_dict.keys())

        print("Generating model with a total of "+str(len(words))+" different words")
    
    #generate JSON

    with open(outpath, "w") as outfile:
        returnObj = []
        chars, _x = propability_with_start("", word_dict, words)
        for char, i in tqdm(zip(chars, range(len(chars)))):
            appendObj = {
                "l": char,
                "p": i,
                "f": getAllFolowingChars(char, words, word_dict)
            }
            returnObj.append(appendObj)

        outfile.write(json.dumps(returnObj))

def getAllFolowingChars(start, words, word_dict):
    returnObj = []

    chars, validWords = propability_with_start(start, word_dict, words)

    for char, i in zip(chars, range(len(chars))):
        appendObj = {
            "l": char,
            "p": i,
            "f": getAllFolowingChars(start+char, validWords, word_dict)
        }
        returnObj.append(appendObj)
    return returnObj

def sort_dict(d, probabilities):
    sorted_dict = {}
    for letter in probabilities:
        if letter in d:
            sorted_dict[letter] = sort_dict(d[letter], probabilities)
    return sorted_dict


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('-t', '--text', help='input text as relative path')
    parser.add_argument('-o', '--out', help='output file (json)', default="output.json")
    args = parser.parse_args()
    starttime = time()
    
    main(args.text, args.out)

    print("\n time: "+str((time()-starttime))+" s")
