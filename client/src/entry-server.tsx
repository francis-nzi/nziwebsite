/**
 * Server-side rendering entry. The Node server calls render() for each page
 * request so visitors, search engines and AI crawlers all receive complete HTML.
 */
import { renderToString } from "react-dom/server";
import { QueryClient, QueryClientProvider, hydrate, type DehydratedState } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import { Router } from "wouter";
import App from "./App";
import { trpc } from "@/lib/trpc";
import { ssrState } from "@/lib/ssr";

export function render(path: string, search: string, state: DehydratedState) {
  ssrState.reset();
  const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: Infinity, retry: false } } });
  hydrate(queryClient, state);
  // Never used for fetching during a server render; queries are filled in advance.
  const trpcClient = trpc.createClient({ links: [httpBatchLink({ url: "http://127.0.0.1/api/trpc", transformer: superjson })] });
  const html = renderToString(
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Router ssrPath={path} ssrSearch={search}>
          <App />
        </Router>
      </QueryClientProvider>
    </trpc.Provider>
  );
  return { html, head: ssrState.head.join("\n    "), status: ssrState.status };
}
