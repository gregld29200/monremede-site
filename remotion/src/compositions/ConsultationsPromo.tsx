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

// Scene 1: Problem Identification
const Scene1_Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const symptoms = [
    { text: 'Fatigue chronique', delay: 0.2 },
    { text: 'Troubles digestifs', delay: 0.4 },
    { text: 'Desequilibre hormonal', delay: 0.6 },
    { text: 'Stress & anxiete', delay: 0.8 },
  ];

  // Opening animation
  const openingProgress = spring({
    frame,
    fps,
    config: springs.smooth,
    delay: 5,
  });

  // Transition text animation
  const transitionProgress = spring({
    frame: frame - 100,
    fps,
    config: springs.smooth,
  });

  return (
    <AbsoluteFill>
      <GradientBackground variant="warm" />
      <OrganicBlobs color={colors.rosePowder} opacity={0.15} />

      <AbsoluteFill
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 60,
        }}
      >
        <div style={{ textAlign: 'center', width: '100%' }}>
          {/* Opening question */}
          <div
            style={{
              opacity: openingProgress,
              transform: `translateY(${interpolate(openingProgress, [0, 1], [20, 0])}px)`,
              marginBottom: 40,
            }}
          >
            <div
              style={{
                fontFamily: cormorant,
                fontSize: 32,
                color: colors.sage,
                letterSpacing: 3,
              }}
            >
              Tu souffres de...
            </div>
          </div>

          {/* Symptoms appearing one by one */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 25,
              alignItems: 'center',
            }}
          >
            {symptoms.map((symptom, i) => (
              <SymptomBubble key={i} text={symptom.text} delay={symptom.delay} index={i} />
            ))}
          </div>

          {/* Transition text */}
          <div
            style={{
              opacity: transitionProgress,
              transform: `translateY(${interpolate(transitionProgress, [0, 1], [20, 0])}px)`,
              marginTop: 50,
            }}
          >
            <div
              style={{
                fontFamily: playfair,
                fontSize: 36,
                fontWeight: 600,
                color: colors.forestBottle,
              }}
            >
              Tu n'es pas seule.
            </div>
          </div>
        </div>
      </AbsoluteFill>

      <CornerOrnament position="topLeft" delay={0.3} />
      <CornerOrnament position="bottomRight" delay={0.5} />
      <NoiseTexture opacity={0.025} />
      <Vignette intensity={0.25} color={colors.beigeWarm} />
    </AbsoluteFill>
  );
};

const SymptomBubble: React.FC<{ text: string; delay: number; index: number }> = ({
  text,
  delay,
  index,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay * fps,
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  const scale = interpolate(progress, [0, 1], [0.7, 1], {
    extrapolateRight: 'clamp',
  });

  // Alternating sides
  const translateX = interpolate(
    progress,
    [0, 1],
    [index % 2 === 0 ? -30 : 30, 0],
    { extrapolateRight: 'clamp' }
  );

  const bubbleColors = [colors.rosePowder, colors.sageLight, colors.beigeWarm, colors.roseSoft];

  return (
    <div
      style={{
        opacity: progress,
        transform: `scale(${scale}) translateX(${translateX}px)`,
        padding: '18px 40px',
        background: bubbleColors[index % bubbleColors.length],
        borderRadius: 50,
        boxShadow: `0 6px 25px ${colors.ink}10`,
      }}
    >
      <span
        style={{
          fontFamily: lora,
          fontSize: 26,
          color: colors.forestBottle,
          fontWeight: 500,
        }}
      >
        {text}
      </span>
    </div>
  );
};

// Scene 2: Solution Introduction
const Scene2_Solution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Glowing circle animation
  const glowProgress = spring({
    frame: frame - 20,
    fps,
    config: springs.gentle,
  });

  const glowScale = interpolate(glowProgress, [0, 1], [0.5, 1], {
    extrapolateRight: 'clamp',
  });

  const pulseOpacity = 0.3 + Math.sin(frame / 12) * 0.15;

  // Text animations
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

  const subtitleProgress = spring({
    frame: frame - 50,
    fps,
    config: springs.smooth,
  });

  const tagsProgress = spring({
    frame: frame - 90,
    fps,
    config: springs.smooth,
  });

  return (
    <AbsoluteFill>
      <GradientBackground variant="forest" />
      <LightRays color={colors.sage} opacity={0.08} />

      <AbsoluteFill
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 60,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          {/* Glowing decorative element */}
          <div
            style={{
              width: 160,
              height: 160,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${colors.goldSoft}40 0%, transparent 70%)`,
              transform: `scale(${glowScale})`,
              opacity: pulseOpacity,
              marginBottom: 40,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          />

          {/* Title line 1 */}
          <div
            style={{
              opacity: title1Progress,
              transform: `translateY(${interpolate(title1Progress, [0, 1], [30, 0])}px)`,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                fontFamily: playfair,
                fontSize: 52,
                fontWeight: 600,
                color: colors.offWhite,
              }}
            >
              Des consultations
            </div>
          </div>

          {/* Title line 2 with highlight */}
          <div
            style={{
              opacity: title2Progress,
              transform: `translateY(${interpolate(title2Progress, [0, 1], [30, 0])}px)`,
              marginBottom: 40,
            }}
          >
            <span
              style={{
                fontFamily: playfair,
                fontSize: 52,
                fontWeight: 600,
                color: colors.offWhite,
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
                  transform: `scaleX(${title2Progress})`,
                  transformOrigin: 'left',
                }}
              />
              <span style={{ position: 'relative' }}>personnalisees</span>
            </span>
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
                fontFamily: cormorant,
                fontSize: 26,
                color: colors.sageLight,
                letterSpacing: 1,
              }}
            >
              Avec Oum Soumayya, praticienne depuis 16 ans
            </div>
          </div>

          {/* Specialties */}
          <div
            style={{
              marginTop: 40,
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 15,
              opacity: tagsProgress,
              transform: `translateY(${interpolate(tagsProgress, [0, 1], [20, 0])}px)`,
            }}
          >
            {['Naturopathie', 'Hijama', 'Micronutrition'].map((specialty, i) => (
              <SpecialtyTag key={i} text={specialty} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </AbsoluteFill>

      <GrowingVine side="left" delay={0.2} />
      <GrowingVine side="right" delay={0.4} />
      <NoiseTexture opacity={0.04} />
      <Vignette intensity={0.5} />
    </AbsoluteFill>
  );
};

const SpecialtyTag: React.FC<{ text: string; delay: number }> = ({ text, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay * fps,
    fps,
    config: springs.bouncy,
  });

  return (
    <div
      style={{
        opacity: progress,
        transform: `scale(${progress})`,
        padding: '10px 25px',
        background: `${colors.sage}30`,
        borderRadius: 30,
        border: `1px solid ${colors.sage}50`,
      }}
    >
      <span
        style={{
          fontFamily: lora,
          fontSize: 18,
          color: colors.offWhite,
        }}
      >
        {text}
      </span>
    </div>
  );
};

// Scene 3: Consultation Formulas
const Scene3_Formulas: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const formulas = [
    { name: 'Decouverte', price: '50', icon: '🌱', delay: 0.3 },
    { name: 'Essentiel', price: '50', icon: '🌿', delay: 0.45 },
    { name: 'Suivi', price: '50', icon: '🍃', delay: 0.6 },
    { name: 'Complet', price: '110', icon: '✨', highlight: true, delay: 0.75 },
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
      <GradientBackground variant="cream" />
      <GeometricPattern color={colors.sage} opacity={0.05} />

      <AbsoluteFill
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 40,
        }}
      >
        <div style={{ textAlign: 'center', width: '100%' }}>
          {/* Title */}
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
                fontSize: 44,
                fontWeight: 600,
                color: colors.forestBottle,
              }}
            >
              4 formules adaptees
            </div>
          </div>

          <div
            style={{
              opacity: subtitleProgress,
              transform: `translateY(${interpolate(subtitleProgress, [0, 1], [20, 0])}px)`,
              marginBottom: 50,
            }}
          >
            <div
              style={{
                fontFamily: cormorant,
                fontSize: 30,
                color: colors.sage,
                letterSpacing: 2,
              }}
            >
              a tes besoins
            </div>
          </div>

          {/* Formula cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 20,
              maxWidth: 700,
              margin: '0 auto',
            }}
          >
            {formulas.map((formula, i) => (
              <FormulaCard key={i} {...formula} />
            ))}
          </div>
        </div>
      </AbsoluteFill>

      <CornerOrnament position="topLeft" delay={0.2} size={120} />
      <CornerOrnament position="topRight" delay={0.3} size={120} />
      <FloatingLeaves count={4} delay={0.5} />
      <NoiseTexture opacity={0.025} />
      <Vignette intensity={0.2} />
    </AbsoluteFill>
  );
};

const FormulaCard: React.FC<{
  name: string;
  price: string;
  icon: string;
  highlight?: boolean;
  delay: number;
}> = ({ name, price, icon, highlight = false, delay }) => {
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

  // Pulsing effect for highlighted card
  const pulseScale = highlight ? 1 + Math.sin(frame / 10) * 0.02 : 1;

  return (
    <div
      style={{
        opacity: progress,
        transform: `scale(${scale * pulseScale})`,
        padding: 25,
        background: highlight
          ? `linear-gradient(135deg, ${colors.forestBottle} 0%, #1a2e23 100%)`
          : colors.offWhite,
        borderRadius: 20,
        boxShadow: highlight
          ? `0 15px 50px ${colors.forestBottle}40`
          : `0 8px 30px ${colors.sage}15`,
        border: highlight ? 'none' : `1px solid ${colors.sageLight}40`,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 36, marginBottom: 10 }}>{icon}</div>
      <div
        style={{
          fontFamily: cormorant,
          fontSize: 22,
          fontWeight: 600,
          color: highlight ? colors.offWhite : colors.forestBottle,
          letterSpacing: 1,
          marginBottom: 8,
        }}
      >
        {name}
      </div>
      <div
        style={{
          fontFamily: playfair,
          fontSize: 32,
          fontWeight: 700,
          color: highlight ? colors.goldSoft : colors.forestBottle,
        }}
      >
        {price}€
      </div>
    </div>
  );
};

// Scene 4: CTA
const Scene4_CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Heart beat animation
  const heartScale = 1 + Math.sin(frame / 6) * 0.08;

  // Text animations
  const emojiProgress = spring({
    frame,
    fps,
    config: springs.bouncy,
    delay: 5,
  });

  const title1Progress = spring({
    frame: frame - 10,
    fps,
    config: springs.smooth,
  });

  const title2Progress = spring({
    frame: frame - 30,
    fps,
    config: springs.smooth,
  });

  const ctaProgress = spring({
    frame: frame - 50,
    fps,
    config: springs.bouncy,
  });

  const urlProgress = spring({
    frame: frame - 70,
    fps,
    config: springs.smooth,
  });

  const pulseScale = 1 + Math.sin(frame / 8) * 0.03;

  return (
    <AbsoluteFill>
      <GradientBackground variant="sage" />
      <OrganicBlobs color={colors.offWhite} opacity={0.1} />
      <LightRays color={colors.goldSoft} opacity={0.1} />

      <AbsoluteFill
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 60,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          {/* Heart icon */}
          <div
            style={{
              fontSize: 60,
              marginBottom: 30,
              transform: `scale(${emojiProgress * heartScale})`,
              opacity: emojiProgress,
            }}
          >
            🤲
          </div>

          {/* Title line 1 */}
          <div
            style={{
              opacity: title1Progress,
              transform: `translateY(${interpolate(title1Progress, [0, 1], [30, 0])}px)`,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                fontFamily: playfair,
                fontSize: 56,
                fontWeight: 700,
                color: colors.offWhite,
              }}
            >
              Prends soin de toi
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
                fontSize: 48,
                fontWeight: 600,
                color: colors.offWhite,
              }}
            >
              Tu le{' '}
            </span>
            <span
              style={{
                fontFamily: playfair,
                fontSize: 48,
                fontWeight: 600,
                color: colors.offWhite,
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
              <span style={{ position: 'relative' }}>merites</span>
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
                background: colors.offWhite,
                borderRadius: 50,
                boxShadow: `0 15px 50px rgba(0,0,0,0.2)`,
              }}
            >
              <span
                style={{
                  fontFamily: cormorant,
                  fontSize: 28,
                  fontWeight: 600,
                  color: colors.forestBottle,
                  letterSpacing: 2,
                }}
              >
                Prendre rendez-vous
              </span>
            </div>
          </div>

          {/* URL */}
          <div
            style={{
              opacity: urlProgress,
              transform: `translateY(${interpolate(urlProgress, [0, 1], [15, 0])}px)`,
              marginTop: 25,
            }}
          >
            <div
              style={{
                fontFamily: lora,
                fontSize: 22,
                color: colors.offWhite,
                opacity: 0.9,
              }}
            >
              monremede.com/consultations
            </div>
          </div>
        </div>
      </AbsoluteFill>

      <CornerOrnament position="topLeft" delay={0.2} />
      <CornerOrnament position="topRight" delay={0.3} />
      <CornerOrnament position="bottomLeft" delay={0.4} />
      <CornerOrnament position="bottomRight" delay={0.5} />
      <FloatingLeaves count={6} delay={0.6} />
      <NoiseTexture opacity={0.03} />
      <Vignette intensity={0.35} />
    </AbsoluteFill>
  );
};

// Main composition
export const ConsultationsPromo: React.FC = () => {
  const { fps } = useVideoConfig();

  const scene1Duration = 4.5 * fps;
  const scene2Duration = 5 * fps;
  const scene3Duration = 5 * fps;
  const scene4Duration = 4.5 * fps;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.offWhite }}>
      <Sequence from={0} durationInFrames={scene1Duration} premountFor={30}>
        <FadeWrapper>
          <Scene1_Problem />
        </FadeWrapper>
      </Sequence>

      <Sequence from={scene1Duration - 15} durationInFrames={scene2Duration + 15} premountFor={30}>
        <FadeWrapper fadeIn fadeOut>
          <Scene2_Solution />
        </FadeWrapper>
      </Sequence>

      <Sequence
        from={scene1Duration + scene2Duration - 30}
        durationInFrames={scene3Duration + 15}
        premountFor={30}
      >
        <FadeWrapper fadeIn fadeOut>
          <Scene3_Formulas />
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
