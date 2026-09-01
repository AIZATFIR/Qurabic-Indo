'use client';

import React, { useEffect } from 'react';
import { X, ExternalLink, BookOpen, User, Compass } from 'lucide-react';
import { CuratedVideo } from '@/lib/data/curated-videos';
import Link from 'next/link';

interface VideoTheaterModalProps {
  video: CuratedVideo | null;
  onClose: () => void;
}

export default function VideoTheaterModal({ video, onClose }: VideoTheaterModalProps) {
  useEffect(() => {
    if (!video) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [video, onClose]);

  if (!video) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overscroll-contain font-sans">
      {/* Backdrop Dismiss */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Theater Container */}
      <div className="relative w-full max-w-4xl bg-canvas-surface border border-hairline rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="px-5 py-3.5 border-b border-hairline flex items-center justify-between bg-canvas-surface gap-3">
          <div className="flex items-center space-x-2.5 min-w-0">
            <span className="px-2.5 py-0.5 rounded-full bg-primary-subdued text-primary text-[11px] font-semibold tracking-wide shrink-0">
              {video.category}
            </span>
            <h3 className="font-semibold text-sm sm:text-base text-ink-primary truncate font-sans">
              {video.title}
            </h3>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <a
              href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-full text-ink-mute hover:text-ink-primary hover:bg-canvas-soft transition-colors"
              title="Buka di YouTube"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-ink-mute hover:text-ink-primary hover:bg-canvas-soft transition-colors"
              title="Tutup (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Embed Iframe (16:9 Aspect Ratio) */}
        <div className="relative w-full aspect-video bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        </div>

        {/* Bottom Details Panel with Linguistic Takeaway */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 bg-canvas-surface overscroll-contain">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-hairline pb-3">
            <div className="flex items-center space-x-1.5 text-xs sm:text-sm text-ink-secondary">
              <User className="w-4 h-4 text-primary shrink-0" />
              <span className="font-semibold text-ink-primary">{video.speaker}</span>
              <span className="text-ink-mute">&bull;</span>
              <span className="text-ink-mute">{video.channel}</span>
            </div>

            {video.relatedRootSlug && (
              <Link
                href={`/akar/${video.relatedRootSlug}`}
                onClick={onClose}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary hover:underline bg-primary-subdued px-3 py-1 rounded-full self-start sm:self-auto transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Bedah Akar Kata {video.relatedRootArabic} ({video.relatedRootSlug})</span>
              </Link>
            )}
          </div>

          {/* Intisari Pelajaran Kebahasaan */}
          <div className="p-4 rounded-2xl bg-canvas-soft border border-hairline space-y-1.5">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-ink-primary uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 text-primary" />
              <span>Intisari Pelajaran:</span>
            </div>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-sans font-normal">
              {video.linguisticTakeaway}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
