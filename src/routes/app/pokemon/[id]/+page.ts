import { findPokemon } from "$lib/fixtures/pokemon";
import type { PageLoad } from "./$types";

// Phase 3 replaces the fixture lookup with a fetch and keeps this shape.
export const load: PageLoad = ({ params }) => {
  const id = Number(params.id);
  return { pokemon: findPokemon(id) ?? null, id, inverted: true };
};
