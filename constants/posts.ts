export type Post = {
  slug: string;
  title: string;
  /** One line, used for the list and the meta description. */
  summary: string;
  /** ISO date. */
  date: string;
  readingMinutes: number;
  tags: string[];
  /** Markdown body. Only a small subset is supported — see `renderBody`. */
  body: string;
};

/**
 * The writing.
 *
 * Each post is about a real problem that came up while building one of the
 * projects on this site, and what the fix was. The specifics — the stack, the
 * API shapes, the failure modes — are the point; a post that could have been
 * written without building the thing is not worth publishing.
 */
export const POSTS: Post[] = [
  {
    slug: "one-authoritative-state-per-room",
    title: "One authoritative state per room, not a server that broadcasts",
    summary:
      "Why the realtime typing race runs on a Cloudflare Durable Object instead of a Socket.IO server, and what that buys you when a client reconnects mid-race.",
    date: "2026-10-18",
    readingMinutes: 7,
    tags: ["Realtime", "Cloudflare Workers", "Durable Objects", "WebSockets"],
    body: `Building the 1v1 typing race, the first version was the obvious one: a Node server, a Socket.IO room per race, and the server broadcasting progress to everyone in the room.

It worked. Then it broke in a way that was annoying to fix rather than interesting.

## The problem was state, not transport

With a broadcast server, the server holds room state *and* the clients hold a copy of it. Those two copies drift the moment a connection is unreliable.

A racer loses wifi for two seconds. The client reconnects and re-requests the current state. The server sends what it has. But the server's copy was last written when it last *received* a keystroke — and the keystrokes that happened during the drop were never counted.

The racer's progress went backwards. The opponent's progress did not, because their connection was fine.

## Moving the state out of the process

The fix was to stop treating the room as a thing a process happens to own, and start treating it as a thing that owns its own state.

A Cloudflare Durable Object gives each room an identity: \`env.RACE_ROOM.idFromName(roomId)\`. Every message for a room goes to the same object, and that object is the only writer of the room's state. There is no second copy to drift.

The client-side WebSocket is PartySocket, but it is not the source of truth — it is a transport. If it drops, the client reconnects to the same room object and asks for a snapshot. The object replies with the authoritative state, including the progress that was counted while the client was offline.

## What this changes in practice

The room is now a single writer. That means:

- Progress cannot regress, because the only writer never loses a write.
- Two tabs in the same browser do not each think they are the racer, because the room object tracks participants, not sockets.
- Scaling is not a problem to solve. There is one object per room, and rooms are independent, so it scales with the number of races rather than with the traffic through one server.

The Durable Object is also where the race state machine lives — ready-up, the countdown, the finish, and the rematch that reuses the same room with a new passage. That state is not reconstructable from the clients, so it belongs where it cannot be lost.

## The part that was easier than expected

Scoring had to agree on both sides. WPM and accuracy are computed from the same shared module on the server and in the browser, so there is one formula and not two implementations that drift.

The scoring rules are small and worth writing down, because "how do you count a word" has more edge cases than it sounds:

- A word is five characters, not a whitespace-delimited token, so the standard is applied to raw character counts.
- Accuracy is \`correctChars / totalTyped\`, clamped to 1, and an empty input is 100% rather than a division by zero.
- Progress is \`correctChars / passageLength\`, clamped, so a racer who types past the end does not exceed 100% and win by a few characters.

Those three functions live in one shared file that both the worker and the client import. The client can predict a score locally for the racer whose hands are on the keyboard, and the server recomputes the same value authoritatively. When they disagree, the server is right — but they should never disagree, because it is the same code.

## What I would keep

If I rebuilt this, the one thing I would not give up is the single-writer property. Realtime bugs are usually state bugs wearing a transport costume. Choosing a runtime where the state has an obvious owner removed a whole category of bug before I wrote a line of race logic.`,
  },
  {
    slug: "a-browser-agent-needs-observer-nodes",
    title: "A browser agent needs observer nodes, not just action nodes",
    summary:
      "What broke when a visual automation builder only had click-and-type steps, and why the fix was adding nodes that look without changing anything.",
    date: "2026-10-11",
    readingMinutes: 6,
    tags: ["Agentic AI", "Browser Automation", "Product Design"],
    body: `Browseflow is a visual builder for browser automation. You compose steps on a canvas — open a URL, act, extract, observe, call an API — and it runs them in a real browser.

The first version had the obvious node set: open, click, type, extract. Then a customer asked for something reasonable and it exposed the gap.

## "Extract the price, but only if it is under 200"

That is a conditional, and the builder had no way to express one. The only options were to hardcode the threshold somewhere in the workflow, or to split into two workflows with logic outside the tool.

Both are bad in the same way: the logic stops living in the workflow. The person who built the flow no longer owns the decision, and the person who owns the decision cannot see the flow.

## Adding a node that does nothing on purpose

The fix was a condition node and an observer node.

An **observe** node does not change the page. It runs an agent that looks at the current screen and returns structured observations — prices, labels, whether an error banner is present. It is a read, and it produces data that later nodes can branch on.

A **condition** node takes that observation and decides. Price under 200 continues, price over 200 stops.

The important part is that the observer is a first-class node rather than a property of the extract node. Once observation is a thing the flow can contain, conditional logic becomes a small addition instead of a redesign — and the branching shows up visually in the canvas, which is where a builder should show it.

## Why the agent part is harder than it looks

An observe node that clicks the wrong thing is a bug that costs money. The agent has to be allowed to look without being allowed to act, which is a capability split, not a prompt tweak.

In Browseflow that split is enforced by the browser session itself: the observer runs against a read-only view of the page, and acting requires a separate session with different permissions. The observer cannot click, because it has nothing to click with.

That makes the node safe to run speculatively. The flow can observe first and act second, and the expensive, side-effecting step only happens on the branch that needs it.

## The result

The node set went from four to nine. The interesting change is not the count, it is that the tool can now express the decision a user actually wants to make, in the place where the user is already looking.

An agent that only acts is a script with extra steps. An agent that can also look is what makes a workflow able to branch, and branching is most of what "automation" turns out to mean.`,
  },
  {
    slug: "structured-data-beats-prose-for-agents",
    title: "Structured data beats prose when the reader is a model",
    summary:
      "An experiment in making a portfolio page legible to an AI scraper: real text in the DOM, facts instead of claims, and one source of truth for every URL.",
    date: "2026-10-04",
    readingMinutes: 5,
    tags: ["SEO", "Structured Data", "Web Performance"],
    body: `A portfolio site has an unusual property: the reader is increasingly not a person. It is a model, a crawler, or a tool fetching the page to answer a question about you.

That changes what "good content" means. Prose written for a human reader can be full of things that are true but invisible.

## The heading that was 24 KB of noise

This site's title is a slot-machine reel. Each letter spins through a pool of random glyphs and settles on the right one.

The markup put every glyph in the DOM as a text node. An \`aria-label\` carried the real name for screen readers, which is the accessible name and works fine.

But a crawler reading text content got the glyph pool — 24 KB of noise for the most important heading on the page. The name was in the accessibility tree but not in the text.

The fix was to render the reel from a data attribute through CSS \`content\`, and put the real name in the DOM as real text. The animation is untouched; the glyphs just stopped being text.

The same pattern applied to the statistics. They animated up from zero, which meant the served HTML said \`0 original repos 0 upstream PRs\`. The number a crawler saw was zero, not the real count, and the real count was somewhere else entirely — in a JSON payload the crawler would have to guess was relevant.

## Claims drift, checks do not

The project cards had four metric chips each. "Status: Live" was a claim about a deployment that might have been down that morning, with nothing on the page that would notice.

They are now checked. The server fetches the live URL and reports the status it actually got; the language and last-commit date come from the GitHub API. If a deployment is down, the card says so.

This is a small change with a disproportionate effect on how the page reads. "Live" from a chip is a claim. "Live" because a \`HEAD\` request returned 200 thirty seconds ago is a fact, and it is a fact that can be wrong, visibly, instead of quietly.

## One source of truth for URLs

The site had the canonical origin hardcoded in four places: metadata, \`robots.txt\`, \`sitemap.xml\`, and the terminal prompt in the corner. They had already drifted — the metadata said "Ansh Singh - Full-Stack" with a hyphen where the source had an em dash.

They now all derive from one constant. Changing domain is a one-line change rather than a scavenger hunt, and the terminal prompt shows the host that actually serves the page rather than one that does not.

## The part that took the longest to accept

Adding a \`llms.txt\` felt like cargo-culting a convention, and for a while it did. What changed my mind was looking at what it actually is: a plain-text answer to "who is this and what have they built", written for something that will not render a page.

It is not a replacement for the site. It is the same content in the shape that a reader who cannot see a page needs. The projects list, the stack, the contact details — all of it already existed in the constants the UI renders from, so it cannot go stale.

## What I would tell my past self

The whole exercise came down to one question: **is this true right now, and can a reader check it?** If yes, it works for people and for machines. If it is only true in the sense that it was true when I typed it, it works for neither.

The slot-machine title was a great effect and a bad heading. The reel is still a reel. It just no longer lies to a crawler.`,
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
