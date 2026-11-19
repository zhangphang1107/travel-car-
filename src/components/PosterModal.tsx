import { X } from 'lucide-react';
import { TourPackage } from '../types';
import { ResilientImage } from './ResilientImage';

interface PosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  tour: TourPackage | null;
}

export function PosterModal({ isOpen, onClose, tour }: PosterModalProps) {
  if (!isOpen || !tour) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="poster-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white border border-stone-200 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div>
            <p className="text-xs text-stone-500">
              {tour.subtitle} · {tour.priceText}
            </p>
            <h3 id="poster-modal-title" className="text-lg font-bold text-stone-900 mt-0.5">
              {tour.name} — 景点清单总览
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭弹窗"
            className="w-9 h-9 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {tour.spots.map((spot, idx) => (
            <div
              key={spot.id}
              className="flex items-start gap-4 p-3 rounded-xl bg-stone-50 border border-stone-200/80"
            >
              <ResilientImage
                src={spot.img}
                alt={spot.name}
                className="w-20 h-16 rounded-lg object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <span className="font-semibold text-amber-700 tabular-nums">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{spot.tag}</span>
                  <span aria-hidden="true">·</span>
                  <span>{spot.selected ? '已加入行程' : '未勾选'}</span>
                </div>
                <h4 className="font-bold text-sm text-stone-900 mt-0.5">{spot.name}</h4>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">{spot.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors"
          >
            返回继续定制
          </button>
        </div>
      </div>
    </div>
  );
}
