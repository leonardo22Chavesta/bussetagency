import { useEffect, useRef } from 'react';

export interface TestimonialItem {
  name: string;
  role: string;
  metric: string;
  quote: string;
  image: string;
  avatar: string;
  avatarPosition: string;
  avatarFit?: string;
  logo: string;
  logoAlt: string;
  alt: string;
  width: number;
  height: number;
  videoUrl: string;
}

interface Props {
  items: TestimonialItem[];
}

const POSTER_SECOND = 60;

function vimeoEmbed(videoUrl: string) {
  const parsed = new URL(videoUrl);
  const id = parsed.pathname.split('/').filter(Boolean).pop();
  const params = new URLSearchParams(parsed.search);
  params.set('title', '0');
  params.set('byline', '0');
  params.set('portrait', '0');
  params.set('dnt', '1');
  params.set('autopause', '1');
  return `https://player.vimeo.com/video/${id}?${params.toString()}#t=${POSTER_SECOND}s`;
}

function postToPlayer(frame: HTMLIFrameElement | null, method: string, value?: string | number) {
  frame?.contentWindow?.postMessage(JSON.stringify({ method, value }), '*');
}

function VideoPlayer({ videoUrl, title }: { videoUrl: string; title: string }) {
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (!frameRef.current || event.source !== frameRef.current.contentWindow) return;
      const raw = event.data;
      const data = typeof raw === 'string' ? safeParse(raw) : raw;
      if (!data || typeof data !== 'object') return;
      const eventName = 'event' in data ? data.event : 'method' in data ? data.method : '';
      if (eventName === 'ready') {
        postToPlayer(frameRef.current, 'setCurrentTime', POSTER_SECOND);
      }
    }

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-brand">
      <iframe
        ref={frameRef}
        className="absolute inset-0 h-full w-full border-0"
        src={vimeoEmbed(videoUrl)}
        title={title}
        loading="lazy"
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        onLoad={() => {
          postToPlayer(frameRef.current, 'addEventListener', 'ready');
          postToPlayer(frameRef.current, 'setCurrentTime', POSTER_SECOND);
        }}
      />
    </div>
  );
}

function safeParse(value: string) {
  try {
    return JSON.parse(value) as { event?: string; method?: string };
  } catch {
    return null;
  }
}

function Stars() {
  return (
    <div className="mb-1 flex gap-0.5 text-brand" aria-label="5 de 5 estrellas">
      {Array.from({ length: 5 }, (_, index) => (
        <svg key={index} width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2.2 14.9 8.7 22 9.5l-5.2 4.7 1.5 7.1L12 17.8 5.7 21.3l1.5-7.1L2 9.5l7.1-.8L12 2.2Z" />
        </svg>
      ))}
    </div>
  );
}

function Person({ item }: { item: TestimonialItem }) {
  return (
    <figcaption className="flex items-center gap-3 border-t border-line/80 bg-white px-5 py-4">
      <img
        src={item.avatar}
        alt=""
        width={56}
        height={56}
        loading="lazy"
        decoding="async"
        style={{ objectPosition: item.avatarPosition || 'center' }}
        className={`h-14 w-14 shrink-0 rounded-full ${item.avatarFit === 'contain' ? 'bg-mist object-contain' : 'object-cover'}`}
      />
      <div className="min-w-0">
        <Stars />
        <p className="text-sm font-semibold leading-snug text-ink">{item.name}</p>
      </div>
    </figcaption>
  );
}

function QuoteBody({ item }: { item: TestimonialItem }) {
  return (
    <div className="relative border-t-[3px] border-accent bg-white px-6 py-6">
      <span className="pointer-events-none absolute left-5 top-3 select-none font-serif text-4xl leading-none text-accent/35" aria-hidden="true">
        “
      </span>
      <blockquote className="testimonial-quote relative z-[1] pt-3 text-sm leading-relaxed text-ink">
        {item.quote}
      </blockquote>
    </div>
  );
}

function VideoCard({ item }: { item: TestimonialItem }) {
  return (
    <figure className="testimonial-card mb-4 break-inside-avoid overflow-hidden rounded-3xl bg-white shadow-[0_18px_40px_-28px_rgba(110,47,66,0.45)] ring-1 ring-accent">
      <VideoPlayer videoUrl={item.videoUrl} title={`Testimonio en video de ${item.name}`} />
      <QuoteBody item={item} />
      <Person item={item} />
    </figure>
  );
}

function ImageCard({ item }: { item: TestimonialItem }) {
  return (
    <figure className="testimonial-card mb-4 break-inside-avoid overflow-hidden rounded-3xl bg-white shadow-[0_18px_40px_-28px_rgba(110,47,66,0.45)] ring-1 ring-accent">
      <QuoteBody item={item} />
      <Person item={item} />
    </figure>
  );
}

/**
 * CSS columns fill top-to-bottom per column.
 * Layout (3 cols):
 *   Col1: Edgar, Toshiba
 *   Col2: Julián (centro), Numalila
 *   Col3: Nathaly, Adan
 */
function masonryOrder(items: TestimonialItem[]) {
  const preferred = [
    'Edgar Casas',
    'Toshiba Ascensores',
    'Dr. Julián Ruiz Anicama',
    'Dani Arrús & Leticia Poirier',
    'Dra. Nathaly Merino',
    'Adan Valerio',
  ];

  const ordered: TestimonialItem[] = [];
  for (const name of preferred) {
    const match = items.find((item) => item.name === name);
    if (match) ordered.push(match);
  }

  for (const item of items) {
    if (!ordered.includes(item)) ordered.push(item);
  }

  return ordered;
}

export default function TestimonialGrid({ items }: Props) {
  const ordered = masonryOrder(items);

  return (
    <div className="mt-12 columns-1 gap-x-4 sm:columns-2 lg:columns-3">
      {ordered.map((item) =>
        item.videoUrl ? <VideoCard key={item.name} item={item} /> : <ImageCard key={item.name} item={item} />,
      )}
    </div>
  );
}
