export const flowerColorMap: Record<string, string> = {
  purple: "#9333EA",
  pink: "#EC4899",
  white: "#F5F5F5",
  brown: "#92400E",
  red: "#DC2626",
  orange: "#EA580C",
  yellow: "#EAB308",
  blue: "#3B82F6",
  green: "#22C55E",
  lavender: "#C084FC",
  lilac: "#E9D5FF",
  ivory: "#FFFFF0",
  cream: "#FFFDD0",
  "light green": "#86EFAC",
  "blue-grey": "#64748B",
};

export function parseFlowerColors(colorString: string | null): string[] {
  if (!colorString) return [];
  
  const colors = colorString
    .toLowerCase()
    .split(/[,;]/)
    .map(c => c.trim())
    .filter(Boolean);
  
  return colors.map(color => {
    // Check for exact matches first
    if (flowerColorMap[color]) {
      return flowerColorMap[color];
    }
    
    // Check for partial matches
    for (const [key, value] of Object.entries(flowerColorMap)) {
      if (color.includes(key) || key.includes(color)) {
        return value;
      }
    }
    
    // Default to a neutral color
    return "#94A3B8";
  });
}

export function formatPrice(price: number | null): string {
  if (price === null) return "—";
  return `€${price.toFixed(2)}`;
}
