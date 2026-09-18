import type { PageLoad } from "./$types";

// The same guide on the Crystal-style inverted LCD. Inversion belongs to the
// shell, so the page asks for it in its data the way the detail screen does.
export const prerender = true;

export const load: PageLoad = () => ({ inverted: true });
