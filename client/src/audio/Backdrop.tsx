import React, { useEffect } from "react";

interface BackdropProps {
  activeColor?: string;
  // trackIndex: number;
  isPlaying: boolean;
}
export const Backdrop: React.FC<BackdropProps> = ({
  activeColor,
  isPlaying,
}) => {
// export const Backdrop: React.FC<BackdropProps> = ({ activeColor, trackIndex, isPlaying }) => {
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--active-color",
      activeColor ? activeColor : '#00aeb0',
    );
  }, [activeColor]);

  return <div className={`color-backdrop ${isPlaying ? "playing" : "idle"}`} />;
};

export default Backdrop;
