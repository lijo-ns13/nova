/**
 * Format a date string into a human-readable format
 * @param dateString Date string to format
 * @returns Formatted date string
 */
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return "Present";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
};

/**
 * Parse comma-separated technologies string into an array
 * @param techString String or array of technologies
 * @returns Array of technologies
 */
export const parseTechnologies = (techString: any): string[] => {
  if (!techString) return [];
  if (Array.isArray(techString)) {
    if (techString.length > 0) {
      return typeof techString[0] === "string"
        ? techString[0].split(",").map((tech) => tech.trim())
        : techString;
    }
    return [];
  }
  if (typeof techString === "string") {
    return techString.split(",").map((tech) => tech.trim());
  }
  return [];
};
