"use client";

import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import queryClient from "@/lib/reactquery";

const persister = createAsyncStoragePersister({
  storage: typeof window !== "undefined" ? window.localStorage : undefined,
  key: "POKEDEX_CACHE",
});

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
      onSuccess={() => {
        queryClient.resumePausedMutations();
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
