import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import kotlin from 'react-syntax-highlighter/dist/esm/languages/prism/kotlin'
import dracula from 'react-syntax-highlighter/dist/esm/styles/prism/dracula'
import copy from 'copy-to-clipboard'
import type { Article } from '../../../../domain/article/entity'
import TagList from '../../components/tag-list'

SyntaxHighlighter.registerLanguage('kotlin', kotlin)

const markdownSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), 'center'],
}

const codeStyle = {
  fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
  fontSize: '14px',
  lineHeight: '24px',
  letterSpacing: 0,
}

function CodeBlock({ className = '', children }: { className?: string; children: React.ReactNode }) {
  const [copied, setCopied] = useState(false)
  const language = /language-([\w+-]+)/.exec(className)?.[1]
  const code = String(children).replace(/\n$/, '')

  if (!language) return <code className="bg-gray-100 rounded px-1 py-[2px]">{children}</code>

  return <div className="relative my-4 text-sm">
    <div className="flex justify-between items-start bg-gray-800 rounded-t-md px-3 py-1 text-gray-200">
      <span className="blog-code-language text-xs uppercase">{language}</span>
      <button
        onClick={() => {
          if (copy(code)) {
            setCopied(true)
            setTimeout(() => setCopied(false), 1200)
          }
        }}
        aria-label={copied ? 'Copied' : 'Copy code'}
        title={copied ? 'Copied' : 'Copy code'}
        className="inline-flex size-11 items-center justify-center rounded hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
      </button>
    </div>
    <SyntaxHighlighter
      style={dracula}
      language={language === 'kotlin' ? 'kotlin' : 'text'}
      PreTag="div"
      tabIndex={0}
      role="region"
      aria-label={`${language} code sample`}
      codeTagProps={{ style: codeStyle }}
      customStyle={{ ...codeStyle, margin: 0, padding: '1rem', borderRadius: '0 0 .375rem .375rem', overflowX: 'auto' }}
    >{code}</SyntaxHighlighter>
  </div>
}

export default function ArticleContent({ article }: { article: Article }) {
  return <article>
    {article.image && <img src={article.image} alt="" className="blog-cover" />}
    <header className="blog-heading">
      <h1>{article.name}</h1>
      <p className="blog-summary">{article.summary}</p>
      <div className="mt-5"><TagList tags={article.tags} /></div>
    </header>
    <div className="blog-body">
      <ReactMarkdown
        rehypePlugins={[rehypeRaw, [rehypeSanitize, markdownSchema]]}
        remarkPlugins={[remarkGfm]}
        components={{ code: ({ className, children }) => <CodeBlock className={className}>{children}</CodeBlock> }}
      >{article.body}</ReactMarkdown>
    </div>
  </article>
}