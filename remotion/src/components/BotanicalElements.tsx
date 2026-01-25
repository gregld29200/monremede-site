import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import { colors, springs } from '../theme';

// Leaf SVG shape
const LeafPath: React.FC<{
  color?: string;
  scale?: number;
  style?: React.CSSProperties;
}> = ({ color = colors.sage, scale = 1, style }) => (
  <svg
    width={60 * scale}
    height={100 * scale}
    viewBox="0 0 60 100"
    style={style}
  >
    <path
      d="M30 5 C45 25, 55 45, 55 65 C55 85, 45 95, 30 95 C15 95, 5 85, 5 65 C5 45, 15 25, 30 5"
      fill={color}
    />
    <path
      d="M30 20 L30 85"
      stroke={colors.forestBottle}
      strokeWidth={1.5}
      strokeOpacity={0.3}
    />
  </svg>
);

// Floating leaves animation
export const FloatingLeaves: React.FC<{
  count?: number;
  delay?: number;
}> = ({ count = 8, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const delayFrames = delay * fps;

  const leaves = Array.from({ length: count }, (_, i) => {
    const seed = i * 137.5;
    const startX = (seed * 7) % width;
    const startY = height + 100;
    const endY = -200;

    const duration = 4 + (i % 3);
    const leafDelay = delayFrames + (i * 8);

    const progress = interpolate(
      frame - leafDelay,
      [0, duration * fps],
      [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    const y = interpolate(progress, [0, 1], [startY, endY]);
    const x = startX + Math.sin(progress * Math.PI * 3 + seed) * 80;
    const rotation = Math.sin(progress * Math.PI * 2 + seed) * 45;
    const scale = 0.4 + (seed % 3) * 0.2;

    const opacity = interpolate(
      progress,
      [0, 0.1, 0.9, 1],
      [0, 0.6, 0.6, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    const leafColor = i % 3 === 0 ? colors.sage : i % 3 === 1 ? colors.sageLight : colors.forestBottle;

    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: x,
          top: y,
          transform: `rotate(${rotation}deg)`,
          opacity,
        }}
      >
        <LeafPath color={leafColor} scale={scale} />
      </div>
    );
  });

  return <>{leaves}</>;
};

// Growing vine/branch animation
export const GrowingVine: React.FC<{
  side?: 'left' | 'right';
  delay?: number;
  color?: string;
}> = ({ side = 'left', delay = 0, color = colors.sage }) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();

  const delayFrames = delay * fps;

  const progress = spring({
    frame: frame - delayFrames,
    fps,
    config: { damping: 80, stiffness: 50 },
    durationInFrames: 90,
  });

  const pathLength = interpolate(progress, [0, 1], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const isLeft = side === 'left';

  return (
    <svg
      width={200}
      height={height}
      style={{
        position: 'absolute',
        [side]: 0,
        top: 0,
        transform: isLeft ? 'none' : 'scaleX(-1)',
      }}
    >
      {/* Main vine */}
      <path
        d={`M 20 ${height}
            C 40 ${height * 0.8}, 60 ${height * 0.7}, 30 ${height * 0.5}
            C 10 ${height * 0.35}, 50 ${height * 0.25}, 25 ${height * 0.1}
            C 15 ${height * 0.05}, 30 0, 20 -20`}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeDasharray={height * 1.5}
        strokeDashoffset={height * 1.5 * (1 - pathLength)}
        strokeLinecap="round"
      />

      {/* Small leaves along the vine */}
      {[0.2, 0.4, 0.6, 0.8].map((pos, i) => {
        const leafProgress = interpolate(
          progress,
          [pos - 0.1, pos + 0.1],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        const leafScale = spring({
          frame: frame - delayFrames - pos * 60,
          fps,
          config: springs.bouncy,
        });

        return (
          <g
            key={i}
            transform={`translate(${35 + Math.sin(i * 2) * 20}, ${height * (1 - pos)}) scale(${leafScale * 0.5})`}
            opacity={leafProgress}
          >
            <ellipse
              cx={0}
              cy={0}
              rx={15}
              ry={25}
              fill={i % 2 === 0 ? colors.sageLight : color}
              transform={`rotate(${45 + i * 30})`}
            />
          </g>
        );
      })}
    </svg>
  );
};

// Decorative corner ornament
export const CornerOrnament: React.FC<{
  position: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  delay?: number;
  size?: number;
}> = ({ position, delay = 0, size = 200 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const delayFrames = delay * fps;

  const progress = spring({
    frame: frame - delayFrames,
    fps,
    config: springs.gentle,
  });

  const scale = interpolate(progress, [0, 1], [0.3, 1], {
    extrapolateRight: 'clamp',
  });

  const opacity = interpolate(progress, [0, 1], [0, 0.8], {
    extrapolateRight: 'clamp',
  });

  const transforms: Record<string, { rotate: string; position: React.CSSProperties }> = {
    topLeft: { rotate: '0deg', position: { top: 0, left: 0 } },
    topRight: { rotate: '90deg', position: { top: 0, right: 0 } },
    bottomRight: { rotate: '180deg', position: { bottom: 0, right: 0 } },
    bottomLeft: { rotate: '270deg', position: { bottom: 0, left: 0 } },
  };

  const { rotate, position: pos } = transforms[position];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      style={{
        position: 'absolute',
        ...pos,
        opacity,
        transform: `rotate(${rotate}) scale(${scale})`,
        transformOrigin: 'center',
      }}
    >
      {/* Curved botanical corner */}
      <path
        d="M 0 0 C 40 0, 80 10, 100 40 C 120 70, 120 100, 100 120
           C 80 100, 60 80, 40 70 C 20 60, 0 40, 0 0"
        fill={colors.sage}
        opacity={0.4}
      />
      <path
        d="M 0 0 C 30 0, 60 5, 80 25 C 95 45, 95 70, 80 90
           C 65 75, 50 60, 35 55 C 20 50, 0 35, 0 0"
        fill={colors.sageLight}
        opacity={0.5}
      />
      {/* Gold accent line */}
      <path
        d="M 5 5 C 25 5, 55 10, 75 30 C 90 50, 90 75, 75 95"
        fill="none"
        stroke={colors.goldSoft}
        strokeWidth={2}
        opacity={0.7}
      />
    </svg>
  );
};

// Pulsing circle accent
export const PulsingCircle: React.FC<{
  x: number;
  y: number;
  size?: number;
  color?: string;
  delay?: number;
}> = ({ x, y, size = 20, color = colors.goldSoft, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const delayFrames = delay * fps;

  const entranceProgress = spring({
    frame: frame - delayFrames,
    fps,
    config: springs.bouncy,
  });

  const pulseFrame = Math.max(0, frame - delayFrames - 20);
  const pulseScale = 1 + Math.sin(pulseFrame / 10) * 0.1;

  return (
    <div
      style={{
        position: 'absolute',
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: color,
        transform: `scale(${entranceProgress * pulseScale})`,
        opacity: entranceProgress * 0.8,
      }}
    />
  );
};
