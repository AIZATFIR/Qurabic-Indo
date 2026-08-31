'use client';

import React, { useState } from 'react';
import { Sparkles, Video, Smartphone, Search, BookOpen, Layers, ArrowLeft } from 'lucide-react';
import { CURATED_VIDEOS, CuratedVideo, VIDEO_CATEGORIES } from '@/lib/data/curated-videos';
import VideoCard from '@/components/VideoCard';
import VideoTheaterModal from '@/components/VideoTheaterModal';
import KalaamShowcaseFrame from '@/components/KalaamShowcaseFrame';
import Link from 'next/link';

export default function RekomendasiPage() {
  const [activeTab, setActiveTab] = useState<'videos' | 'apps'>('videos');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTheaterVideo, setActiveTheaterVideo] = useState<CuratedVideo | null>(null);

  // Filter videos based on category and search query
  const filteredVideos = CURATED_VIDEOS.filter((v) => {
    const matchesCat = selectedCategory === 'Semua' || v.category === selectedCategory;
    const matchesQuery =
      !searchQuery.trim() ||
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.linguisticTakeaway.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 font-sans pb-24">
      
      {/* Top Header Bar with Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-sm text-ink-mute hover:text-primary transition-colors font-medium font-sans"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>

        <span className="text-xs text-primary font-semibold font-sans px-3 py-1 bg-primary-subdued rounded-full">
          Eksplorasi Tambahan Ilmu
        </span>
      </div>

      {/* Hero Banner for Rekomendasi */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-primary-subdued text-primary text-xs font-semibold">
          <Sparkles className="w-4 h-4" />
          <span>Kurasi Sumber Belajar &amp; Bedah Al-Qur&apos;an</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-light text-ink-primary tracking-tight font-sans">
          Inspirasi &amp; Rekomendasi <br />
          <span className="font-semibold text-primary">Tadabbur Bahasa Qur&apos;ani</span>
        </h1>

        <p className="text-sm sm:text-base text-ink-secondary leading-relaxed font-sans max-w-2xl mx-auto">
          Kumpulan kajian video pilihan yang membedah keajaiban kata, ayat, dan surat, serta kurasi sarana belajar harian untuk memperkaya pemahaman Anda.
        </p>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex justify-center">
        <div className="p-1.5 bg-canvas-soft border border-hairline rounded-2xl flex items-center space-x-1.5 shadow-subtle">
          <button
            onClick={() => setActiveTab('videos')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all font-sans ${
              activeTab === 'videos'
                ? 'bg-canvas-surface text-primary shadow-subtle'
                : 'text-ink-mute hover:text-ink-primary'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Kajian Video Pilihan</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-subdued text-primary font-bold">
              {CURATED_VIDEOS.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('apps')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all font-sans ${
              activeTab === 'apps'
                ? 'bg-canvas-surface text-primary shadow-subtle'
                : 'text-ink-mute hover:text-ink-primary'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Aplikasi Belajar Harian (Kalaam)</span>
          </button>
        </div>
      </div>

      {/* TAB 1: CURATED VIDEOS */}
      {activeTab === 'videos' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Filter Bar & Search */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-canvas-surface p-4 rounded-2xl border border-hairline shadow-subtle">
            
            {/* Category Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {VIDEO_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap font-sans ${
                    selectedCategory === cat
                      ? 'bg-primary text-white shadow-subtle'
                      : 'bg-canvas-soft text-ink-mute hover:text-ink-primary hover:bg-canvas-surface border border-hairline/60'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-mute" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari video, ustadz, tema..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-canvas-soft border border-hairline text-xs sm:text-sm text-ink-primary placeholder:text-ink-mute focus:outline-none focus:ring-2 focus:ring-primary/20 font-sans"
              />
            </div>
          </div>

          {/* Videos Grid */}
          {filteredVideos.length === 0 ? (
            <div className="p-12 text-center bg-canvas-surface border border-hairline rounded-3xl space-y-2 text-ink-mute font-sans shadow-subtle">
              <Video className="w-10 h-10 mx-auto text-ink-mute opacity-40" />
              <p className="text-sm font-medium">Tidak ada video yang cocok dengan pencarian Anda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onSelectVideo={(v) => setActiveTheaterVideo(v)}
                />
              ))}
            </div>
          )}

          {/* Theater Modal Player */}
          <VideoTheaterModal
            video={activeTheaterVideo}
            onClose={() => setActiveTheaterVideo(null)}
          />
        </div>
      )}

      {/* TAB 2: RECOMMENDED APPS (KALAAM APP SHOWCASE) */}
      {activeTab === 'apps' && (
        <div className="animate-in fade-in duration-200 pt-4">
          <KalaamShowcaseFrame />
        </div>
      )}

    </div>
  );
}
