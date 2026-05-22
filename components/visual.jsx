import { STOCK_IMAGES } from '../lib/visuals';

export function PhotoPanel({ image = STOCK_IMAGES.consultationRoom, eyebrow, title, text, className = '', children }) {
  return <div className={`photo-grain relative min-h-[360px] overflow-hidden rounded-[2.25rem] bg-slate-950 shadow-2xl shadow-slate-900/15 ${className}`}>
    <img src={image} alt="" aria-hidden="true" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-br from-black/35 via-black/20 to-black/10" />
    <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/85 via-black/55 to-transparent" />
    <div className="relative z-10 flex min-h-[360px] flex-col justify-end p-5 text-white sm:p-8 lg:p-10">
      <div className="max-w-3xl rounded-[1.75rem] border border-white/20 bg-black/70 p-5 shadow-2xl ring-1 ring-black/40 backdrop-blur-[1px] sm:p-7">
        {eyebrow && <p className="text-sm font-bold uppercase tracking-[0.22em] text-white drop-shadow-lg">{eyebrow}</p>}
        {title && <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white drop-shadow-lg">{title}</h3>}
        {text && <p className="mt-4 max-w-2xl text-lg leading-8 text-white drop-shadow-lg">{text}</p>}
        {children}
      </div>
    </div>
  </div>;
}
