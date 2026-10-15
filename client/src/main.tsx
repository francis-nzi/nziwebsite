import { QueryClient, QueryClientProvider, hydrate } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createRoot, hydrateRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import { trpc } from "@/lib/trpc";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 5 * 60_000, refetchOnWindowFocus: false, retry: 1 } },
});

// Data the server already loaded for this page, so the first render matches its HTML.
const stateEl = document.getElementById("__RQ_STATE__");
if (stateEl?.textContent) hydrate(queryClient, superjson.parse(stateEl.textContent));

const trpcClient = trpc.createClient({
  links: [httpBatchLink({ url: "/api/trpc", transformer: superjson })],
});

const tree = (
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </trpc.Provider>
);

const root = document.getElementById("root")!;
if (root.hasChildNodes()) hydrateRoot(root, tree);
else createRoot(root).render(tree);
