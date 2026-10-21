import type { Work } from '../../../../../domain/work/enitity'
import TagList from '../../../components/tag-list'

export default function WorkCard({ work }: { work: Work }) {
  const dates = [work.startDate, work.endDate].filter((date) => date?.trim()).join(' - ')
  return <div className="home-content-row pb-4 mb-4 border-b border-neutral-300 dark:border-neutral-800 text-[#25282a] dark:text-white">
    <a href={work.link} target='_blank' rel="noopener noreferrer">
      <div className="flex items-center justify-between cursor-pointer">
        <div className="flex items-start gap-4 flex-1">
          <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center border shadow-md dark:bg-black border-neutral-300 dark:border-neutral-900">
            <img src={work.image} alt="" className="w-4/5 h-4/5 object-contain" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 mb-1">
              <h3 className="home-content-title font-medium text-sm">{work.name}</h3>
              {dates && <span className="home-date">{dates}</span>}
            </div>
            <p className="mt-2 text-[15px] leading-6 font-normal text-neutral-600 dark:text-neutral-400 break-words">{work.summary}</p>
            <div className='mt-4'>
              <TagList tags={work.tags} />
            </div>
          </div>
        </div>
      </div>
    </a>
  </div>
}