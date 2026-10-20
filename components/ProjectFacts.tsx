"use client";

import { useEffect, useState } from "react";

import type { GhProjectRepo } from "../app/api/github/route";

export type ProjectFacts = {
  /** Whether the project's live deployment answered the request. */
  live: boolean;
  /** The repository behind the project, when there is a public one. */
  repo: {
    name: string;
    url: string | null;
    language: string | null;
    stars: number;
    pushedAt: string | null;
  } | null;
};

function relativeDate(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

/**
 * The facts shown on a project card, derived from the repository and the
 * live deployment rather than asserted.
 *
 * Everything here is checked: the language comes from the GitHub API, the
 * star count comes from GitHub, the "last pushed" date comes from GitHub,
 * and "live" is the actual HTTP status of the deployment. If a project has
 * no public repository, only the deployment status is shown — the card never
 * implies a source repository that is not there.
 */
export function ProjectFactsList({
  projectId,
  accent,
}: {
  projectId: string;
  accent: string;
}) {
  const [facts, setFacts] = useState<ProjectFacts | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/github");
        if (!res.ok) throw new Error(`api ${res.status}`);
        const data = (await res.json()) as {
          ok?: boolean;
          projectRepos?: GhProjectRepo[];
        };
        if (cancelled) return;
        if (data.ok === false || !Array.isArray(data.projectRepos)) return;
        const match = data.projectRepos.find((r) => r.id === projectId);
        if (!match) return;
        setFacts({
          live: match.live,
          repo: match.repo
            ? {
                name: match.repo,
                url: match.html_url,
                language: match.language,
                stars: match.stars,
                pushedAt: match.pushedAt,
              }
            : null,
        });
      } catch {
        // The card keeps its static copy when the API is unavailable.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  if (!facts) return null;

  const items: { label: string; value: string }[] = [];

  items.push({
    label: "Deployment",
    value: facts.live ? "Live" : "Offline",
  });

  if (facts.repo) {
    items.push({
      label: "Language",
      value: facts.repo.language ?? "—",
    });
    if (facts.repo.pushedAt) {
      items.push({
        label: "Last push",
        value: relativeDate(facts.repo.pushedAt),
      });
    }
  }

  return (
    <ul className="case-metrics plain-list" role="list">
      {items.map((m) => (
        <li key={m.label} className="case-metric">
          <div
            className="case-metric-val"
            style={{ color: m.value === "Offline" ? "var(--muted)" : accent }}
          >
            {m.value}
          </div>
          <div className="case-metric-label">{m.label}</div>
        </li>
      ))}
    </ul>
  );
}
