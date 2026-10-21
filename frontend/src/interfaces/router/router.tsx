import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { ThemeProvider } from "@/interfaces/presentation/components/theme-provider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/infrastructure/query/react-query";
import Home from "../presentation/pages/home/home";
import RouteBoundary from "./route-boundary";
import PageMetadata from "../presentation/pages/blog/article-metadata";
import PageLoader from "../presentation/components/page-loader";

const Blog = lazy(() => import("../presentation/pages/blog/blog"));

export default function Router() {
    return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <QueryClientProvider client={queryClient}>
          <RouteBoundary>
          <Suspense fallback={<main><PageLoader /></main>}>
          <Routes>
            <Route path='/portfolio' element={<><PageMetadata /><Home /></>}/>
            <Route path="/" element={<><PageMetadata /><Home /></>} />
            <Route path="/blog/:article" element={<Blog />} />
            <Route path="*" element={<><title>Page not found | Mwai Banda</title><meta name="robots" content="noindex" /><main className="mx-auto max-w-[680px] px-6 py-12"><h1 className="mb-4 text-2xl">Page not found</h1><a href="/" className="underline">Back to home</a></main></>} />
          </Routes>
          </Suspense>
          </RouteBoundary>
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
    )
}
