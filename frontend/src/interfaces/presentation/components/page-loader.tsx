import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import type { AnimationItem } from 'lottie-web'
import animationData from '../../../assets/pixel-loader.json'
import './page-loader.css'

function subscribeToMotion(onChange: () => void) {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
  preference.addEventListener('change', onChange)
  return () => preference.removeEventListener('change', onChange)
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function StaticPixels() {
  return <div className="page-loader-static"><span /><span /><span /><span /></div>
}

function AnimatedPixels() {
  const container = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    let animation: AnimationItem | undefined

    void import('lottie-web/build/player/lottie_light').then(({ default: lottie }) => {
      if (!active || !container.current) return
      animation = lottie.loadAnimation({
        container: container.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData,
      })
      animation.addEventListener('DOMLoaded', () => {
        if (active) setReady(true)
      })
    }).catch(() => undefined)

    return () => {
      active = false
      animation?.destroy()
    }
  }, [])

  return <>
    <div className="page-loader-animation" ref={container} />
    {!ready && <StaticPixels />}
  </>
}

export default function PageLoader({ label = 'Loading article...' }: { label?: string }) {
  const reducedMotion = useSyncExternalStore(subscribeToMotion, prefersReducedMotion, () => true)

  return <div className="page-loader" role="status" aria-live="polite" aria-busy="true">
    <div className="page-loader-stage" aria-hidden="true">
      {reducedMotion ? <StaticPixels /> : <AnimatedPixels />}
    </div>
    <span className="sr-only">{label}</span>
  </div>
}