interface Props {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  width: number;
  height: number;
  ctaLabel: string;
  ctaHref: string;
}

export default function ServiceCard({
  title,
  description,
  image,
  imageAlt,
  width,
  height,
  ctaLabel,
  ctaHref,
}: Props) {
  return (
    <article className="flex h-full flex-col rounded-2xl bg-white p-5 shadow-[0_14px_32px_-24px_rgba(110,47,66,0.4)] ring-1 ring-accent/60 transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-22px_rgba(110,47,66,0.45)]">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-mist ring-1 ring-accent/60">
        <img
          src={image}
          alt={imageAlt}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          className="h-8 w-8 object-contain"
        />
      </div>
      <h3 className="text-base font-semibold tracking-tight text-ink sm:text-[1.05rem]">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{description}</p>
      <a
        href={ctaHref}
        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:text-brand-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
      >
        {ctaLabel}
        <span aria-hidden="true">→</span>
      </a>
    </article>
  );
}
