import { STOCK_IMAGES } from '../lib/visuals';

export function PhotoPanel({ image = STOCK_IMAGES.consultationRoom, eyebrow, title, text, className = '', children }) {
  return <div className={`photo-grain relative min-h-[360px] overflow-hidden rounded-[2.25rem] bg-slate-950 shadow-2xl shadow-slate-900/15 ${className}`}>
    <img src={image} alt="" aria-hidden="true" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-br from-black/72 via-black/36 to-black/10" />
    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/35 to-transparent" />
    <div className="relative z-10 flex min-h-[360px] flex-col justify-end p-6 text-white sm:p-10">
      <div className="max-w-2xl rounded-[1.75rem] border border-white/15 bg-black/28 p-5 shadow-2xl backdrop-blur-[2px] sm:p-6">
        {eyebrow && <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/90 drop-shadow">{eyebrow}</p>}
        {title && <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white drop-shadow-lg">{title}</h3>}
        {text && <p className="mt-4 max-w-xl text-lg leading-8 text-white/95 drop-shadow">{text}</p>}
        {children}
      </div>
    </div>
  </div>;
}
