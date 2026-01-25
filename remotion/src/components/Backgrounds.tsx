import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { colors, springs } from '../theme';

// Gradient background with subtle animation
export const GradientBackground: React.FC<{
  variant?: 'cream' | 'forest' | 'sage' | 'warm';
}> = ({ variant = 'cream' }) => {
  const frame = useCurrentFrame();

  const gradients: Record<string, { from: string; to: string; angle: number }> = {
    cream: { from: colors.offWhite, to: colors.beigeLinen, angle: 180 },
    forest: { from: colors.forestBottle, to: '#1a2e23', angle: 180 },
    sage: { from: colors.sageLight, to: colors.sage, angle: 160 },
    warm: { from: colors.beigeLinen, to: colors.beigeWarm, angle: 170 },
  };

  const { from, to, angle } = gradients[variant];

  // Subtle parallax shift
  const shift = Math.sin(frame / 60) * 2;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${angle + shift}deg, ${from} 0%, ${to} 100%)`,
      }}
    />
  );
};

// Organic blob shapes background
export const OrganicBlobs: React.FC<{
  color?: string;
  opacity?: number;
}> = ({ color = colors.sage, opacity = 0.15 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const blobs = [
    { x: -100, y: 200, size: 400, speed: 0.3 },
    { x: width - 200, y: height - 300, size: 350, speed: 0.4 },
    { x: width / 2, y: height / 3, size: 280, speed: 0.5 },
  ];

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {blobs.map((blob, i) => {
        const wobble = Math.sin(frame * 0.02 * blob.speed + i) * 20;
        const wobbleY = Math.cos(frame * 0.015 * blob.speed + i) * 15;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: blob.x + wobble,
              top: blob.y + wobbleY,
              width: blob.size,
              height: blob.size * 1.2,
              background: color,
              borderRadius: '60% 40% 50% 50% / 50% 60% 40% 50%',
              opacity,
              filter: 'blur(60px)',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Geometric pattern overlay (Islamic-inspired, no figurative elements)
export const GeometricPattern: React.FC<{
  color?: string;
  opacity?: number;
  scale?: number;
}> = ({ color = colors.goldSoft, opacity = 0.08, scale = 1 }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const patternSize = 120 * scale;
  const rows = Math.ceil(height / patternSize) + 2;
  const cols = Math.ceil(width / patternSize) + 2;

  // Subtle reveal animation
  const revealProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 60,
  });

  return (
    <AbsoluteFill style={{ overflow: 'hidden', opacity: opacity * revealProgress }}>
      <svg width={width} height={height}>
        <defs>
          <pattern
            id="islamicPattern"
            x="0"
            y="0"
            width={patternSize}
            height={patternSize}
            patternUnits="userSpaceOnUse"
          >
            {/* 8-pointed star (Islamic geometric motif) */}
            <g stroke={color} fill="none" strokeWidth={1}>
              {/* Outer octagon */}
              <polygon
                points={`
                  ${patternSize * 0.5},${patternSize * 0.15}
                  ${patternSize * 0.75},${patternSize * 0.25}
                  ${patternSize * 0.85},${patternSize * 0.5}
                  ${patternSize * 0.75},${patternSize * 0.75}
                  ${patternSize * 0.5},${patternSize * 0.85}
                  ${patternSize * 0.25},${patternSize * 0.75}
                  ${patternSize * 0.15},${patternSize * 0.5}
                  ${patternSize * 0.25},${patternSize * 0.25}
                `}
              />
              {/* Inner cross lines */}
              <line
                x1={patternSize * 0.5}
                y1={patternSize * 0.25}
                x2={patternSize * 0.5}
                y2={patternSize * 0.75}
              />
              <line
                x1={patternSize * 0.25}
                y1={patternSize * 0.5}
                x2={patternSize * 0.75}
                y2={patternSize * 0.5}
              />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamicPattern)" />
      </svg>
    </AbsoluteFill>
  );
};

// Noise texture overlay for premium feel
export const NoiseTexture: React.FC<{
  opacity?: number;
}> = ({ opacity = 0.03 }) => {
  return (
    <AbsoluteFill
      style={{
        background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        opacity,
        mixBlendMode: 'overlay',
        pointerEvents: 'none',
      }}
    />
  );
};

// Vignette effect
export const Vignette: React.FC<{
  intensity?: number;
  color?: string;
}> = ({ intensity = 0.4, color = 'black' }) => {
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at center, transparent 40%, ${color} 150%)`,
        opacity: intensity,
        pointerEvents: 'none',
      }}
    />
  );
};

// Animated light rays
export const LightRays: React.FC<{
  color?: string;
  opacity?: number;
}> = ({ color = colors.goldSoft, opacity = 0.15 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const rotation = frame * 0.1;

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          left: '50%',
          width: '200%',
          height: '200%',
          transform: `translateX(-50%) rotate(${rotation}deg)`,
          background: `conic-gradient(from 0deg, transparent, ${color}, transparent, ${color}, transparent, ${color}, transparent, ${color}, transparent)`,
          opacity,
          filter: 'blur(80px)',
        }}
      />
    </AbsoluteFill>
  );
};
