import { useState } from 'react';

interface Props {
  videoId: string;
  title: string;
}

export default function VslPlayer({ videoId, title }: Props) {
  const [playing, setPlaying] = useState(false);

  if (playing && videoId) {
    return (
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      className="group absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-4 bg-cover bg-center bg-no-repeat focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-accent"
      style={{ backgroundImage: 'url(/images/video_logo.png)' }}
      onClick={() => setPlaying(true)}
      aria-label={title}
      disabled={!videoId}
    >
      <span className="absolute inset-0 bg-brand/25 transition-colors group-hover:bg-brand/35" aria-hidden="true" />
      <span className="relative z-10 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-accent text-brand shadow-[0_12px_30px_-8px_rgba(198,165,112,0.85)] ring-4 ring-white/80 transition-transform group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path d="M10 7.5v13l11-6.5-11-6.5Z" fill="currentColor" />
        </svg>
      </span>
      <span className="relative z-10 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold tracking-wide text-brand shadow-sm">
        Reproducir video
      </span>
    </button>
  );
}
