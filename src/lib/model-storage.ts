const MODEL_COOKIE_KEY = "selected-model";
const DEFAULT_MODEL_ID = "gemini-2.0-flash";

export async function getSelectedModelServer(): Promise<string> {
  const { cookies } = await import("next/headers");

  try {
    const cookieStore = await cookies();
    const modelCookie = cookieStore.get(MODEL_COOKIE_KEY);
    return modelCookie?.value || DEFAULT_MODEL_ID;
  } catch (error) {
    console.warn("Failed to read model from cookies:", error);
    return DEFAULT_MODEL_ID;
  }
}

export function getSelectedModel(): string {
  if (typeof window === "undefined") return DEFAULT_MODEL_ID;

  try {
    const cookies = document.cookie.split(";");
    const modelCookie = cookies.find((cookie) =>
      cookie.trim().startsWith(`${MODEL_COOKIE_KEY}=`),
    );

    if (modelCookie) {
      return modelCookie.split("=")[1].trim();
    }
    return DEFAULT_MODEL_ID;
  } catch (error) {
    console.warn("Failed to read model from cookies:", error);
    return DEFAULT_MODEL_ID;
  }
}

export function saveSelectedModel(modelId: string): void {
  if (typeof window === "undefined") return;

  try {
    // Set cookie with 1 year expiration
    document.cookie = `${MODEL_COOKIE_KEY}=${modelId}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  } catch (error) {
    console.warn("Failed to save model to cookies:", error);
  }
}

export function clearSelectedModel(): void {
  if (typeof window === "undefined") return;

  try {
    document.cookie = `${MODEL_COOKIE_KEY}=; path=/; max-age=0`;
  } catch (error) {
    console.warn("Failed to clear model from cookies:", error);
  }
}
