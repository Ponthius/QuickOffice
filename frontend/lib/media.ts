export function mediaUrl(value?: string | null) {
  if (!value) return "";

  try {
    const url = new URL(value, window.location.origin);
    if (url.pathname.startsWith("/media/")) {
      return `${url.pathname}${url.search}`;
    }
  } catch {
    // Keep relative values usable if the backend already returned one.
  }

  return value;
}
