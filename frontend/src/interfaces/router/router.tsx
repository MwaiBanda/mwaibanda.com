import { BrowserRouter, Route, Routes } from "react-router";
import { ThemeProvider } from "@/interfaces/presentation/components/theme-provider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/infrastructure/query/react-query";
import Home from "../presentation/pages/home/home";
import Blog from "../presentation/pages/blog/blog";

export default function Router() {
    return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route path='/portfolio' element={<Home />}/>
            <Route path="/" element={<Home />} />
            <Route path="/blog/:article" element={<Blog />} />
          </Routes>
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
    )
}
