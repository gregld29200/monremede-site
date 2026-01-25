import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadCormorant } from '@remotion/google-fonts/CormorantGaramond';
import { loadFont as loadLora } from '@remotion/google-fonts/Lora';
import {
  AnimatedText,
  FloatingLeaves,
  GrowingVine,
  CornerOrnament,
  GradientBackground,
  OrganicBlobs,
  GeometricPattern,
  NoiseTexture,
  Vignette,
} from '../components';
import { colors, springs } from '../theme';

// Load fonts
const { fontFamily: playfair } = loadPlayfair('normal', {
  weights: ['400', '600', '700'],
  subsets: ['latin'],
});

const { fontFamily: cormorant } = loadCormorant('normal', {
  weights: ['400', '500', '600'],
  subsets: ['latin'],
});

const { fontFamily: lora } = loadLora('normal', {
  weights: ['400', '500'],
  subsets: ['latin'],
});

// Scene 1: Opening with brand name reveal
const Scene1_Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo/brand reveal animation
  const logoProgress = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
    delay: 15,
  });

  const logoScale = interpolate(logoProgress, [0, 1], [0.8, 1], {
    extrapolateRight: 'clamp',
  });

  const logoOpacity = interpolate(logoProgress, [0, 1], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Tagline reveal
  const taglineProgress = spring({
    frame: frame - 45,
    fps,
    config: springs.smooth,
  });

  // Decorative line animation
  const lineProgress = spring({
    frame: frame - 30,
    fps,
    config: { damping: 200 },
    durationInFrames: 40,
  });

  const lineWidth = interpolate(lineProgress, [0, 1], [0, 200], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <GradientBackground variant="cream" />
      <OrganicBlobs color={colors.sage} opacity={0.12} />
      <GeometricPattern opacity={0.05} />

      {/* Growing vines on sides */}
      <GrowingVine side="left" delay={0.3} />
      <GrowingVine side="right" delay={0.5} />

      {/* Corner ornaments */}
      <CornerOrnament position="topLeft" delay={0.8} />
      <CornerOrnament position="bottomRight" delay={1} />

      {/* Center content - using absolute positioning for reliable centering */}
      <AbsoluteFill
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
            textAlign: 'center',
            padding: 40,
          }}
        >
          {/* Brand name */}
          <div
            style={{
              fontFamily: playfair,
              fontSize: 100,
              fontWeight: 700,
              color: colors.forestBottle,
              letterSpacing: -2,
              marginBottom: 20,
            }}
          >
            Mon Remede
          </div>

          {/* Decorative line */}
          <div
            style={{
              width: lineWidth,
              height: 3,
              background: `linear-gradient(90deg, transparent, ${colors.goldSoft}, transparent)`,
              margin: '0 auto 30px',
              borderRadius: 2,
            }}
          />

          {/* Tagline */}
          <div
            style={{
              opacity: taglineProgress,
              transform: `translateY(${interpolate(taglineProgress, [0, 1], [20, 0])}px)`,
            }}
          >
            <div
              style={{
                fontFamily: cormorant,
                fontSize: 32,
                fontWeight: 500,
                color: colors.sage,
                letterSpacing: 8,
                textTransform: 'uppercase',
              }}
            >
              Science • Douceur • Spiritualite
            </div>
          </div>
        </div>
      </AbsoluteFill>

      <FloatingLeaves count={6} delay={1} />
      <NoiseTexture opacity={0.025} />
      <Vignette intensity={0.25} />
    </AbsoluteFill>
  );
};

// Scene 2: The Journey / Problem
const Scene2_Journey: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Quote animation
  const quoteProgress = spring({
    frame,
    fps,
    config: springs.smooth,
    delay: 10,
  });

  const subtitleProgress = spring({
    frame: frame - 60,
    fps,
    config: springs.smooth,
  });

  const signatureProgress = spring({
    frame: frame - 100,
    fps,
    config: springs.smooth,
  });

  return (
    <AbsoluteFill>
      <GradientBackground variant="forest" />
      <OrganicBlobs color={colors.sageLight} opacity={0.08} />

      <AbsoluteFill
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: 900, padding: 60 }}>
          {/* Opening quote mark */}
          <div
            style={{
              fontFamily: playfair,
              fontSize: 200,
              color: colors.goldSoft,
              opacity: quoteProgress * 0.4,
              lineHeight: 0.5,
              marginBottom: -60,
            }}
          >
            "
          </div>

          {/* Main quote */}
          <div
            style={{
              opacity: quoteProgress,
              transform: `translateY(${interpolate(quoteProgress, [0, 1], [30, 0])}px)`,
            }}
          >
            <div
              style={{
                fontFamily: lora,
                fontSize: 36,
                fontWeight: 400,
                fontStyle: 'italic',
                color: colors.offWhite,
                lineHeight: 1.6,
                marginBottom: 40,
              }}
            >
              La medecine conventionnelle ne m'a pas soulagee
            </div>
          </div>

          {/* Subtitle */}
          <div
            style={{
              opacity: subtitleProgress,
              transform: `translateY(${interpolate(subtitleProgress, [0, 1], [20, 0])}px)`,
            }}
          >
            <div
              style={{
                fontFamily: lora,
                fontSize: 28,
                color: colors.sageLight,
                fontStyle: 'italic',
              }}
            >
              Je me suis tournee vers la naturopathie...
            </div>
          </div>

          {/* Signature */}
          <div
            style={{
              marginTop: 60,
              opacity: signatureProgress,
              transform: `translateY(${interpolate(signatureProgress, [0, 1], [15, 0])}px)`,
            }}
          >
            <div
              style={{
                fontFamily: cormorant,
                fontSize: 26,
                color: colors.goldSoft,
                letterSpacing: 2,
              }}
            >
              - Oum Soumayya
            </div>
          </div>
        </div>
      </AbsoluteFill>

      <CornerOrnament position="topRight" delay={0.3} size={150} />
      <CornerOrnament position="bottomLeft" delay={0.5} size={150} />
      <NoiseTexture opacity={0.04} />
      <Vignette intensity={0.5} />
    </AbsoluteFill>
  );
};

// Scene 3: The Philosophy
const Scene3_Philosophy: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pillars = [
    { icon: '🌿', text: 'Naturopathie', delay: 0.3 },
    { icon: '🔬', text: 'Science', delay: 0.5 },
    { icon: '✨', text: 'Spiritualite', delay: 0.7 },
  ];

  // Main quote animation
  const quoteProgress = spring({
    frame,
    fps,
    config: springs.smooth,
    delay: 5,
  });

  const authorProgress = spring({
    frame: frame - 30,
    fps,
    config: springs.smooth,
  });

  return (
    <AbsoluteFill>
      <GradientBackground variant="warm" />
      <GeometricPattern color={colors.sage} opacity={0.06} scale={0.8} />

      <AbsoluteFill
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{ textAlign: 'center', width: '100%', padding: 60 }}>
          {/* Main quote */}
          <div
            style={{
              opacity: quoteProgress,
              transform: `translateY(${interpolate(quoteProgress, [0, 1], [40, 0])}px)`,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                fontFamily: playfair,
                fontSize: 48,
                fontWeight: 600,
                color: colors.forestBottle,
                lineHeight: 1.3,
              }}
            >
              Que ton aliment soit
            </div>
            <div
              style={{
                fontFamily: playfair,
                fontSize: 48,
                fontWeight: 600,
                color: colors.forestBottle,
                lineHeight: 1.3,
                position: 'relative',
                display: 'inline-block',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: -10,
                  right: -10,
                  top: '10%',
                  height: '80%',
                  backgroundColor: colors.goldSoft,
                  opacity: 0.3,
                  borderRadius: 8,
                  transform: `scaleX(${quoteProgress})`,
                  transformOrigin: 'left',
                }}
              />
              <span style={{ position: 'relative' }}>ton medicament</span>
            </div>
          </div>

          {/* Author */}
          <div
            style={{
              opacity: authorProgress,
              marginBottom: 80,
            }}
          >
            <div
              style={{
                fontFamily: cormorant,
                fontSize: 24,
                color: colors.sage,
                letterSpacing: 3,
              }}
            >
              - Hippocrate
            </div>
          </div>

          {/* Three pillars */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 50,
              marginTop: 40,
            }}
          >
            {pillars.map((pillar, i) => (
              <PillarItem
                key={i}
                icon={pillar.icon}
                text={pillar.text}
                delay={pillar.delay}
              />
            ))}
          </div>
        </div>
      </AbsoluteFill>

      <GrowingVine side="left" delay={0.2} color={colors.sageLight} />
      <FloatingLeaves count={4} delay={1.5} />
      <NoiseTexture opacity={0.025} />
      <Vignette intensity={0.2} color={colors.beigeWarm} />
    </AbsoluteFill>
  );
};

const PillarItem: React.FC<{ icon: string; text: string; delay: number }> = ({
  icon,
  text,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay * fps,
    fps,
    config: springs.bouncy,
  });

  const scale = interpolate(progress, [0, 1], [0.5, 1], {
    extrapolateRight: 'clamp',
  });

  const opacity = interpolate(progress, [0, 1], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: colors.offWhite,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 48,
          marginBottom: 16,
          boxShadow: `0 8px 32px ${colors.sage}40`,
          border: `2px solid ${colors.sageLight}`,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontFamily: cormorant,
          fontSize: 22,
          fontWeight: 600,
          color: colors.forestBottle,
          letterSpacing: 1,
        }}
      >
        {text}
      </div>
    </div>
  );
};

// Scene 4: CTA / Closing
const Scene4_CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title animations
  const title1Progress = spring({
    frame,
    fps,
    config: springs.smooth,
    delay: 5,
  });

  const title2Progress = spring({
    frame: frame - 20,
    fps,
    config: springs.smooth,
  });

  // Pulsing CTA button effect
  const pulseScale = 1 + Math.sin(frame / 8) * 0.03;

  const ctaProgress = spring({
    frame: frame - 45,
    fps,
    config: springs.bouncy,
  });

  const taglineProgress = spring({
    frame: frame - 75,
    fps,
    config: springs.smooth,
  });

  return (
    <AbsoluteFill>
      <GradientBackground variant="cream" />
      <OrganicBlobs color={colors.rosePowder} opacity={0.15} />
      <GeometricPattern color={colors.goldSoft} opacity={0.04} />

      <AbsoluteFill
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{ textAlign: 'center', padding: 60 }}>
          {/* Title line 1 */}
          <div
            style={{
              opacity: title1Progress,
              transform: `translateY(${interpolate(title1Progress, [0, 1], [30, 0])}px)`,
            }}
          >
            <div
              style={{
                fontFamily: playfair,
                fontSize: 64,
                fontWeight: 700,
                color: colors.forestBottle,
                marginBottom: 10,
              }}
            >
              Reprends le controle
            </div>
          </div>

          {/* Title line 2 with highlight */}
          <div
            style={{
              opacity: title2Progress,
              transform: `translateY(${interpolate(title2Progress, [0, 1], [30, 0])}px)`,
              marginBottom: 50,
            }}
          >
            <span
              style={{
                fontFamily: playfair,
                fontSize: 64,
                fontWeight: 700,
                color: colors.forestBottle,
              }}
            >
              de ta{' '}
            </span>
            <span
              style={{
                fontFamily: playfair,
                fontSize: 64,
                fontWeight: 700,
                color: colors.forestBottle,
                position: 'relative',
                display: 'inline-block',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: -8,
                  right: -8,
                  top: '10%',
                  height: '80%',
                  backgroundColor: colors.goldSoft,
                  opacity: 0.4,
                  borderRadius: 8,
                  transform: `scaleX(${title2Progress})`,
                  transformOrigin: 'left',
                }}
              />
              <span style={{ position: 'relative' }}>sante</span>
            </span>
          </div>

          {/* CTA Button */}
          <div
            style={{
              opacity: ctaProgress,
              transform: `scale(${ctaProgress * pulseScale})`,
            }}
          >
            <div
              style={{
                display: 'inline-block',
                padding: '24px 60px',
                background: colors.forestBottle,
                borderRadius: 50,
                boxShadow: `0 12px 40px ${colors.forestBottle}50`,
              }}
            >
              <span
                style={{
                  fontFamily: cormorant,
                  fontSize: 28,
                  fontWeight: 600,
                  color: colors.offWhite,
                  letterSpacing: 3,
                  textTransform: 'uppercase',
                }}
              >
                monremede.com
              </span>
            </div>
          </div>

          {/* Tagline */}
          <div
            style={{
              opacity: taglineProgress,
              transform: `translateY(${interpolate(taglineProgress, [0, 1], [20, 0])}px)`,
              marginTop: 40,
            }}
          >
            <div
              style={{
                fontFamily: lora,
                fontSize: 22,
                color: colors.sage,
              }}
            >
              Naturopathie • Consultations • Bien-etre
            </div>
          </div>
        </div>
      </AbsoluteFill>

      <CornerOrnament position="topLeft" delay={0.2} />
      <CornerOrnament position="topRight" delay={0.3} />
      <CornerOrnament position="bottomLeft" delay={0.4} />
      <CornerOrnament position="bottomRight" delay={0.5} />
      <FloatingLeaves count={5} delay={0.5} />
      <NoiseTexture opacity={0.025} />
      <Vignette intensity={0.25} />
    </AbsoluteFill>
  );
};

// Main composition with transitions
export const BrandStory: React.FC = () => {
  const { fps } = useVideoConfig();

  // Scene durations in frames (at 30fps)
  const scene1Duration = 4 * fps; // 4 seconds
  const scene2Duration = 5 * fps; // 5 seconds
  const scene3Duration = 5 * fps; // 5 seconds
  const scene4Duration = 4.5 * fps; // 4.5 seconds

  return (
    <AbsoluteFill style={{ backgroundColor: colors.offWhite }}>
      {/* Scene 1: Opening */}
      <Sequence from={0} durationInFrames={scene1Duration} premountFor={30}>
        <FadeWrapper duration={0.5}>
          <Scene1_Opening />
        </FadeWrapper>
      </Sequence>

      {/* Scene 2: Journey */}
      <Sequence from={scene1Duration - 15} durationInFrames={scene2Duration + 15} premountFor={30}>
        <FadeWrapper duration={0.5} fadeIn fadeOut>
          <Scene2_Journey />
        </FadeWrapper>
      </Sequence>

      {/* Scene 3: Philosophy */}
      <Sequence
        from={scene1Duration + scene2Duration - 30}
        durationInFrames={scene3Duration + 15}
        premountFor={30}
      >
        <FadeWrapper duration={0.5} fadeIn fadeOut>
          <Scene3_Philosophy />
        </FadeWrapper>
      </Sequence>

      {/* Scene 4: CTA */}
      <Sequence
        from={scene1Duration + scene2Duration + scene3Duration - 45}
        durationInFrames={scene4Duration + 45}
        premountFor={30}
      >
        <FadeWrapper duration={0.5} fadeIn>
          <Scene4_CTA />
        </FadeWrapper>
      </Sequence>
    </AbsoluteFill>
  );
};

// Fade wrapper component
const FadeWrapper: React.FC<{
  children: React.ReactNode;
  duration?: number;
  fadeIn?: boolean;
  fadeOut?: boolean;
}> = ({ children, duration = 0.5, fadeIn = true, fadeOut = true }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const fadeDuration = duration * fps;

  let opacity = 1;

  if (fadeIn) {
    const fadeInProgress = interpolate(frame, [0, fadeDuration], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    opacity *= fadeInProgress;
  }

  if (fadeOut) {
    const fadeOutProgress = interpolate(
      frame,
      [durationInFrames - fadeDuration, durationInFrames],
      [1, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
    opacity *= fadeOutProgress;
  }

  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};
