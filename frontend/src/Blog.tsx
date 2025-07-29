import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { type Article } from "./model/article"
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import ActionBar from "./components/ui/action-buton";
import { useParams } from "react-router";
import { CacheKeys } from "./utils/constants";

export default function Blog() {
    const { article } = useParams()
    const articles = useQuery({
        queryKey: [CacheKeys.ARTICLES], queryFn: async () => {
            return (await (await fetch("/api/v1/articles")).json()) as Article[]
        },
    })
    const [currentArticle, setArticle] = useState<Article | undefined>(undefined)
    useEffect(() => {
        if (articles.data && article) {
            setArticle(articles.data?.find((a) => a.name == decodeURIComponent(article)))
        }
    }, [articles])
    return <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-start max-w-[838px] md:min-w-[838px] min-w-[90vw] md:pb-8 text-base leading-9 md:min-h-[550] pb-4">
            <img src={currentArticle?.image} alt="" className="min-h-full min-w-full" />
            <p className="text-3xl font-bold mt-8 mb-4">{currentArticle?.name}</p>
            <p className="text-2xl font-medium text-center">{currentArticle?.summary}</p>
        </div>
        <div className="max-w-[738px] md:min-w-[738px] min-w-[90vw] pb-[100px] text-base leading-9 mx-8">
            {article && <ReactMarkdown
                rehypePlugins={[rehypeRaw, remarkGfm]}
                components={{
                    table: ({ node, ...props }) => (
                        <table className="table-auto border-collapse border border-gray-300 w-full my-4" {...props} />
                    ),
                    th: ({ node, ...props }) => (
                        <th className="border border-gray-300 bg-gray-100 p-2 text-left" {...props} />
                    ),
                    td: ({ node, ...props }) => (
                        <td className="border border-gray-300 p-2" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                        <h3 className="text-xl font-bold mt-4 mb-2" {...props} />
                    ),
                    blockquote: ({ node, ...props }) => (
                        <blockquote
                            className="border-l-4 border-gray-400 pl-4 italic text-gray-700 my-4"
                            {...props}
                        />
                    )
                }}
            >{currentArticle?.body}</ReactMarkdown>}
        </div>
        <ActionBar />
    </div>
}