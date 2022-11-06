import { NumeroArticle, Paragraphe, ParagrapheServeur } from "../../../common/types/typesArticles";
import { ARTICLE_STATE_DRAFT } from "../utils/constants/articles";
import { getDateMaxParaArray } from "../utils/utilTime";

export interface SousArticleServeur {
  id_article: number,
  titre: string, // text
  numero: NumeroArticle, // VARCHAR(45)
  paragraphes: ParagrapheServeur[],
  tempsDepart: number,
  audioPath: string | null,
  description: string | null,
  imagePath: string | null,
  pdfPath: string | null,
  dateDerniereModif: Date,
  state: number;
}
export interface ArticleServeur extends SousArticleServeur {
  sousArticles: SousArticleServeur[] | null;
}

export class ObjectWithAudioElement {
  constructor (
    public audioElement: HTMLAudioElement | null = null,
    public titre: string | JSX.Element,
    public description: string | null = null,
  ) {
    this.audioElement = audioElement;
    this.titre = titre;
    this.description = description;
  }
  setAudioCurrentTime(time: number) {
    if (this.audioElement) {
      this.audioElement.currentTime = time;
      this.getCurrentTime();
    }
  }

  pauseAudio() {
    if (this.audioElement) {
      this.audioElement.textTracks;
      this.audioElement.pause();
    }
  }
  pauseAndRembobine() {
    // console.log(`classe : pauseAndRembobine ?`);
    if (this.audioElement) {
      // console.log(`classe : pauseAndRembobine !!!`);
      this.audioElement.currentTime = 0;
      this.audioElement.pause();
    }
  }
  setPlaybackRate(rate: number) {
    // console.log(`classe : playing the audio ??`);
    if (this.audioElement) {
      // console.log(`classe : YES !!! playing the audio`);
      this.audioElement.playbackRate = rate;
    } else {
      // console.log(`classe : NOOOOO !!! not playing the audio`);
    }
  }
  togglePlayPauseAudio() {
    // console.log(`classe : playing the audio ??`);
    if (this.audioElement) {
      // console.log(`classe : YES !!! playing the audio`);
      if (this.audioElement.paused) {
        this.audioElement.play();
      } else {
        this.audioElement.pause();
      }
    } else {
      // console.log(`classe : NOOOOO !!! not playing the audio`);
    }
  }
  playAudio() {
    // console.log(`classe : playing the audio ??`);
    if (this.audioElement) {
      // console.log(`classe : YES !!! playing the audio`);
      this.audioElement.play();
    } else {
      // console.log(`classe : NOOOOO !!! not playing the audio`);
    }
  }
  rembobineAndPlayAudio() {
    if (this.audioElement) {
      this.audioElement.currentTime = 0;
      this.audioElement.play();
    }
  }
  getDuration() {
    if (this.audioElement) {
      return this.audioElement.duration;
    } else {
      return null;
    }
  }
  getCurrentTime() {
    if (this.audioElement) {
      return this.audioElement.currentTime;
    } else {
      return null;
    }
  }

  addEventListener(event: keyof HTMLMediaElementEventMap, _func: () => void) {
    if (this.audioElement) {
      this.audioElement.addEventListener(event, _func);
    }
  }
  removeEventListener(event: keyof HTMLMediaElementEventMap, _func: () => void) {
    if (this.audioElement) {
      this.audioElement.removeEventListener(event, _func);
    }
  }
}
export class SousArticle extends ObjectWithAudioElement {
  constructor (
    public id_article: number,
    public titre: string | JSX.Element,
    public numero: NumeroArticle,
    public paragraphes: Paragraphe[],
    public tempsDepart: number,
    public audioPath: string | null = null,
    public indexSelectedPara: number | null = null,
    public description: string | null = null,
    // public intention: Paragraphe[] | null = null, -> transformé en type intention dans paragraphe
    // public sousArticles: Article[] = [],
    public audioElement: HTMLAudioElement | null = null,
    public imagePath: string | null = null,
    public pdfPath: string | null = null,
    public highlighted: boolean = false,
    public dateDerniereModif: Date = new Date(),
    public state: number = ARTICLE_STATE_DRAFT,
  ) {
    super(
      audioElement,
      titre,
      description,
    )
    this.id_article = id_article;
    this.paragraphes = paragraphes;
    this.tempsDepart = tempsDepart;
    this.dateDerniereModif = getDateMaxParaArray(paragraphes),
    this.numero = numero;
    // this.titre = titre;
    this.indexSelectedPara = indexSelectedPara;
    this.description = description;
    // this.intention = intention;
    this.imagePath = imagePath;
    this.audioPath = audioPath;
    // this.audioElement = audioElement;
    this.pdfPath = pdfPath;
    // this.sousArticles = sousArticles;
    this.highlighted = false;
    this.state = state;
  };

  getAndSetAudioElementIfDontExist() {
    if (!this.audioElement && this.audioPath) {
      this.audioElement = new Audio(this.audioPath);
    }
  }
};


export class Article extends SousArticle {
  constructor(
    public id_article: number,
    public titre: string | JSX.Element,
    public numero: NumeroArticle,
    public paragraphes: Paragraphe[],
    public tempsDepart: number = 0,
    public sousArticles: SousArticle[] | null = null,
    public audioPath: string | null = null,
    public indexSelectedPara: number | null = null,
    public description: string | null = null,
    // public sousArticles: Article[] = [],
    public audioElement: HTMLAudioElement | null = null,
    public imagePath: string | null = null,
    public pdfPath: string | null = null,
    public highlighted: boolean = false,
    public dateDerniereModif: Date = new Date(),
    public state: number = ARTICLE_STATE_DRAFT,
  ) {
    super(
      id_article,
      titre,
      numero,
      paragraphes,
      tempsDepart,
      audioPath,
      indexSelectedPara,
      description,
      audioElement,
      imagePath,
      pdfPath,
      highlighted,
      dateDerniereModif,
      state,
      );
    this.sousArticles = sousArticles;
    this.dateDerniereModif = getDateMaxParaArray(
      paragraphes.concat(sousArticles
        ? sousArticles.flatMap(sA => sA.paragraphes)
        : []
      )
    );
  };
}
