// Generates a clean, professional SVG Data URL for student & staff initials avatars

export const getInitialsAvatar = (name: string): string => {
  if (!name) name = 'User';
  const parts = name.trim().split(/\s+/);
  let initials = '';
  if (parts.length >= 2) {
    initials = `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  } else if (parts.length === 1) {
    initials = parts[0].slice(0, 2).toUpperCase();
  } else {
    initials = 'US';
  }

  // Use crisp, professional solid Royal Blue background
  const bg = '#1d4ed8';
  const text = '#ffffff';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
    <rect width="100" height="100" rx="50" fill="${bg}" />
    <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="${text}" font-family="Inter, system-ui, sans-serif" font-size="38" font-weight="700">${initials}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};
