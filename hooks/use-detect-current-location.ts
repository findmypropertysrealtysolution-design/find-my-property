"use client";

import { useCallback, useState } from "react";
import {
  detectCurrentLocation,
  type DetectCurrentLocationOutcome,
} from "@/lib/detect-current-location";

/**
 * Wraps {@link detectCurrentLocation} with React pending state for buttons and async handlers.
 */
export function useDetectCurrentLocation() {
  const [isPending, setIsPending] = useState(false);

  const run = useCallback(async (): Promise<DetectCurrentLocationOutcome> => {
    setIsPending(true);
    try {
      return await detectCurrentLocation();
    } finally {
      setIsPending(false);
    }
  }, []);

  return { run, isPending };
}
