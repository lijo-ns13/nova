export function generateUsername(name: string): string {
  const baseUsername = name.toLowerCase().replace(/\s+/g, "");
  const randomSuffix = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  return `${baseUsername}${randomSuffix}`;
}
