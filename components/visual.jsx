import { STOCK_IMAGES } from '../lib/visuals';

export function PhotoPanel({ image = STOCK_IMAGES.consultationRoom, eyebrow, title, text, className = '', children }) {
  return <div className={`photo-grain relative min-h-[360px] overflow-hidden rounded-[2.25rem] bg-[#173f42] shadow-2xl shadow-[#173f42]/15 ${className}`}>
    <div className="absolute inset-0 bg-cover bg-center opacity-0" style={{ backgroundImage: `url(${image})` }} />
    <div className="absolute inset-0 bg-gradient-to-br from-[#102a2f]/95 via-[#173f42]/72 to-[#2f8c85]/35" />
    <div className="relative z-10 flex min-h-[360px] flex-col justify-end p-8 text-white sm:p-10">
      {eyebrow && <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#d6e7c7]">{eyebrow}</p>}
      {title && <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white">{title}</h3>}
      {text && <p className="mt-4 max-w-xl text-lg leading-8 text-slate-100">{text}</p>}
      {children}
    </div>
  </div>;
}
