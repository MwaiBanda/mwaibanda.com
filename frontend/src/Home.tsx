import { useEffect, useState } from 'react'
import './Home.css'
import Typewriter from "typewriter-effect"
import SectionHeader from './components/ui/section-header'
import { useQuery } from '@tanstack/react-query'
import { ChevronsDown } from 'lucide-react'
import type { Work } from './model/work'
import type { Article } from './model/article'
import ActionBar from './components/ui/action-buton'
import { Button } from './components/ui/button'
import { CacheKeys } from './utils/constants'

function Home() {
  const [showContent, setShowContent] = useState(false)
  const [skipIntro, setSkipIntro] = useState(false)
  const work = useQuery({
    queryKey: [CacheKeys.WORK], queryFn: async () => {
      return (await (await fetch("/api/v1/work")).json()) as Work[]
    },
  })
  const articles = useQuery({
    queryKey: [CacheKeys.ARTICLES], queryFn: async () => {
      return (await (await fetch("/api/v1/articles")).json()) as Article[]
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

function IntroCopy({ className = '', ariaHidden = false }: { className?: string, ariaHidden?: boolean }) {
  return <div className={`space-y-6 ${className}`} aria-hidden={ariaHidden}>
    <p>I design, develop & deploy end-to-end solutions for Android, iOS, iPadOS, Roku & Web(Frontend & Backend).</p>
    <p>I'm enamored with design, its ability to shape reality, the journey from idea to concept, and then to product. All while being authentic & original, empathizing with the end-user to provide an experience that's uniquely tailored to meet that one user's need while fulfilling the business requirement.</p>
    <p>I'm currently working as a Mobile Developer at <a className="underline font-bold" href="https://cbn.com/">CBN</a>, a faith-based organization building world-class digital media app(Android, iOS, Roku & Web) experiences ranging from video streaming to guided learning experiences.</p>
  </div>
}

interface MainContentProps {
  show: boolean,
  work?: Work[]
  articles?: Article[]
}

function MainContent({ show, work, articles }: MainContentProps) {
  useEffect(() => {
    console.log(work)
  }, [work])
  if (show) {
    return <>
      <SectionHeader title='featured work' style='mt-12' />
      {work?.map((item, i) => {
        return <WorkCard key={`work-${i}`} work={item} />
      })}
      <SectionHeader title='articles' style='mt-12' />
      {articles && articles?.map((article) => {
        return <>{article && <ArticleCard article={article} />}</>
      })}
    </>
  }
  return <></>
}

function ArticleCard({ article }: { article: Article }) {
  return <div className="pb-4 mb-4 border-b border-neutral-300 dark:border-neutral-800 cursor-pointer">
    <a href={`/blog/${article.name}`}>
      <div className="flex items-start gap-3 mb-2">
        <div className="flex-1">
          <span className="font-medium text-sm">{article?.name}</span>
        </div>
        <span className="text-xs text-neutral-500">{article?.publicationDate}</span>
      </div>
      <p className="pb-4 text-neutral-600  dark:text-neutral-400 text-sm leading-relaxed">{article?.summary}</p>
      {article?.tags?.map((tag, i) => {
        return <span className={`${i > 0 ? "ml-2 " : ""}text-xs px-2 py-1 rounded-full bg-neutral-300 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-500 border border-neutral-400 dark:border-neutral-800`}>
          {tag}
        </span>
      })}
    </a>
  </div>
}

function WorkCard({ work }: { work: Work }) {
  return <div className="pb-4 mb-4 border-b border-neutral-300 dark:border-neutral-800  text-[#25282a] dark:text-white">
    <a href={work.link} target='_blank'>
      <div className="flex items-center justify-between cursor-pointer">
        <div className="flex items-start gap-4 flex-1">
          <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center border shadow-md dark:bg-black border-neutral-300 dark:border-neutral-900">
            <img src={work.image} alt="logo" className="w-4/5 h-4/5 object-contain" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-3 mb-1">
              <h3 className="font-medium text-sm">{work.name}</h3>
              <span className=" text-xs text-neutral-500">{work.startDate} - {work.endDate}</span>
            </div>
            <span className="mb-4 text-neutral-600  dark:text-neutral-400 text-sm leading-relaxed">{work.summary}</span><br />
            <div className='mt-4'>
              {work?.tags?.map((tag, i) => {
                return <span className={`${i > 0 ? "ml-2 " : ""}text-xs px-2 py-1 rounded-full bg-neutral-300 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-500 border border-neutral-400 dark:border-neutral-800`}>
                  {tag}
                </span>
              })}
            </div>
          </div>
        </div>
      </div>
    </a>
  </div>
}

export default Home
