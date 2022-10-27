import React from "react";
import Button from 'react-bootstrap/Button';
import { IoPauseOutline, IoPlayOutline } from "react-icons/io5";

import { SvgPlay } from './svg/play';
import { SvgPause } from './svg/pause';
import { SvgNext } from './svg/next';
import { SvgPrev } from './svg/prev';
import { ToggleButton } from "react-bootstrap";

interface AudioControlsProps {
  isPlaying: boolean;
  onPlayPauseClick: React.Dispatch<React.SetStateAction<boolean>>;
  onPrevClick: () => void;
  onNextClick: () => void;
  isNext: boolean;
  isPrec: boolean;
}
export const AudioControls: React.FC<AudioControlsProps> = ({
  isPlaying,
  onPlayPauseClick,
  onPrevClick,
  onNextClick,
  isNext,
  isPrec,
}) => (
  <div className="audio-controls">
    <>
      <button
        type="button"
        className="prev"
        aria-label="Previous"
        onClick={onPrevClick}
        disabled={!isPrec}
      >
        <SvgPrev />
      </button>
      <div
        className={''}
      >

      </div>
    </>
    {isPlaying ? (
      <div
        // type="button"
        className="pause"
        onClick={() => onPlayPauseClick(false)}
        aria-label="Pause"
      >
        <IoPauseOutline />
      </div>
    ) : (
        <div
        // type="button"
        className="play"
        onClick={() => onPlayPauseClick(true)}
        aria-label="Play"
        >
          <IoPlayOutline />
        {/* <SvgPlay /> */}
      </div>
    )}
    <button
      type="button"
      className="next"
      aria-label="Next"
      onClick={onNextClick}
      disabled={!isNext}
    >
      <SvgNext />
    </button>
  </div>
);
