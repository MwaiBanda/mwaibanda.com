import { useState } from 'react'
import './home.css'
import Typewriter from "typewriter-effect"
import { useQuery } from '@tanstack/react-query'
import { ChevronsDown } from 'lucide-react'
import ActionBar from '../../components/action-buton'
import { Button } from '../../components/button'
import { CacheKeys } from '../../../../application/config/constants'
import { useApplication } from '../../application-context'
import IntroCopy from './components/intro-copy'
import MainContent from './components/main-content'

export default function Home() {
  const [showContent, setShowContent] = useState(false)
  const [skipIntro, setSkipIntro] = useState(false)
  const application = useApplication()

  const work = useQuery({
    queryKey: [CacheKeys.WORK], queryFn: async () => {
      return application.work.getAllWork()
    },
  })
  const articles = useQuery({
    queryKey: [CacheKeys.ARTICLES], queryFn: async () => {
      return application.articles.getAllArticles()
    },
  })

  return (
    <div className="flex min-h-screen min-w-screen flex-col items-center bg-white p-6 text-[#25282a] dark:text-white lg:justify-center lg:p-8 dark:bg-black/80">
      <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
        <nav className="flex items-center justify-end gap-4">

        </nav>
      </header>
      <div className="flex w-full items-start justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
        <div className='max-w-[600px] md:min-w-[600px] min-w-[90vw] pb-[80px]'>
          <h1>Mwai Banda</h1>
          <h2 className="mb-12 text-neutral-600 dark:text-neutral-400 ">Software Engineer</h2>
          <div className="relative">
            <IntroCopy className="invisible" ariaHidden />
            <div className="absolute inset-0">
              {skipIntro ? <IntroCopy /> : <Typewriter onInit={(t) => {
                t.pauseFor(65)
                  .changeDelay(65)
                  .typeString("I design, develop & deploy end-to-end solutions for Android, iOS, iPadOS, Roku & Web(Frontend & Backend). ")
                  .deleteChars(1)
                  .typeString("<br><br>I'm enamored with design, its ability to shape reality, the journey from idea to concept, and then to product. All while being authentic & original, empathizing with the end-user to provide an experience that's uniquely tailored to meet that one user's need while fulfilling the business requirement.")
                  .pauseFor(65)
                  .typeString(`<br><br>I'm currently working as a Mobile Developer at <a class="underline font-bold" href="https://cbn.com/">CBN</a>, a faith-based organization building world-class digital media app(Android, iOS, Roku & Web) experiences ranging from video streaming to guided learning experiences.`)
                  .callFunction(() => {
                    setShowContent(true)
                  })
                  .start();
              }} />}
            </div>
          </div>
          {!showContent && <div className="mt-8 flex justify-center">
            <Button
              className="skip-intro-button rounded-full border border-neutral-300 bg-white/95 px-4 py-2 text-[#25282a] shadow-lg shadow-black/10 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-black/90 dark:text-white dark:hover:bg-neutral-900"
              onClick={() => {
                setSkipIntro(true)
                setShowContent(true)
              }}
              variant="outline"
            >
              Skip
              <ChevronsDown className="size-4" aria-hidden="true" />
            </Button>
          </div>}
          <MainContent show={showContent} work={work.data ?? []} articles={articles.data ?? []} />
          {showContent && <span className='text-xs text-neutral-500'>© 2025 Copyright - Mwai Banda</span>}
        </div>
      </div>
      <ActionBar />
    </div>
  )
}