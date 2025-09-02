export const AVATAR_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
  '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
  '#10AC84', '#EE5A24', '#0652DD', '#9C88FF', '#FFC312',
  '#C44569', '#40407A', '#706FD3', '#F97F51', '#1DD1A1'
];

interface AvatarOptions {
  size?: number;
  backgroundColor?: string;
  textColor?: string;
  fontFamily?: string;
  fontSize?: number;
  format?: 'svg' | 'dataUrl';
  rounded?: boolean;
}

function getInitials(name: string, maxLen: number = 2): string {
  if (!name || typeof name !== "string") return "?";
  const cleanName = name.trim().replace(/\s+/g, ' ');
  if (cleanName.length === 0) return "?";

  const words = cleanName.split(/\s+/).filter(Boolean);
  return words.slice(0, maxLen).map(word => word.charAt(0).toUpperCase()).join('');
}


function generateColorFromInitials(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convert to HSL for better color distribution
  const hue = Math.abs(hash) % 360;
  const saturation = 65; // Medium saturation for pleasant colors
  const lightness = 45;  // Medium lightness for good contrast

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function getAvatarColor(str: string, useHashColor: boolean = false): string {
  if (useHashColor) {
    return generateColorFromInitials(str);
  }

  // Use predefined palette
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const colorIndex = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[colorIndex];
}

export function generateSVG(name: string, options: AvatarOptions) {
  const {
    size = 40,
    backgroundColor,
    textColor = '#FFFFFF',
    fontFamily = 'helvetica, arial, sans-serif',
    fontSize = size / 2,
    rounded = true
  } = options;

  const cleanInitials = getInitials(name) || '?';
  const bgColor = backgroundColor || getAvatarColor(cleanInitials);
  const calculatedFontSize = fontSize || Math.round(size * 0.4);
  const radius = rounded ? size / 2 : 0;

  return <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
    <rect
      width={size}
      height={size}
      rx={radius}
      ry={radius}
      fill={bgColor}
    />
    <text
      x="50%"
      y="50%"
      dy="0.1em"
      dominantBaseline="middle"
      textAnchor="middle"
      fill={textColor}
      fontFamily={fontFamily}
      fontSize={calculatedFontSize}
      fontWeight={500}
    >
      {cleanInitials}
    </text>
  </svg>


}