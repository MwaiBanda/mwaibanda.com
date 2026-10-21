import { Component, type ReactNode } from 'react'
import { RotateCw } from 'lucide-react'

export default class RouteBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (!this.state.failed) return this.props.children

    return <main className="mx-auto max-w-[680px] px-6 py-12" role="alert">
      <h1 className="mb-4 text-2xl">Couldn't open this page.</h1>
      <button className="mr-6 inline-flex min-h-11 items-center gap-2 underline" onClick={() => window.location.reload()}>
        <RotateCw size={16} aria-hidden="true" /> Reload
      </button>
      <a href="/" className="inline-flex min-h-11 items-center underline">Back to home</a>
    </main>
  }
}