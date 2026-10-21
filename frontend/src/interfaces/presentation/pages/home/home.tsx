import { useState, useSyncExternalStore } from 'react'
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

function subscribeToMotionPreference(onChange: () => void) {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
  preference.addEventListener('change', onChange)
  return () => preference.removeEventListener('change', onChange)
}

function getReducedMotionPreference() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function Home() {
  const [showContent, setShowContent] = useState(false)
  const [skipIntro, setSkipIntro] = useState(false)
  const reducedMotion = useSyncExternalStore(subscribeToMotionPreference, getReducedMotionPreference, () => false)
  const introComplete = showContent || skipIntro || reducedMotion
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
    <div className="home-page flex min-h-screen w-full flex-col items-center bg-background p-6 text-[#25282a] dark:text-white lg:justify-center lg:p-8">
      <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
        <nav className="flex items-center justify-end gap-4">

        </nav>
      </header>
      <div className="flex w-full items-start justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
        <div className='w-full min-w-0 max-w-[600px] pb-[100px]'>
          <h1 className="home-name">Mwai Banda</h1>
          <h2 className="home-role mb-12 text-neutral-600 dark:text-neutral-400">Software Engineer</h2>
          <div className="home-intro relative">
            <IntroCopy className={introComplete ? '' : 'sr-only'} />
            {!introComplete && <div aria-hidden="true" inert>
            <IntroCopy className="invisible" ariaHidden />
            <div className="absolute inset-0">
              <Typewriter onInit={(t) => {
                t.pauseFor(65)
                  .changeDelay(65)
                  .typeString("I design, develop & deploy end-to-end solutions for Android, iOS, iPadOS, Roku & Web(Frontend & Backend). ")
                  .deleteChars(1)
                  .typeString("<br><br>I'm enamored with design, its ability to shape reality, the journey from idea to concept, and then to product. All while being authentic & original, empathizing with the end-user to provide an experience that's uniquely tailored to meet that one user's need while fulfilling the business requirement.")
                  .pauseFor(65)
                  .typeString(`<br><br>I'm currently working as a Mobile Developer at <a class="underline font-medium" href="https://cbn.com/">CBN</a>, a faith-based organization building world-class digital media app(Android, iOS, Roku & Web) experiences ranging from video streaming to guided learning experiences.`)
                  .pauseFor(900)
                  .callFunction(() => {
                    setShowContent(true)
                  })
                  .start();
              }} />
            </div>
            </div>}
          </div>
          {!introComplete && <div className="mt-8 flex justify-center">
            <Button
              className="skip-intro-button action-bar-glass min-h-11 rounded-full px-4 py-2 text-[#25282a] hover:brightness-105 dark:text-white"
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
          <MainContent show={introComplete} work={work} articles={articles} />
          {introComplete && <span className='text-xs text-neutral-500'>© 2026 Copyright - Mwai Banda</span>}
        </div>
      </div>
      <ActionBar />
    </div>
  )
}