import React, { useEffect, useRef, useCallback, useMemo } from "react";

interface AudioPlayerHandlerPisteProps {
  _ref: HTMLAudioElement;
  isPlaying: boolean;
  toNextTrack: () => void;
  setTrackProgress: React.Dispatch<React.SetStateAction<number>>;
}
/*
 * Read the blog post here:
 * https://letsbuildui.dev/articles/building-an-audio-player-with-react-hooks
 */
export const AudioPlayerHandlerPiste: React.FC<AudioPlayerHandlerPisteProps> = ({
  _ref,
  isPlaying,
  toNextTrack,
  setTrackProgress,
}) => {
  // Refs
  const intervalRef = useRef<NodeJS.Timer>();

  useEffect(() => {
    console.log(`_ref?.duration = ${_ref.duration}`);
  }, [
    _ref?.duration,
  ])

  const startTimer = useCallback(() => {
    // Clear any timers already running
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (_ref.ended) {
        toNextTrack();
      } else {
        setTrackProgress(_ref.currentTime);
      }
    }, 1000);
  }, [
    _ref,
    setTrackProgress,
    toNextTrack,
  ]);

  // useEffect(() => {
  //   alert(`AudioPlayerHandlerPiste, chargement`);
  //   // return () => {
  //   //   alert(`AudioPlayerHandlerPiste, déchargement`);
  //   // }
  // }, []);


  // useEffect(() => {
  //   console.log(`isPlaying passé à ${isPlaying}`);
  // }, [
  //   isPlaying,
  // ]);

  useEffect(() => {
    console.log(`passe par là`);
    if (isPlaying) {
      _ref.play();
      startTimer();
    } else {
      _ref.pause();
    }
  }, [
    _ref,
    isPlaying,
    startTimer,
  ]);

  useEffect(() => {
    console.log(`startTimer mis à jour`);
  }, [
    startTimer,
  ])



  useEffect(() => {
    // Pause and clean up on unmount
    return () => {
      if (_ref) {
        _ref.pause();
      }
      clearInterval(intervalRef.current);
      // alert(`AudioPlayerHandlerPiste, déchargement`);
    };
  }, [_ref]);

  return <React.Fragment />;
};
