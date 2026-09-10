/** Read an optional environment variable, returning undefined when unset/empty. */
export function optionalEnv(key: string): string | undefined {
  const value = process.env[key];
  return value && value.trim() !== "" ? value : undefined;
}

/** Read a required environment variable or throw (use only inside request handlers). */
export function requireEnv(key: string): string {
  const value = optionalEnv(key);
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

export const siteUrl = (): string =>
  (optionalEnv("NEXT_PUBLIC_SITE_URL") ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  );
