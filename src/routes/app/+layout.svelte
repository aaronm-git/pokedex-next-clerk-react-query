<script lang="ts">
// Everything under /app is the signed-in Pokédex. Phase 4 adds the session
// check here (a +layout.server.ts that redirects to /login without one);
// until then the four app screens share nothing but the URL prefix, and
// this file stays thin on purpose.
let { children } = $props();
</script>

{@render children()}
