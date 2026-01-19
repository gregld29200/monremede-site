import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f7f4ed',
          borderRadius: '4px',
        }}
      >
        <svg width="28" height="28" viewBox="0 0 512 512">
          {/* Simplified crescent moon */}
          <path
            d="M100 80 C20 180, 20 380, 160 460 C40 360, 40 160, 160 80 C140 78, 120 78, 100 80"
            fill="#2D4A3E"
            opacity="0.8"
          />
          {/* Cloche dome - thicker for visibility */}
          <path
            d="M150 380 C150 220, 200 130, 310 130 C420 130, 470 220, 470 380"
            fill="none"
            stroke="#c4a35a"
            strokeWidth="36"
            strokeLinecap="round"
          />
          {/* Cloche base */}
          <line
            x1="130"
            y1="380"
            x2="490"
            y2="380"
            stroke="#c4a35a"
            strokeWidth="36"
            strokeLinecap="round"
          />
          {/* Cloche knob */}
          <circle cx="310" cy="95" r="40" fill="#c4a35a" />
          {/* Simple plant - just a vertical line with leaves */}
          <line
            x1="310"
            y1="380"
            x2="310"
            y2="180"
            stroke="#2D4A3E"
            strokeWidth="20"
            strokeLinecap="round"
          />
          {/* Simplified leaves as circles */}
          <circle cx="260" cy="290" r="50" fill="#2D4A3E" opacity="0.7" />
          <circle cx="360" cy="260" r="50" fill="#2D4A3E" opacity="0.7" />
          <circle cx="310" cy="200" r="35" fill="#2D4A3E" opacity="0.7" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
