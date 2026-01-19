import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

export default function AppleIcon() {
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
          borderRadius: '22%',
        }}
      >
        <svg
          width="140"
          height="140"
          viewBox="0 0 512 512"
          style={{ marginTop: '-10px' }}
        >
          {/* Crescent moon */}
          <path
            d="M120 100 C40 180, 40 360, 160 440 C60 360, 60 180, 160 100 C145 98, 130 98, 120 100"
            fill="#2D4A3E"
            opacity="0.85"
          />
          {/* Cloche dome */}
          <path
            d="M160 360 C160 220, 210 140, 300 140 C390 140, 440 220, 440 360"
            fill="none"
            stroke="#c4a35a"
            strokeWidth="20"
            strokeLinecap="round"
          />
          {/* Cloche base */}
          <line
            x1="140"
            y1="360"
            x2="460"
            y2="360"
            stroke="#c4a35a"
            strokeWidth="20"
            strokeLinecap="round"
          />
          {/* Cloche knob */}
          <circle cx="300" cy="115" r="25" fill="#c4a35a" />
          {/* Plant stem */}
          <path
            d="M300 360 L300 200"
            stroke="#2D4A3E"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Leaves */}
          <ellipse
            cx="260"
            cy="280"
            rx="35"
            ry="55"
            fill="#2D4A3E"
            opacity="0.7"
            transform="rotate(-25 260 280)"
          />
          <ellipse
            cx="340"
            cy="260"
            rx="35"
            ry="55"
            fill="#2D4A3E"
            opacity="0.7"
            transform="rotate(25 340 260)"
          />
          <ellipse
            cx="300"
            cy="210"
            rx="20"
            ry="40"
            fill="#2D4A3E"
            opacity="0.7"
            transform="rotate(0 300 210)"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
