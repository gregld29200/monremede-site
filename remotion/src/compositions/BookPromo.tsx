import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadCormorant } from '@remotion/google-fonts/CormorantGaramond';
import { loadFont as loadLora } from '@remotion/google-fonts/Lora';
import {
  FloatingLeaves,
  GrowingVine,
  CornerOrnament,
  GradientBackground,
  OrganicBlobs,
  GeometricPattern,
  NoiseTexture,
  Vignette,
  LightRays,
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

// Scene 1: Book Title Reveal
const Scene1_BookReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Book cover animation
  const bookProgress = spring({
    frame: frame - 10,
    fps,
    config: { damping: 18, stiffness: 100 },
  });

  const bookScale = interpolate(bookProgress, [0, 1], [0.6, 1], {
    extrapolateRight: 'clamp',
  });

  const bookRotateY = interpolate(bookProgress, [0, 1], [-30, 0], {
    extrapolateRight: 'clamp',
  });

  // Tagline animation
  const taglineProgress = spring({
    frame: frame - 50,
    fps,
    config: springs.smooth,
  });

  // Glow effect
  const glowOpacity = 0.3 + Math.sin(frame / 15) * 0.1;

  return (
    <AbsoluteFill>
      <GradientBackground variant="forest" />
      <LightRays color={colors.goldSoft} opacity={0.1} />
      <OrganicBlobs color={colors.sage} opacity={0.08} />

      <AbsoluteFill
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 60,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          {/* Book cover mockup */}
          <div
            style={{
              transform: `scale(${bookScale}) perspective(1000px) rotateY(${bookRotateY}deg)`,
              marginBottom: 50,
              display: 'inline-block',
              position: 'relative',
            }}
          >
            {/* Book glow */}
            <div
              style={{
                position: 'absolute',
                inset: -40,
                background: `radial-gradient(ellipse, ${colors.goldSoft}60 0%, transparent 70%)`,
                opacity: glowOpacity,
                filter: 'blur(30px)',
              }}
            />

            {/* Book cover */}
            <div
              style={{
                width: 320,
                height: 480,
                background: `linear-gradient(135deg, ${colors.forestBottle} 0%, #1a2e23 100%)`,
                borderRadius: 8,
                padding: 30,
                boxShadow: `
                  20px 20px 60px rgba(0,0,0,0.4),
                  -5px -5px 20px rgba(255,255,255,0.05),
                  inset 0 0 60px rgba(255,255,255,0.03)
                `,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Decorative border */}
              <div
                style={{
                  position: 'absolute',
                  inset: 15,
                  border: `1px solid ${colors.goldSoft}40`,
                  borderRadius: 4,
                }}
              />

              {/* Book title */}
              <div
                style={{
                  fontFamily: playfair,
                  fontSize: 32,
                  fontWeight: 700,
                  color: colors.offWhite,
                  lineHeight: 1.2,
                  marginBottom: 15,
                }}
              >
                La Sante
                <br />
                dans l'Assiette
              </div>

              {/* Subtitle */}
              <div
                style={{
                  fontFamily: cormorant,
                  fontSize: 18,
                  color: colors.goldSoft,
                  letterSpacing: 1,
                  marginBottom: 20,
                }}
              >
                30 jours pour se soigner
              </div>

              {/* Decorative leaf */}
              <svg width={60} height={40} viewBox="0 0 60 40">
                <path
                  d="M10 30 C20 10, 40 10, 50 30 M30 30 L30 10"
                  fill="none"
                  stroke={colors.sage}
                  strokeWidth={1.5}
                />
              </svg>

              {/* Author */}
              <div
                style={{
                  fontFamily: lora,
                  fontSize: 14,
                  color: colors.sageLight,
                  marginTop: 20,
                  letterSpacing: 2,
                }}
              >
                ZAYNEB OLD
              </div>
            </div>
          </div>

          {/* Tagline below book */}
          <div
            style={{
              opacity: taglineProgress,
              transform: `translateY(${interpolate(taglineProgress, [0, 1], [20, 0])}px)`,
            }}
          >
            <div
              style={{
                fontFamily: lora,
                fontSize: 24,
                color: colors.sageLight,
                textAlign: 'center',
                maxWidth: 500,
              }}
            >
              Le guide complet de la nutrition therapeutique
            </div>
          </div>
        </div>
      </AbsoluteFill>

      <CornerOrnament position="topLeft" delay={0.5} size={140} />
      <CornerOrnament position="bottomRight" delay={0.7} size={140} />
      <NoiseTexture opacity={0.04} />
      <Vignette intensity={0.45} />
    </AbsoluteFill>
  );
};

// Scene 2: Key Statistics
const Scene2_Statistics: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stats = [
    { number: '128 000', label: 'hospitalisations/an', subtext: 'liees aux medicaments', delay: 0.2 },
    { number: '13 000', label: 'deces/an', subtext: 'en France', delay: 0.6 },
  ];

  // Intro animation
  const introProgress = spring({
    frame,
    fps,
    config: springs.smooth,
    delay: 5,
  });

  // Bottom message animation
  const messageProgress = spring({
    frame: frame - 100,
    fps,
    config: springs.smooth,
  });

  return (
    <AbsoluteFill>
      <GradientBackground variant="cream" />
      <GeometricPattern color={colors.forestBottle} opacity={0.04} />

      <AbsoluteFill
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 60,
        }}
      >
        <div style={{ textAlign: 'center', width: '100%' }}>
          {/* Intro text */}
          <div
            style={{
              opacity: introProgress,
              transform: `translateY(${interpolate(introProgress, [0, 1], [20, 0])}px)`,
              marginBottom: 50,
            }}
          >
            <div
              style={{
                fontFamily: cormorant,
                fontSize: 28,
                color: colors.sage,
                letterSpacing: 4,
                textTransform: 'uppercase',
              }}
            >
              Le saviez-vous ?
            </div>
          </div>

          {/* Statistics */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 60,
              alignItems: 'center',
            }}
          >
            {stats.map((stat, i) => (
              <StatCard key={i} {...stat} />
            ))}
          </div>

          {/* Bottom message */}
          <div
            style={{
              opacity: messageProgress,
              transform: `translateY(${interpolate(messageProgress, [0, 1], [20, 0])}px)`,
              marginTop: 60,
            }}
          >
            <div
              style={{
                fontFamily: lora,
                fontSize: 26,
                fontStyle: 'italic',
                color: colors.forestBottle,
              }}
            >
              Il existe une autre voie...
            </div>
          </div>
        </div>
      </AbsoluteFill>

      <GrowingVine side="right" delay={0.3} color={colors.roseSoft} />
      <NoiseTexture opacity={0.025} />
      <Vignette intensity={0.2} color={colors.beigeWarm} />
    </AbsoluteFill>
  );
};

const StatCard: React.FC<{
  number: string;
  label: string;
  subtext: string;
  delay: number;
}> = ({ number, label, subtext, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay * fps,
    fps,
    config: springs.snappy,
  });

  const scale = interpolate(progress, [0, 1], [0.8, 1], {
    extrapolateRight: 'clamp',
  });

  // Animated number counter
  const numberValue = parseInt(number.replace(/\s/g, ''));
  const countProgress = interpolate(
    frame - delay * fps,
    [0, 40],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) }
  );

  const displayNumber = Math.floor(numberValue * countProgress)
    .toLocaleString('fr-FR')
    .replace(/,/g, ' ');

  return (
    <div
      style={{
        opacity: progress,
        transform: `scale(${scale})`,
        textAlign: 'center',
        padding: '30px 50px',
        background: colors.offWhite,
        borderRadius: 20,
        boxShadow: `0 10px 40px ${colors.sage}20`,
        border: `1px solid ${colors.sageLight}40`,
      }}
    >
      <div
        style={{
          fontFamily: playfair,
          fontSize: 72,
          fontWeight: 700,
          color: colors.forestBottle,
          lineHeight: 1,
        }}
      >
        {displayNumber}
      </div>
      <div
        style={{
          fontFamily: cormorant,
          fontSize: 22,
          color: colors.sage,
          marginTop: 8,
          letterSpacing: 1,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: lora,
          fontSize: 16,
          color: colors.inkSoft,
          marginTop: 4,
        }}
      >
        {subtext}
      </div>
    </div>
  );
};

// Scene 3: The 30-Day Program
const Scene3_Program: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const benefits = [
    { text: 'Comprendre ton corps', delay: 0.4 },
    { text: 'Regimes adaptes', delay: 0.55 },
    { text: 'Menus complets', delay: 0.7 },
    { text: 'Regeneration naturelle', delay: 0.85 },
  ];

  // Title animations
  const titleProgress = spring({
    frame,
    fps,
    config: springs.smooth,
    delay: 5,
  });

  const subtitleProgress = spring({
    frame: frame - 15,
    fps,
    config: springs.smooth,
  });

  return (
    <AbsoluteFill>
      <GradientBackground variant="sage" />
      <OrganicBlobs color={colors.forestBottle} opacity={0.1} />

      <AbsoluteFill
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 60,
        }}
      >
        <div style={{ textAlign: 'center', width: '100%' }}>
          {/* Main title */}
          <div
            style={{
              opacity: titleProgress,
              transform: `translateY(${interpolate(titleProgress, [0, 1], [30, 0])}px)`,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                fontFamily: playfair,
                fontSize: 80,
                fontWeight: 700,
                color: colors.offWhite,
              }}
            >
              30 jours
            </div>
          </div>

          <div
            style={{
              opacity: subtitleProgress,
              transform: `translateY(${interpolate(subtitleProgress, [0, 1], [20, 0])}px)`,
              marginBottom: 60,
            }}
          >
            <div
              style={{
                fontFamily: cormorant,
                fontSize: 32,
                color: colors.forestBottle,
                letterSpacing: 2,
              }}
            >
              pour transformer ta sante
            </div>
          </div>

          {/* Benefits list */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              alignItems: 'center',
            }}
          >
            {benefits.map((benefit, i) => (
              <BenefitItem key={i} text={benefit.text} delay={benefit.delay} index={i} />
            ))}
          </div>
        </div>
      </AbsoluteFill>

      <FloatingLeaves count={6} delay={0.5} />
      <CornerOrnament position="topRight" delay={0.3} />
      <CornerOrnament position="bottomLeft" delay={0.5} />
      <NoiseTexture opacity={0.03} />
      <Vignette intensity={0.3} />
    </AbsoluteFill>
  );
};

const BenefitItem: React.FC<{ text: string; delay: number; index: number }> = ({
  text,
  delay,
  index,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay * fps,
    fps,
    config: springs.snappy,
  });

  const translateX = interpolate(progress, [0, 1], [-50, 0], {
    extrapolateRight: 'clamp',
  });

  // Checkmark animation
  const checkProgress = spring({
    frame: frame - delay * fps - 10,
    fps,
    config: springs.bouncy,
  });

  return (
    <div
      style={{
        opacity: progress,
        transform: `translateX(${translateX}px)`,
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        padding: '16px 30px',
        background: `${colors.offWhite}95`,
        borderRadius: 50,
        boxShadow: `0 4px 20px ${colors.forestBottle}20`,
      }}
    >
      {/* Animated checkmark */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: colors.goldSoft,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${checkProgress})`,
        }}
      >
        <svg width={20} height={20} viewBox="0 0 20 20">
          <path
            d="M4 10 L8 14 L16 6"
            fill="none"
            stroke={colors.offWhite}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={20}
            strokeDashoffset={interpolate(checkProgress, [0, 1], [20, 0])}
          />
        </svg>
      </div>

      <span
        style={{
          fontFamily: lora,
          fontSize: 24,
          color: colors.forestBottle,
          fontWeight: 500,
        }}
      >
        {text}
      </span>
    </div>
  );
};

// Scene 4: Quote + CTA
const Scene4_CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Quote animations
  const quoteMarkProgress = spring({
    frame,
    fps,
    config: springs.smooth,
    delay: 5,
  });

  const quoteProgress = spring({
    frame: frame - 15,
    fps,
    config: springs.smooth,
  });

  // CTA animations
  const ctaProgress = spring({
    frame: frame - 60,
    fps,
    config: springs.bouncy,
  });

  const subtextProgress = spring({
    frame: frame - 80,
    fps,
    config: springs.smooth,
  });

  const pulseScale = 1 + Math.sin(frame / 10) * 0.02;

  return (
    <AbsoluteFill>
      <GradientBackground variant="cream" />
      <GeometricPattern color={colors.goldSoft} opacity={0.05} />
      <OrganicBlobs color={colors.rosePowder} opacity={0.12} />

      <AbsoluteFill
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 60,
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: 800 }}>
          {/* Quote mark */}
          <div
            style={{
              fontFamily: playfair,
              fontSize: 150,
              color: colors.goldSoft,
              opacity: quoteMarkProgress * 0.3,
              lineHeight: 0.5,
              marginBottom: -40,
            }}
          >
            "
          </div>

          {/* Quote text */}
          <div
            style={{
              opacity: quoteProgress,
              transform: `translateY(${interpolate(quoteProgress, [0, 1], [30, 0])}px)`,
              marginBottom: 60,
            }}
          >
            <div
              style={{
                fontFamily: lora,
                fontSize: 36,
                fontStyle: 'italic',
                color: colors.forestBottle,
                lineHeight: 1.5,
              }}
            >
              Le corps est une{' '}
              <span style={{ position: 'relative', display: 'inline-block' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: -6,
                    right: -6,
                    top: '10%',
                    height: '80%',
                    backgroundColor: colors.goldSoft,
                    opacity: 0.3,
                    borderRadius: 6,
                    transform: `scaleX(${quoteProgress})`,
                    transformOrigin: 'left',
                  }}
                />
                <span style={{ position: 'relative' }}>amanah</span>
              </span>{' '}
              qui nous est pretee
            </div>
          </div>

          {/* CTA */}
          <div
            style={{
              opacity: ctaProgress,
              transform: `scale(${ctaProgress * pulseScale})`,
            }}
          >
            <div
              style={{
                display: 'inline-block',
                padding: '20px 50px',
                background: `linear-gradient(135deg, ${colors.forestBottle} 0%, #1a2e23 100%)`,
                borderRadius: 50,
                boxShadow: `0 10px 40px ${colors.forestBottle}40`,
              }}
            >
              <span
                style={{
                  fontFamily: cormorant,
                  fontSize: 26,
                  fontWeight: 600,
                  color: colors.offWhite,
                  letterSpacing: 2,
                }}
              >
                Disponible sur Amazon
              </span>
            </div>
          </div>

          {/* Subtext */}
          <div
            style={{
              opacity: subtextProgress,
              transform: `translateY(${interpolate(subtextProgress, [0, 1], [15, 0])}px)`,
              marginTop: 25,
            }}
          >
            <div
              style={{
                fontFamily: lora,
                fontSize: 20,
                color: colors.sage,
              }}
            >
              Format broche & Kindle
            </div>
          </div>
        </div>
      </AbsoluteFill>

      <GrowingVine side="left" delay={0.2} />
      <GrowingVine side="right" delay={0.4} />
      <CornerOrnament position="topLeft" delay={0.3} />
      <CornerOrnament position="topRight" delay={0.4} />
      <CornerOrnament position="bottomLeft" delay={0.5} />
      <CornerOrnament position="bottomRight" delay={0.6} />
      <FloatingLeaves count={4} delay={0.8} />
      <NoiseTexture opacity={0.025} />
      <Vignette intensity={0.25} />
    </AbsoluteFill>
  );
};

// Main composition
export const BookPromo: React.FC = () => {
  const { fps } = useVideoConfig();

  const scene1Duration = 4 * fps;
  const scene2Duration = 5 * fps;
  const scene3Duration = 5 * fps;
  const scene4Duration = 4.5 * fps;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.offWhite }}>
      <Sequence from={0} durationInFrames={scene1Duration} premountFor={30}>
        <FadeWrapper>
          <Scene1_BookReveal />
        </FadeWrapper>
      </Sequence>

      <Sequence from={scene1Duration - 15} durationInFrames={scene2Duration + 15} premountFor={30}>
        <FadeWrapper fadeIn fadeOut>
          <Scene2_Statistics />
        </FadeWrapper>
      </Sequence>

      <Sequence
        from={scene1Duration + scene2Duration - 30}
        durationInFrames={scene3Duration + 15}
        premountFor={30}
      >
        <FadeWrapper fadeIn fadeOut>
          <Scene3_Program />
        </FadeWrapper>
      </Sequence>

      <Sequence
        from={scene1Duration + scene2Duration + scene3Duration - 45}
        durationInFrames={scene4Duration + 45}
        premountFor={30}
      >
        <FadeWrapper fadeIn>
          <Scene4_CTA />
        </FadeWrapper>
      </Sequence>
    </AbsoluteFill>
  );
};

// Fade wrapper
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
    opacity *= interpolate(frame, [0, fadeDuration], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  }

  if (fadeOut) {
    opacity *= interpolate(
      frame,
      [durationInFrames - fadeDuration, durationInFrames],
      [1, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
  }

  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};
