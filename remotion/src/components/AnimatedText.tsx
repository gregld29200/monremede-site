import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import { colors, springs } from '../theme';

type AnimatedTextProps = {
  text: string;
  delay?: number;
  style?: React.CSSProperties;
  animation?: 'fadeUp' | 'fadeIn' | 'typewriter' | 'splitWords' | 'reveal';
  highlightWord?: string;
  highlightColor?: string;
};

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  delay = 0,
  style = {},
  animation = 'fadeUp',
  highlightWord,
  highlightColor = colors.goldSoft,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);

  if (animation === 'typewriter') {
    return (
      <TypewriterText
        text={text}
        delay={delayFrames}
        style={style}
      />
    );
  }

  if (animation === 'splitWords') {
    return (
      <SplitWordsText
        text={text}
        delay={delayFrames}
        style={style}
        highlightWord={highlightWord}
        highlightColor={highlightColor}
      />
    );
  }

  if (animation === 'reveal') {
    return (
      <RevealText
        text={text}
        delay={delayFrames}
        style={style}
      />
    );
  }

  // fadeUp or fadeIn
  const progress = spring({
    frame: frame - delayFrames,
    fps,
    config: springs.premium,
  });

  const opacity = interpolate(progress, [0, 1], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const translateY = animation === 'fadeUp'
    ? interpolate(progress, [0, 1], [40, 0], { extrapolateRight: 'clamp' })
    : 0;

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

// Typewriter effect component
const TypewriterText: React.FC<{
  text: string;
  delay: number;
  style: React.CSSProperties;
}> = ({ text, delay, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const charFrames = 2;
  const localFrame = Math.max(0, frame - delay);
  const typedChars = Math.min(text.length, Math.floor(localFrame / charFrames));
  const typedText = text.slice(0, typedChars);

  // Blinking cursor
  const cursorOpacity = interpolate(
    (frame % 16),
    [0, 8, 16],
    [1, 0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const showCursor = typedChars < text.length;

  return (
    <div style={style}>
      <span>{typedText}</span>
      {showCursor && (
        <span style={{ opacity: cursorOpacity, color: colors.goldSoft }}>|</span>
      )}
    </div>
  );
};

// Split words with staggered animation
const SplitWordsText: React.FC<{
  text: string;
  delay: number;
  style: React.CSSProperties;
  highlightWord?: string;
  highlightColor?: string;
}> = ({ text, delay, style, highlightWord, highlightColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = text.split(' ');
  const staggerFrames = 5;

  return (
    <div style={{ ...style, display: 'flex', flexWrap: 'wrap', gap: '0.25em', justifyContent: 'center' }}>
      {words.map((word, i) => {
        const wordDelay = delay + i * staggerFrames;
        const progress = spring({
          frame: frame - wordDelay,
          fps,
          config: springs.snappy,
        });

        const opacity = interpolate(progress, [0, 1], [0, 1], {
          extrapolateRight: 'clamp',
        });

        const translateY = interpolate(progress, [0, 1], [30, 0], {
          extrapolateRight: 'clamp',
        });

        const isHighlight = highlightWord && word.toLowerCase().includes(highlightWord.toLowerCase());

        // Highlight animation
        const highlightProgress = spring({
          frame: frame - wordDelay - 15,
          fps,
          config: { damping: 200 },
          durationInFrames: 18,
        });

        return (
          <span
            key={i}
            style={{
              opacity,
              transform: `translateY(${translateY}px)`,
              position: 'relative',
              display: 'inline-block',
            }}
          >
            {isHighlight && (
              <span
                style={{
                  position: 'absolute',
                  left: -8,
                  right: -8,
                  top: '10%',
                  height: '85%',
                  transform: `scaleX(${highlightProgress})`,
                  transformOrigin: 'left center',
                  backgroundColor: highlightColor,
                  borderRadius: 8,
                  zIndex: 0,
                  opacity: 0.4,
                }}
              />
            )}
            <span style={{ position: 'relative', zIndex: 1 }}>{word}</span>
          </span>
        );
      })}
    </div>
  );
};

// Reveal from behind mask
const RevealText: React.FC<{
  text: string;
  delay: number;
  style: React.CSSProperties;
}> = ({ text, delay, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: springs.smooth,
  });

  const clipProgress = interpolate(progress, [0, 1], [100, 0], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        ...style,
        clipPath: `inset(0 ${clipProgress}% 0 0)`,
      }}
    >
      {text}
    </div>
  );
};
