/**
 * Get initials from plant name for placeholder display
 */
export function getPlantInitials(
  commonName: string | null,
  scientificName: string | null
): string {
  const name = commonName || scientificName || "";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
