import React, { useState, useEffect, useRef, useCallback } from "react";
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import '../styles/styles-audio-player.css';
import RangeSlider from "react-bootstrap-range-slider";
import { Article } from "../classes/classeArticle";
import { ArticleAudioControls } from "./ArticleAudioControls";
import { getAffichageFromSecondes } from "../utils/utilTime";
import { Col, Row } from "react-bootstrap";
// import { ArticleTexte } from "./ArticleTexte";
import { listeArticles } from "../datas/articles/listeArticles";
import { useNavigate } from "react-router";

interface AudioPlayerProps {
  highlightedParagraphe: Article | null;
  articleEnCours: Article;
  articlePrecedent: Article | null;
  articleSuivant: Article | null;
  toNext: (loop?: boolean) => void;
  toPrev: (loop?: boolean) => void;
}
/*
 * Fait sur cette base très utile mais des gros défauts !
 * (chargement du fichier toutes les secondes !!!)
 * Read the blog post here:
 * https://letsbuildui.dev/articles/building-an-audio-player-with-react-hooks
 */
export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  highlightedParagraphe,
  articleEnCours,
  articlePrecedent,
  articleSuivant,
  toNext,
  toPrev,
}) => {
  // State
  const [currentTimeSlider, setCurrentTimeSlider] = useState(0);
  const [trackProgress, setTrackProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);

  const navigate = useNavigate();

  // Destructure for conciseness
  const {
    titre,
    description,
    imagePath,
  } = articleEnCours;

  const intervalRef = useRef<NodeJS.Timer>();

  useEffect(() => {
    const timer = setInterval(() => {
      const cT = articleEnCours.getCurrentTime();
      setCurrentTimeSlider(cT === null ? 0.1234 : cT);
    }, 1000);
    return () => clearInterval(timer);
  }, [articleEnCours]);

  useEffect(() => {
    const funcDurationChange = () => {
      setDuration(articleEnCours.getDuration());
    }
    if (articleEnCours.audioElement) {
      setDuration(d => {
        if (articleEnCours.audioElement) {
          const dur = articleEnCours.audioElement.duration;
          if (isNaN(dur)) {
            return null;
          } else {
            return dur;
          }
        } else {
          return null;
        }
      });
    }
    articleEnCours.addEventListener('durationchange', funcDurationChange);
    return () => {
      articleEnCours.removeEventListener('durationchange', funcDurationChange);
    }
  }, [articleEnCours]);

  useEffect(() => {
    const funcPlay = () => {
      setIsPlaying(true);
    }
    const funcPause = () => {
      // console.log(`pause !!!`);
      setIsPlaying(false);
    }

    articleEnCours.addEventListener('play', funcPlay);
    articleEnCours.addEventListener('pause', funcPause);
    return () => {
      articleEnCours.removeEventListener('play', funcPlay);
      articleEnCours.removeEventListener('pause', funcPause);
    }
  }, [articleEnCours]);

  // useEffect(() => {
  //   console.log(`isPlaying : ${isPlaying}`);
  // }, [
  //   isPlaying,
  // ])

  const onScrub = useCallback((value: number) => {
    // Clear any timers already running
    clearInterval(intervalRef.current);
    articleEnCours.setAudioCurrentTime(value);
    setTrackProgress(value);
  }, [
    articleEnCours,
  ]);

  // const onScrubEnd = () => {
  //   // If not already playing, start
  //   if (!isPlaying) {
  //     setIsPlaying(true);
  //   }
  //   // startTimer();
  // };



  // Handles cleanup and setup when changing tracks
  // useEffect(() => {
  //   setIsPlaying(false);
  //   setTrackProgress(0);
  //   if (isReady.current) {
  //     setIsPlaying(true);
  //   }
  // }, [
  //   setIsPlaying,
  //   setTrackProgress,
  //   audioElementEnCours,
  // ]);

  return (<>
    <div className="audio-player">
      <div className="track-info">
        {imagePath &&
          <img
            className="artwork"
            src={imagePath}
            alt={`${titre}${description ? `, ${description}` : ''}`}
          />
        }
        {/* <h2 className="title">{titre}</h2> */}
        {/* {description &&
          <Row
            className="description-audio"
          >
            <p>
              {description}
            </p>
          </Row>
        } */}
        {highlightedParagraphe &&
          highlightedParagraphe.titre &&
          <Row
            className="titre-highlighted-para"
          >
            <p>
              {highlightedParagraphe.titre}
            </p>
          </Row>
        }
        <ArticleAudioControls
          isPlaying={isPlaying}
          onPrevClick={() => {
            setDuration(null);
            setTrackProgress(0);
            setIsPlaying(false);
            toPrev();
            // if (articlePrecedent) {
            //   navigate(`#${articlePrecedent.numero}`)
            // }
          }}
          onNextClick={() => {
            setDuration(null);
            setTrackProgress(0);
            setIsPlaying(false);
            toNext();
          }}
          onPlayPauseClick={(v) => {
            if (v) {
              articleEnCours.playAudio();
            } else {
              articleEnCours.pauseAudio();
            }
          }}
          nextArticle={articleSuivant}
          prevArticle={articlePrecedent}
        />
        {/* <Row className="audio-time-info">
        </Row> */}
        {isPlaying &&
        <Row className="audio-time-info">
          <Col
            className="input-range"
            sm={6}
          >
            <RangeSlider
              value={articleEnCours.audioElement!.currentTime}
              tooltipLabel={
                (value: number) => {
                  return getAffichageFromSecondes(value === 0.1234
                    ? null
                    : value
                  );
                }
              }
              min={0}
              max={duration ? duration : 100}
              onChange={(e) => onScrub(parseInt(e.target.value))}
              tooltipPlacement='bottom'
              tooltip='on'
            />
          </Col>
          <Col
            className="duration"
            sm={1}
          >
            {getAffichageFromSecondes(duration)}
          </Col>
        </Row>
        }
        {/* <input
          type="range"
          value={trackProgress}
          step="1"
          min="0"
          max={duration ? duration : 1}
          // max={isNaN(articleEnCours.audioElement!.duration) ? 1 : articleEnCours.audioElement!.duration}
          className="progress"
          onChange={(e) => onScrub(parseInt(e.target.value))}
          // onMouseUp={onScrubEnd}
          // onKeyUp={onScrubEnd}
          style={{ background: trackStyling }}
        /> */}
      </div>
      {/* <Backdrop
        // trackIndex={trackIndex}
        // activeColor={color}
        isPlaying={isPlaying}
      /> */}
    </div>
    {/* <Row
      className="texte-article"
    >
      {listeArticles.map((el, i) => {
        return <ArticleTexte
          article={el}
          currentTime={articleEnCours.audioElement!.currentTime}
          setAudioCurrentTime={(t: number) => {
            articleEnCours.setAudioCurrentTime(t);
          }}
          highlightMyself={() => { }}
          pereHighlighted={true}
          niveau={0}
        />
      })
      }
    </Row> */}
  </>
  );
};
