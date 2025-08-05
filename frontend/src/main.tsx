import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './Home.tsx'
import { ThemeProvider } from './components/ui/theme-provider.tsx'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/react-query.ts'
import { BrowserRouter, Route, Routes } from "react-router";
import Blog from './Blog.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
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
  </StrictMode>,
)
