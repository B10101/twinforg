import React from 'react'
import { Hero, LatestCollection } from '../components'
import transition from '../transition.jsx'
import { useLayerPinning, layerPinningPresets } from '../hooks/useLayerPinning'

const Home = () => {
  const sections = [
    {
      trigger: 'hero',
      ...layerPinningPresets.fadeAndBlur,
    },
    {
      trigger: 'latest',
      // Slide up smoothly without pinning so it flows into footer
      fromAnimation: { y: 100, opacity: 0 },
      animation: { y: 0, opacity: 1 },
      scrollTrigger: {
        start: 'top 80%',
        end: 'top 30%',
        scrub: 1,
        pin: false, // Don't pin so it flows naturally
      },
    },
  ]

  const { containerRef, sectionRefs } = useLayerPinning(sections)

  return (
    <div ref={containerRef}>
      <div ref={(el) => (sectionRefs.current['hero'] = el)}>
        <Hero />
      </div>

      <div ref={(el) => (sectionRefs.current['latest'] = el)}>
        <LatestCollection />
      </div>
    </div>
  )
}

export default transition(Home)