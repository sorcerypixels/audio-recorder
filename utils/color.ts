export function darkenHexColor(hex: string, percent: number): string {
  let r = 0,
    g = 0,
    b = 0;

  // Remove leading `#` if present
  hex = hex.replace(/^#/, "");

  // Parse short hex form (e.g. #abc)
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else {
    throw new Error("Invalid hex color format");
  }

  // Darken each channel
  r = Math.max(0, Math.floor(r * (1 - percent)));
  g = Math.max(0, Math.floor(g * (1 - percent)));
  b = Math.max(0, Math.floor(b * (1 - percent)));

  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}

export function getAvatarColor(name: string): string {
  const avatarColors = ["#FF974A", "#3ED598", "#FFC542", "#FF565E"];

  let hash = 0;

  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % avatarColors.length;
  return avatarColors[index];
}
