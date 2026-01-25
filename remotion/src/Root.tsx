import React from 'react';
import { Composition, Folder } from 'remotion';
import { BrandStory } from './compositions/BrandStory';
import { BookPromo } from './compositions/BookPromo';
import { ConsultationsPromo } from './compositions/ConsultationsPromo';
import { videoConfig } from './theme';

/**
 * Mon Remède Instagram Promo Videos
 *
 * 3 premium promotional videos for Instagram Reels:
 * 1. BrandStory - Brand introduction and philosophy
 * 2. BookPromo - "La Santé dans l'Assiette" book promotion
 * 3. ConsultationsPromo - Consultation services showcase
 *
 * All videos are in 1080x1920 (9:16) format for Instagram Reels/Stories
 */

export const RemotionRoot: React.FC = () => {
  const { width, height, fps } = videoConfig;

  return (
    <Folder name="MonRemede-Instagram">
      {/* Video 1: Brand Story */}
      <Composition
        id="BrandStory"
        component={BrandStory}
        durationInFrames={18 * fps} // ~18 seconds
        fps={fps}
        width={width}
        height={height}
        defaultProps={{}}
      />

      {/* Video 2: Book Promo */}
      <Composition
        id="BookPromo"
        component={BookPromo}
        durationInFrames={18 * fps} // ~18 seconds
        fps={fps}
        width={width}
        height={height}
        defaultProps={{}}
      />

      {/* Video 3: Consultations Promo */}
      <Composition
        id="ConsultationsPromo"
        component={ConsultationsPromo}
        durationInFrames={19 * fps} // ~19 seconds
        fps={fps}
        width={width}
        height={height}
        defaultProps={{}}
      />
    </Folder>
  );
};
