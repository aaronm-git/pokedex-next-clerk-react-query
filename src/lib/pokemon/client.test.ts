import { afterEach, describe, expect, it, vi } from "vitest";
import { execute } from "./client";

const ENDPOINT = "https://graphql.pokeapi.co/v1beta2";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("execute", () => {
  it("posts the query and variables to the PokeAPI endpoint", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: { pokemon: [] } }),
    });
    vi.stubGlobal("fetch", fetchMock);

    // biome-ignore lint/suspicious/noExplicitAny: the generated document type is not needed here
    await execute("query Q { pokemon { id } }" as any, { id: 25 } as any);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(ENDPOINT);
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual({
      query: "query Q { pokemon { id } }",
      variables: { id: 25 },
    });
  });

  it("throws when the response is not ok", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

    // @ts-expect-error TVariables cannot be inferred from an `any` document, so the zero-variable form is rejected
    // biome-ignore lint/suspicious/noExplicitAny: same
    await expect(execute("query Q { pokemon { id } }" as any)).rejects.toThrow(
      "Network response was not ok",
    );
  });
});
