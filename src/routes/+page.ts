// The landing page is fully static, so prerender it to a plain HTML file. On
// Netlify's Free plan every non-prerendered request wakes the serverless
// function and draws from a 300-credit monthly cap.
//
// This is opt-in per route rather than a default in +layout.ts, because most of
// what comes next is per-user: auth, favorites and the demo session all have to
// render at request time.
export const prerender = true;
