"use client";

import { useEffect } from "react";

export function usePWA() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      console.log("[PWA] Service Workers not supported");
      return;
    }

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        });

        console.log("[PWA] Service Worker registered:", registration);

        // Handle updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                console.log("[PWA] Update available");
                // Show update prompt to user
                if (typeof window !== "undefined") {
                  window.dispatchEvent(
                    new CustomEvent("sw-update-available", { detail: newWorker })
                  );
                }
              }
            });
          }
        });

        // Handle controller change
        let refreshing = false;
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          if (refreshing) return;
          refreshing = true;
          window.location.reload();
        });
      } catch (error) {
        console.error("[PWA] Service Worker registration failed:", error);
      }
    };

    // Register after page load for better performance
    if (document.readyState === "complete") {
      registerServiceWorker();
    } else {
      window.addEventListener("load", registerServiceWorker);
    }

    return () => {
      window.removeEventListener("load", registerServiceWorker);
    };
  }, []);
}

export function useOfflineStatus() {
  const [isOnline, setIsOnline] = useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}
