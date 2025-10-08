"use client";

/**
 * Hook to check if we have cached data in localStorage
 * @returns Boolean indicating if cached data exists
 */
export function useHasCachedData() {
  if (typeof window === "undefined") return false;

  try {
    const cachedData = localStorage.getItem("POKEDEX_CACHE");
    return cachedData !== null;
  } catch {
    return false;
  }
}

/**
 * Hook to clear the persisted query cache
 * @returns Function to clear the cache
 */
export function useClearPersistedCache() {
  return () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("POKEDEX_CACHE");
      } catch (error) {
        console.warn("Failed to clear persisted cache:", error);
      }
    }
  };
}
