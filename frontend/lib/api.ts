export async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`/api${path}`, {
    ...options,
    credentials: "include",
  });
  if (res.status === 403 || res.status === 401) {
    window.location.href = "/login";
    throw new Error("Not authenticated");
  }
  return res;
}