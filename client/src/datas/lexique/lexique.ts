import { GlossaryWord } from "../../classes/classeLexique";
import { LettreAlphabet } from "../../../../common/types/typesString";
import { lettresAlphabet } from "../alphabet";
import { defAristocrate, defAristocratique, defAssembleeConstituante } from "./lexiqueA";
import { defCitoyenFrancais, defCoercition, defConstituant } from "./lexiqueC";
import { defDDHC } from "./lexiqueD";
import { defElection } from "./lexiqueE";
import { getWordWithoutAccents } from "../../utils/utilString";

export const glossaire: GlossaryWord[] = [
  defAristocrate,
  defAristocratique,
  defAssembleeConstituante,
  defCitoyenFrancais,
  defCoercition,
  defConstituant,
  defDDHC,
  defElection,
];

const getWordsStartingWith = (letterOrLetters: string | string[], wordList = glossaire) => {
  let _ret: GlossaryWord[] = [];
  const lettersArray = Array.isArray(letterOrLetters)
    ? letterOrLetters
    : [letterOrLetters];
  for (let i = 0; i < lettersArray.length; i += 1) {
    const letter = lettersArray[i];
    const matchingWords = wordList
      .filter(w => {
        if (w.word.length > 0) {
          return getWordWithoutAccents(w.word[0]).toLowerCase() === letter;
        } else {
          return false;
        }
      })
      .sort((a, b) => {
        if (a.word < b.word) {
          return - 1;
        } else {
          return 1;
        }
      });
    _ret = _ret.concat(matchingWords);
  }
  return _ret;
}

export const getLexiqueByLetter = (wordList = glossaire) => {
  // console.log(`calcul du lexique par lettre`);

  const lexique: { [x: LettreAlphabet]: GlossaryWord[] } = {};

  for (let i = 0; i < lettresAlphabet.length; i += 1) {
    const lettre = lettresAlphabet[i];
    const wordListStarting = getWordsStartingWith(lettre, wordList)
    if (wordListStarting.length > 0) {
      lexique[lettre] = [...wordListStarting];
    }
  }
  // console.log(`lexique : ${JSON.stringify(lexique)}`);

  return lexique;
}

// export const glossaireParLettre = getLexiqueByLetter();
