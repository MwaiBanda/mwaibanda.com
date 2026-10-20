import type { Work } from '../../../../../domain/work/enitity'

export default function WorkCard({ work }: { work: Work }) {
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