import { SITE, PROJECTS, STACK_PILLS } from "../../constants";

/**
 * llms.txt — a plain-text summary for AI crawlers and answer engines.
 *
 * It is a convention some crawlers already look for, and unlike a robots
 * file it says who this is and what the work is, in a form a model can read
 * without parsing the page. Kept in sync with the site by importing the
 * same constants the UI uses.
 */
export const dynamic = "force-static";

export function GET() {
  const projects = PROJECTS.map(
    (p) =>
      `- ${p.title} (${p.subtitle}) — ${p.desc}\n  Stack: ${p.stack.join(", ")}\n  Live: ${p.link}`,
  ).join("\n");

  const body = `# ${SITE.name}

> ${SITE.description}

${SITE.url}

## Profile

Full-stack and agentic AI engineer. Builds production AI products end to end:
agentic workflows, RAG systems, real-time applications, and Next.js platforms.

- Location: ${SITE.location}
- Email: ${SITE.email}
- GitHub: ${SITE.socials.github}
- LinkedIn: ${SITE.socials.linkedin}

## Selected work

${projects}

## Stack

${STACK_PILLS.join(", ")}

## Notes

- The interactive terminal and command palette on the site are the fastest way
  to browse the project list and the pull request history.
- The site is a single page; there is no separate documentation site.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
