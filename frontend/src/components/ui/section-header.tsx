
export default function SectionHeader({ title, style}: { title: string, style?: string }) {
    return <div className={`flex items-center mb-4${style ? ` ${style}` : ''}`}>
        <div className="w-8 h-px bg-blue-500 mr-4">
        </div><h2 className="text-sm uppercase tracking-widest text-neutral-500 font-normal">{title}</h2>
    </div>
}