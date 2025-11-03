import { useEffect, useRef, useState, useCallback } from "react";
import { fetcher } from "@/features/summary/fetcher";

type Options<T = unknown> = {
  interval?: number;
  autoStop?: (data: T) => boolean;
};

export function useControlledFetch<T = unknown>(
  url?: string,
  options: Options<T> = {}
) {
  const { interval = 1500, autoStop } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const activeRef = useRef(false);
  const autoStopRef = useRef(autoStop);

  // update autoStopRef tanpa trigger re-render
  useEffect(() => {
    autoStopRef.current = autoStop;
  }, [autoStop]);

  // Reset data & active state ketika URL berubah
  useEffect(() => {
    setData(null);
    setError(null);
    activeRef.current = false;
    setActive(false);
  }, [url]);

  const fetchData = useCallback(async () => {
    if (!url || !activeRef.current) return;

    try {
      setLoading(true);
      const result = await fetcher<T>(url);

      // cek autoStop SEBELUM setData untuk avoid race condition
      if (autoStopRef.current?.(result)) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        activeRef.current = false;
        setActive(false);
        setData(result); // set data terakhir
        setLoading(false);
        return;
      }

      setData(result);
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : "Unknown error";
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [url]);

  const start = useCallback(() => {
    if (!url) return;
    // Allow re-starting even if already active (for retry scenarios)
    if (activeRef.current) {
      // Clear existing interval first
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setData(null); // Reset data for fresh start
      setError(null);
    }
    activeRef.current = true;
    setActive(true);
    fetchData();
    timerRef.current = setInterval(fetchData, interval);
  }, [fetchData, interval, url]);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    activeRef.current = false;
    setActive(false);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      activeRef.current = false;
    };
  }, []);

  return { data, loading, error, active, start, stop };
}
