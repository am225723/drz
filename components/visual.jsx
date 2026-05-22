import { STOCK_IMAGES } from '../lib/visuals';

export function PhotoPanel({ image = STOCK_IMAGES.consultationRoom, eyebrow, title, text, className = '', children }) {
  return <div className={`photo-grain relative min-h-[360px] overflow-hidden rounded-[2.25rem] bg-slate-950 shadow-2xl shadow-slate-900/15 ${className}`}>
    <div className="absolute inset-0 bg-cover bg-center opacity-100" style={{ backgroundImage: `url(${image})` }} />
    <div className="absolute inset-0 bg-gradient-to-br from-black/58 via-black/28 to-transparent" />
    <div className="relative z-10 flex min-h-[360px] flex-col justify-end p-8 text-white sm:p-10">
      {eyebrow && <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/85">{eyebrow}</p>}
      {title && <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white">{title}</h3>}
      {text && <p className="mt-4 max-w-xl text-lg leading-8 text-slate-100">{text}</p>}
      {children}
    </div>
  </div>;
}
