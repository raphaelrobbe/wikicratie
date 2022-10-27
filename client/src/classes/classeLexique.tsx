import React from "react";
import { getWordWithoutAccents } from "../utils/utilString";

/**
 * matchingAccentuatedWords : si rajouter un 's' ne suffit pas
 */
export class GlossaryWord {
  constructor(
    public wordLabel: string,
    public definition: string | JSX.Element,
    public word: string = wordLabel,
    public matchingWords: string[] = [],
    public plurifyable: boolean = true,
    public feminisable: boolean = false,
    ) {
      this.word = word;
      const wordAvecFeminin = [word].concat(feminisable ? `${word}e` : []);
      const wordAvecPluriels = !plurifyable
      ? wordAvecFeminin
      : wordAvecFeminin.concat(wordAvecFeminin.map(el => {
        return `${el}s`;
      }));
    this.matchingWords = wordAvecPluriels
      .concat(matchingWords);
      this.plurifyable = plurifyable;
    this.definition = definition;
  }
  
  isWordMatchingWord(
    wordToFind: string,
    opts: {
      accentsSensitive?: boolean,
      caseSensitive?: boolean,
    } = {
      accentsSensitive: false,
      caseSensitive: false,
    },
  ) {
    const {
      accentsSensitive,
      caseSensitive,
    } = opts;
    const matchingWordsAfterCase = caseSensitive
      ? [...this.matchingWords]
      : this.matchingWords.map(el => el.toLowerCase());
    const wordToFindAfterCase = caseSensitive
      ? wordToFind
      : wordToFind.toLowerCase();
    const matchingWordsAfterAccents = accentsSensitive
      ? [...matchingWordsAfterCase]
      : matchingWordsAfterCase.map(el => getWordWithoutAccents(el));
    const wordToFindAfterAccents = caseSensitive
      ? wordToFindAfterCase
      : getWordWithoutAccents(wordToFindAfterCase);
  
    return matchingWordsAfterAccents.includes(wordToFindAfterAccents);
  }

  getJSXDefinition() {
    if (typeof this.definition === 'string') {
      return <p>{this.definition}</p>;
    } else {
      return this.definition;
    }
  }
}
