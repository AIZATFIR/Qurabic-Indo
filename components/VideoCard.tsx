'use client';

import React from 'react';
import { Play, BookOpen, Clock, User } from 'lucide-react';
import { CuratedVideo } from '@/lib/data/curated-videos';
import Link from 'next/link';

interface VideoCardProps {
  video: CuratedVideo;
  onSelectVideo: (video: CuratedVideo) => void;
}

export default function VideoCard({ video, onSelectVideo }: VideoCardProps) {
  const thumbnailUrl = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;

  return (
    <div
      onClick={() => onSelectVideo(video)}
      className="group bg-canvas-surface border border-hairline rounded-3xl overflow-hidden shadow-subtle hover:border-primary/40 hover:shadow-hover transition-all cursor-pointer flex flex-col justify-between font-sans"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-canvas-soft">
        <img
          src={thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Dark Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-primary/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-primary transition-all duration-200 backdrop-blur-sm">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-sm text-white text-[11px] font-medium flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>{video.duration}</span>
        </div>

        {/* Category Tag */}
        <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-canvas-surface/95 backdrop-blur-sm text-primary text-[10px] font-semibold border border-hairline">
          {video.category}
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 sm:p-6 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <h3 className="font-semibold text-base text-ink-primary group-hover:text-primary transition-colors leading-snug line-clamp-2">
            {video.title}
          </h3>

          <div className="flex items-center space-x-1.5 text-xs text-ink-mute">
            <User className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="text-ink-secondary font-medium">{video.speaker}</span>
            <span className="text-ink-mute">&bull;</span>
            <span className="truncate">{video.channel}</span>
          </div>

          <p className="text-xs text-ink-secondary line-clamp-2 leading-relaxed pt-1 font-normal">
            {video.linguisticTakeaway}
          </p>
        </div>

        {/* Bottom Actions */}
        <div className="pt-3 border-t border-hairline flex items-center justify-between gap-2">
          <span className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary group-hover:underline">
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Tonton Video</span>
          </span>

          {video.relatedRootSlug && (
            <Link
              href={`/akar/${video.relatedRootSlug}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center space-x-1 text-[11px] font-medium text-ink-secondary hover:text-primary bg-canvas-soft px-2.5 py-1 rounded-full border border-hairline hover:border-primary/40 transition-colors"
              title={`Buka akar kata ${video.relatedRootSlug}`}
            >
              <BookOpen className="w-3 h-3 text-primary" />
              <span>Akar {video.relatedRootArabic}</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
