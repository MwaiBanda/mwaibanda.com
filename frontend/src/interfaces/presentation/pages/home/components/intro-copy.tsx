export default function IntroCopy({ className = '', ariaHidden = false }: { className?: string, ariaHidden?: boolean }) {
  return <div className={`space-y-6 ${className}`} aria-hidden={ariaHidden}>
    <p>I design, develop & deploy end-to-end solutions for Android, iOS, iPadOS, Roku & Web(Frontend & Backend).</p>
    <p>I'm enamored with design, its ability to shape reality, the journey from idea to concept, and then to product. All while being authentic & original, empathizing with the end-user to provide an experience that's uniquely tailored to meet that one user's need while fulfilling the business requirement.</p>
    <p>I'm currently working as a Mobile Developer at <a className="underline font-bold" href="https://cbn.com/">CBN</a>, a faith-based organization building world-class digital media app(Android, iOS, Roku & Web) experiences ranging from video streaming to guided learning experiences.</p>
  </div>
}