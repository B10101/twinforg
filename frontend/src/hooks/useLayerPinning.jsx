import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

/**
 * Custom hook for GSAP layer pinning animations
 * @param {Array} sections - Array of animation configurations
 * @returns {Object} - Object containing refs for container and sections
 * 
 * Example usage:
 * const { containerRef, sectionRefs } = useLayerPinning([
 *   {
 *     trigger: 'hero',
 *     animation: { opacity: 0, scale: 0.95 },
 *     scrollTrigger: { start: 'top top', end: '+=100%', pin: true }
 *   }
 * ])
 */
export const useLayerPinning = (sections = []) => {
  const containerRef = useRef(null)
  const sectionRefs = useRef({})

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      sections.forEach((section) => {
        const element = sectionRefs.current[section.trigger]
        if (!element) return

        const scrollTriggerConfig = {
          trigger: element,
          scrub: 1,
          markers: false,
          toggleActions: 'play reverse play reverse',
          ...section.scrollTrigger,
        }

        if (section.fromAnimation) {
          // Use fromTo animation
          gsap.fromTo(
            element,
            section.fromAnimation,
            {
              ...section.animation,
              scrollTrigger: scrollTriggerConfig,
            }
          )
        } else {
          // Use to animation
          gsap.to(element, {
            ...section.animation,
            scrollTrigger: scrollTriggerConfig,
          })
        }
      })
    }, containerRef)

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [sections])

  return { containerRef, sectionRefs }
}

/**
 * Preset configurations for common layer pinning effects
 */
export const layerPinningPresets = {
  fadeAndBlur: {
    animation: { opacity: 0, scale: 0.95, filter: 'blur(10px)' },
    scrollTrigger: { start: 'top top', end: '+=100%', pin: true, pinSpacing: false },
  },
  
  slideUp: {
    fromAnimation: { y: 100, opacity: 0 },
    animation: { y: 0, opacity: 1 },
    scrollTrigger: { start: 'top 80%', end: 'top top', pin: false },
  },
  
  slideUpWithScale: {
    fromAnimation: { y: 100, opacity: 0, scale: 0.9 },
    animation: { y: 0, opacity: 1, scale: 1 },
    scrollTrigger: { start: 'top 90%', end: 'top 60%' },
  },
  
  pinAndReveal: {
    animation: { y: -50, opacity: 1 },
    scrollTrigger: { start: 'top top', end: '+=150%', pin: true },
  },
  
  zoomOut: {
    animation: { scale: 0.8, opacity: 0.3, filter: 'blur(5px)', borderRadius: '20px' },
    scrollTrigger: { start: 'top top', end: 'bottom top', pin: true, pinSpacing: false },
  },
  
  cardStack: {
    fromAnimation: { y: 100, scale: 0.95, opacity: 0 },
    animation: { y: 0, scale: 1, opacity: 1 },
    scrollTrigger: { start: 'top bottom', end: 'top top' },
  },
}