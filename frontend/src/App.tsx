
import './App.css'
import Typewriter from "typewriter-effect"
function App() {

  return (
    <div className="flex min-h-screen min-w-screen flex-col items-center  p-6 text-white lg:justify-center lg:p-8 bg-black">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                       
                    </nav>
                </header>
                <div className="flex w-full items-start justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <div className='max-w-[600px] lg:min-w-[600px] md:min-w-screen'>
                    <h1>Mwai Banda</h1>
                    <h2 className="mb-12 text-gray-500">Software Engineer</h2>
                    <Typewriter onInit={(t) => {
                        t.pauseFor(110)
                        .changeDelay(110)
                        .typeString("I design, develop & deploy end-to-end solutions for Android, iOS, iPadOS, Roku & Web(Frontend & Backend). ")
                        .deleteChars(1)
                        .typeString("<br><br>I'm enamored with design, its ability to shape reality, the journey from idea to concept, and then to product. All while being authentic & original, empathizing with the end-user to provide an experience that's uniquely tailored to meet that one user's need while fulfilling the business requirement.")
                        .pauseFor(110)
                        .typeString(`<br><br>I'm currently working as a Mobile Developer at <a class="underline" href="https://cbn.com/">CBN</a>, a faith-based organisation building world-class digital media app(Android, iOS & Roku) experiences ranging from video streaming to guided learning experiences.`)
                        .start();
                    }} />
                    </div>
                </div>
                <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50">
                    <div className="bg-black/80 border-neutral-800 shadow-2xl shadow-black/50 backdrop-blur-md border rounded-full px-4 py-3 transition-all duration-300">
                        <div className="flex items-center space-x-2">
                            <a href="https://github.com/MwaiBanda" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full text-neutral-400 hover:text-blue-500 hover:bg-neutral-800 transition-all duration-200" title="GitHub">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-github">
                                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                                    <path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                            </a>
                            <a href="https://www.linkedin.com/in/mwai-banda/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full text-neutral-400 hover:text-blue-500 hover:bg-neutral-800 transition-all duration-200" title="LinkedIn"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-linkedin">
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                            </a>
                            <a href="mailto:bandamwai@gmail.com" className="p-2 rounded-full text-neutral-400 hover:text-blue-500 hover:bg-neutral-800 transition-all duration-200" title="Email">
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                            </a>
                            <a href="/Mwai_Banda_Resume.pdf" download="Resume" className="p-2 rounded-full text-neutral-400 hover:text-blue-500 hover:bg-neutral-800 transition-all duration-200" title="Resume">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>
                            </a>
                            <div className="w-px h-5 mx-2 bg-neutral-700"></div>
                            <button className="p-2 rounded-full text-neutral-400 hover:text-blue-500 transition-all duration-200" title="Switch to light mode">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-sun"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
  )
}

export default App
