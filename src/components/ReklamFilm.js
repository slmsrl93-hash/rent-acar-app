import React, { useRef } from 'react';

export const FILM_CHAPTERS = [
  { time: 0, label: 'Açılış' },
  { time: 6.4, label: 'Filo' },
  { time: 18.2, label: 'Teslimat' },
  { time: 30.6, label: 'Donanım' },
  { time: 35.6, label: 'Hemen kirala' },
];

const ReklamFilm = ({ tone = 'light' }) => {
  const videoRef = useRef(null);

  const seek = (time) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = time;
    const play = video.play();
    if (play && typeof play.catch === 'function') play.catch(() => {});
  };

  const buttonClass = tone === 'dark'
    ? 'bg-white/10 text-white border border-white/30 hover:bg-white/20'
    : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50';

  return (
    <div id="film">
      <video
        ref={videoRef}
        className="w-full rounded-2xl bg-black shadow-2xl"
        src="/reklam/rentcar-reklam.mp4"
        poster="/reklam/poster.jpg"
        controls
        playsInline
        preload="metadata"
      />
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {FILM_CHAPTERS.map((chapter) => (
          <button
            key={chapter.label}
            type="button"
            onClick={() => seek(chapter.time)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${buttonClass}`}
          >
            {chapter.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReklamFilm;
