'use client';

import React from 'react';

interface AmbientHeroCanvasProps {
  videoSrc?: string;
}

export default function AmbientHeroCanvas({ videoSrc }: AmbientHeroCanvasProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* Background Ambient Video or Gradient Flow */}
      {videoSrc ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-20 filter blur-sm scale-105 transition-opacity duration-1000"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : (
        /* Organic Google-Flow Inspired Light Fluid Mesh Gradient */
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50/60 via-amber-50/40 to-rose-50/40 opacity-90 animate-pulse transition-all duration-1000">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-200/30 blur-3xl" />
          <div className="absolute top-1/2 -right-40 w-96 h-96 rounded-full bg-rose-200/20 blur-3xl" />
          <div className="absolute -bottom-20 left-1/3 w-96 h-96 rounded-full bg-amber-200/30 blur-3xl" />
        </div>
      )}

      {/* Subtle Grid Lines Overlay for Scientific Precision */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #0f172a 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
}
