import React from "react";
import Button from 'react-bootstrap/Button';
import { BsPause, BsPlay, BsSkipForward, BsSkipBackward } from "react-icons/bs";
// import { SvgPlay } from './svg/play';
// import { SvgPause } from './svg/pause';
// import { SvgNext } from './svg/next';
// import { SvgPrev } from './svg/prev';
import { Article } from "../classes/classeArticle";
import { Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";

interface ArticleAudioControlsProps {
  isPlaying: boolean;
  onPlayPauseClick: React.Dispatch<React.SetStateAction<boolean>>;
  onPrevClick: () => void;
  onNextClick: () => void;
  nextArticle: Article | null;
  prevArticle: Article | null;
  afficheTitreSuivPrec?: boolean;
}
export const ArticleAudioControls: React.FC<ArticleAudioControlsProps> = ({
  isPlaying,
  onPlayPauseClick,
  onPrevClick,
  onNextClick,
  nextArticle,
  prevArticle,
  afficheTitreSuivPrec = false,
}) => {
  return (<Row
    className="conteneur-btns"
  >
    {/* <div
    className="audio-controls"
    > */}
    {afficheTitreSuivPrec && <Col>
      {prevArticle && prevArticle.titre &&
        <div>
          {prevArticle.titre}
        </div>
      }
    </Col>
    }
    <Col
      className="conteneur-btn"
      >
      {/* <OverlayTrigger
        placement={'top'}
        overlay={prevArticle
          ? <Tooltip className={`tooltip-up`}>
            {prevArticle.titre}
          </Tooltip>
          : <></>
        }
      > */}
        <Button
          // type="button"
          className="prev"
          aria-label="Previous"
          onClick={onPrevClick}
          disabled={!prevArticle}
        >
          <BsSkipBackward />
        </Button>
      {/* </OverlayTrigger> */}
      {/* <div
          className={'titre-article-precedent'}
        >
          {prevArticle && prevArticle.titre}
        </div> */}
    </Col>
    <Col
      className="play-pause conteneur-btn"
    >
      {isPlaying ? (
        <Button
          type="button"
          className="pause"
          onClick={() => onPlayPauseClick(false)}
          aria-label="Pause"
        >
          <BsPause />
        </Button>
      ) : (
        <Button
          type="button"
          className="play"
          onClick={() => onPlayPauseClick(true)}
          aria-label="Play"
        >
          <BsPlay />
        </Button>
      )}
    </Col>
    <Col
      className="conteneur-btn"
    >
      {/* <OverlayTrigger
        placement={'top'}
        overlay={nextArticle
          ? <Tooltip className={`tooltip-up`}>
            {nextArticle.titre}
          </Tooltip>
          : <></>
        }
      > */}
        <Button
          type="button"
          className="next"
          aria-label="Next"
          onClick={onNextClick}
          disabled={!nextArticle}
        >
          <BsSkipForward />
        </Button>
      {/* </OverlayTrigger> */}
      {/* <div
          className={'titre-article-suivant'}
        >
          {nextArticle && nextArticle.titre}
        </div> */}
    </Col>
    {afficheTitreSuivPrec && <Col>
      {nextArticle && nextArticle.titre &&
        <div>
          {nextArticle.titre}
        </div>
      }
    </Col>
    }
  </Row>
  )
};
