import { NumeroArticle, Paragraphe } from "../../../common/types/typesArticles";
import { getDateMaxParaArray } from "../utils/utilTime";

export class SousArticle {
  constructor (
    public titre: string |JSX.Element,
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
    ) {
    this.paragraphes = paragraphes;
    this.tempsDepart = tempsDepart;
    this.dateDerniereModif = getDateMaxParaArray(paragraphes),
    this.numero = numero;
    this.titre = titre;
    this.indexSelectedPara = indexSelectedPara;
    this.description = description;
    // this.intention = intention;
    this.imagePath = imagePath;
    this.audioPath = audioPath;
    this.audioElement = audioElement;
    this.pdfPath = pdfPath;
    // this.sousArticles = sousArticles;
    this.highlighted = false;
  };

  getAndSetAudioElementIfDontExist() {
    if (!this.audioElement && this.audioPath) {
      this.audioElement = new Audio(this.audioPath);
    }
  }

  setAudioCurrentTime(time: number) {
    if (this.audioElement) {
      this.audioElement.currentTime = time;
      this.getCurrentTime();
    }
  }

  pauseAudio() {
    if (this.audioElement) {
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
};


export class Article extends SousArticle {
  constructor(
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
  ) {
    super(
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
