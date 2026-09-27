"use client";
import { useEffect, useState } from "react";

import { STATS_FALLBACK, type Stats } from "../constants";

export function useStats(): Stats {
  const [stats, setStats] = useState<Stats>(STATS_FALLBACK);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/stats", { headers: { Accept: "application/json" } })
      .then((res) => (res.ok ? (res.json() as Promise<Stats>) : null))
      .then((live) => {
        if (!cancelled && live) setStats(live);
      })
      .catch(() => {
        /* offline or rate-limited — the fallback already rendered */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return stats;
}
