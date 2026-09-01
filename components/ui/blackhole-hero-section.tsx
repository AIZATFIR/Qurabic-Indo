'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookMarked, Search, Layers, Compass } from 'lucide-react';

interface BlackHoleHeroProps {
  onOpenSearch: () => void;
  lastSearch?: string;
}

export default function BlackHoleHeroSection({ onOpenSearch, lastSearch }: BlackHoleHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);

    // IntersectionObserver to pause WebGL when scrolled out of view
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);

    if (!gl) {
      // Graceful Canvas 2D fallback
      const ctx = canvas.getContext('2d');
      if (ctx) {
        let reqId: number;
        const render2DFallback = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const cx = canvas.width * 0.7;
          const cy = canvas.height * 0.5;
          const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, canvas.width * 0.4);
          grad.addColorStop(0, '#000000');
          grad.addColorStop(0.2, '#1a1005');
          grad.addColorStop(0.5, '#c8923a');
          grad.addColorStop(0.8, '#1e293b');
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cx, cy, canvas.width * 0.4, 0, Math.PI * 2);
          ctx.fill();
        };
        render2DFallback();
      }
      return;
    }

    // Vertex Shader
    const vsSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Fragment Shader - Gravitational Lensing & Accretion Disk Physics
    const fsSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform float u_reduced_motion;

      // Pseudo-random noise
      float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        vec2 shift = vec2(100.0);
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
        for (int i = 0; i < 4; ++i) {
          v += a * noise(p);
          p = rot * p * 2.0 + shift;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 st = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);

        // Center shift towards the right for desktop balance
        vec2 center = vec2(0.35, 0.0);
        if (u_resolution.x < 768.0) {
          center = vec2(0.0, -0.2);
        }

        vec2 p = st - center;
        float r = length(p);
        float angle = atan(p.y, p.x);

        float t = u_reduced_motion > 0.5 ? 2.0 : u_time * 0.35;

        // Gravitational warping / lensing effect
        float distortion = 0.22 / (r + 0.08);
        angle += distortion * 2.0;

        // Swirling Accretion Disk Pattern
        vec2 polarCoords = vec2(r * 3.5 - t * 0.15, angle * 1.5 + t * 0.6);
        float diskNoise = fbm(polarCoords * 2.2);

        // Event Horizon (Pure Black Void)
        float eventHorizon = smoothstep(0.18, 0.23, r);

        // Accretion Ring Intensity
        float ring = exp(-pow((r - 0.38) * 4.5, 2.0)) * 1.8;
        float outerGlow = exp(-pow((r - 0.6) * 2.2, 2.0)) * 0.6;
        float innerPhotonRing = exp(-pow((r - 0.23) * 28.0, 2.0)) * 3.2;

        float intensity = (ring * diskNoise + outerGlow + innerPhotonRing) * eventHorizon;

        // Color Palette: Golden Amber, Deep Quranic Ochre, Starfield Void
        vec3 colorEventHorizon = vec3(0.01, 0.01, 0.015);
        vec3 colorDeepGold = vec3(0.78, 0.48, 0.16); // Amber / Ochre Gold
        vec3 colorPhotonWhite = vec3(1.0, 0.95, 0.85); // Pure Warm Glow
        vec3 colorAtmosphere = vec3(0.12, 0.22, 0.35); // Celestial Deep Blue

        vec3 finalColor = mix(colorAtmosphere * outerGlow, colorDeepGold, ring * diskNoise);
        finalColor += colorPhotonWhite * innerPhotonRing;
        finalColor *= eventHorizon;

        // Subtle Background Star Dust
        float stars = pow(hash(st * 40.0), 32.0) * 0.35;
        finalColor += vec3(stars);

        // Scrim & Edge Fade to blend seamlessly with surrounding page
        float edgeFade = 1.0 - smoothstep(0.75, 1.35, length(st));
        gl_FragColor = vec4(finalColor * edgeFade, edgeFade * 0.9);
      }
    `;

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = createShader(gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      return;
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1,
      ]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const reducedMotionLocation = gl.getUniformLocation(program, 'u_reduced_motion');

    let animationFrameId: number;
    let startTime = performance.now();

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = (timeNow: number) => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      handleResize();
      const elapsed = (timeNow - startTime) * 0.001;

      gl.useProgram(program);
      gl.enableVertexAttribArray(positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, elapsed);
      gl.uniform1f(reducedMotionLocation, prefersReducedMotion ? 1.0 : 0.0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (gl) {
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.deleteBuffer(positionBuffer);
      }
    };
  }, [isVisible, prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-[620px] sm:min-h-[720px] lg:min-h-[780px] w-full flex items-center justify-center overflow-hidden border-b border-hairline transition-colors"
    >
      {/* Interactive WebGL Black Hole Shader Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-85 dark:opacity-95"
        style={{ filter: 'contrast(1.08)' }}
        aria-hidden="true"
      />

      {/* Atmospheric Scrim & Backdrop Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-canvas-page/95 via-canvas-page/75 to-transparent pointer-events-none hidden md:block" />
      <div className="absolute inset-0 bg-gradient-to-b from-canvas-page/80 via-transparent to-canvas-page/95 pointer-events-none" />

      {/* Hero Content Container */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 w-full relative z-10 py-24 sm:py-32">
        <div className="max-w-2xl space-y-7 text-left">
          
          {/* Badge Indicator */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-canvas-surface/80 backdrop-blur-md border border-hairline text-ink-secondary text-xs font-medium shadow-subtle">
            <Compass className="w-3.5 h-3.5 text-primary" />
            <span>Corpus Morfologi &amp; Tadabbur Bahasa Al-Qur&apos;an</span>
          </div>

          {/* Majestic Hero Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light text-ink-primary tracking-tight font-sans leading-[1.12]">
            Membedah Kedalaman <br />
            <span className="font-semibold text-primary">Bahasa Al-Qur&apos;an</span>
          </h1>

          {/* Subtitle / Value Proposition */}
          <p className="text-base sm:text-lg lg:text-xl text-ink-secondary font-normal leading-relaxed font-sans max-w-xl">
            Jelajahi lapisan makna, akar kata trilateral, morfologi Sharaf, dan tafsir linguistik klasik Al-Qur&apos;an secara jernih, terstruktur, dan mendalam.
          </p>

          {/* Action Button Group */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <Link
              href="/baca"
              className="inline-flex items-center justify-center space-x-2 bg-primary hover:bg-primary-deep text-white font-medium text-sm sm:text-base px-8 py-3.5 rounded-full shadow-subtle hover:shadow-soft transition-all active:scale-95 font-sans"
            >
              <BookMarked className="w-4 h-4" />
              <span>Mulai Membaca</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <button
              onClick={onOpenSearch}
              className="inline-flex items-center justify-center space-x-2 bg-canvas-surface/90 hover:bg-canvas-surface border border-hairline hover:border-primary/40 text-ink-primary font-medium text-sm sm:text-base px-6 py-3.5 rounded-full shadow-subtle transition-all font-sans"
            >
              <Search className="w-4 h-4 text-primary" />
              <span>Cari Akar Kata (⌘K)</span>
            </button>
          </div>

          {/* Quiet Last Search Link */}
          {lastSearch && (
            <div className="flex items-center space-x-2 text-xs text-ink-mute font-sans pt-1">
              <span>Pencarian terakhir:</span>
              <button
                onClick={onOpenSearch}
                className="text-primary hover:underline font-medium"
              >
                {lastSearch}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
