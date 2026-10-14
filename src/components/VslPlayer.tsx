import { useRef, useState } from 'react';

interface Props {
  videoUrl: string;
  title: string;
}

// "#t=0.001" makes mobile browsers (iOS Safari) paint the first frame as the cover.

export default function VslPlayer({ videoUrl, title }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.controls = true;
    video.play();
    setPlaying(true);
  };

  return (
    <>
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full bg-black object-cover"
        src={`${videoUrl}#t=0.001`}
        title={title}
        preload="metadata"
        playsInline
      />
      {!playing && (
        <button
          type="button"
          className="group absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-4 focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-accent"
          onClick={play}
          aria-label={title}
          disabled={!videoUrl}
        >
          <span className="absolute inset-0 bg-brand/25 transition-colors group-hover:bg-brand/35" aria-hidden="true" />
          <span className="relative z-10 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-accent text-brand shadow-[0_12px_30px_-8px_rgba(110,47,66,0.55)] ring-4 ring-white/80 transition-transform group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <path d="M10 7.5v13l11-6.5-11-6.5Z" fill="currentColor" />
            </svg>
          </span>
          <span className="relative z-10 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold tracking-wide text-brand shadow-sm">
            Reproducir video
          </span>
        </button>
      )}
    </>
  );
}
