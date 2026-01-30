import React from 'react'
import { HeroAbt, Title } from '../components'
import { front } from '../assets/assets'
import { Link } from 'react-router-dom'
import transition from '../transition.jsx'
import { useLayerPinning, layerPinningPresets } from '../hooks/useLayerPinning'

const About = () => {
  const sections = [
    {
      trigger: 'hero',
      ...layerPinningPresets.fadeAndBlur,
      scrollTrigger: {
        start: 'top top',
        end: '+=100%',
        pin: true,
        pinSpacing: false,
        scrub: 1,
      },
    },
    {
      trigger: 'content',
      fromAnimation: { y: 80, opacity: 0 },
      animation: { y: 0, opacity: 1 },
      scrollTrigger: {
        start: 'top 75%',
        end: 'top 20%',
        scrub: 1,
        pin: false,
      },
    },
    {
      trigger: 'storesTitle',
      fromAnimation: { y: 60, opacity: 0 },
      animation: { y: 0, opacity: 1 },
      scrollTrigger: {
        start: 'top 80%',
        end: 'top 50%',
        scrub: 1,
        pin: false,
      },
    },
    {
      trigger: 'stores',
      animation: { y: -30, opacity: 1 },
      scrollTrigger: {
        start: 'top top',
        end: '+=120%',
        pin: true,
        scrub: 1,
      },
    },
    {
      trigger: 'whyChooseTitle',
      fromAnimation: { y: 60, opacity: 0 },
      animation: { y: 0, opacity: 1 },
      scrollTrigger: {
        start: 'top 80%',
        end: 'top 50%',
        scrub: 1,
        pin: false,
      },
    },
    {
      trigger: 'features',
      fromAnimation: { y: 80, opacity: 0 },
      animation: { y: 0, opacity: 1 },
      scrollTrigger: {
        start: 'top 75%',
        end: 'top 40%',
        scrub: 1,
        pin: false,
      },
    },
  ]

  const { containerRef, sectionRefs } = useLayerPinning(sections)

  return (
    <div ref={containerRef}>
      {/* Hero Section - Pins and fades */}
      <div 
        ref={(el) => (sectionRefs.current['hero'] = el)}
        className='flex justify-center'
      >
        <div>
          <HeroAbt />
        </div>
      </div>

      {/* Content Section */}
      <div 
        ref={(el) => (sectionRefs.current['content'] = el)}
        className='my-8 flex flex-col items-center gap-4'
      >
        <div className='flex flex-col justify-center gap-6 text-gray-600 max-w-3xl px-4'>
          <p>Layered kenya is a subsidiary of Twinforge Technologies that is focused on designing and building innovative consumer technology .</p>

          <p>Our expertise spans hardware development, embedded systems, automation, rapid prototyping, and modern web technologies. <br />
            Beyond engineering products, we also help individuals and businesses establish a strong digital presence through custom website development and technical consulting. This blend of physical engineering and software allows us to deliver end-to-end solutions—from concept and design to deployment and support.
            We believe engineering should be purposeful, efficient, and forward-thinking. Every project we take on is driven by functionality, reliability, and long-term value, not hype.
            <br /> <br />At Layered, we don't just design systems. We build tools that work.
          </p>

          <b className='text-gray-800'>Our Mission</b>
          <p>To deliver cutting-edge technologies that improve efficiency and functionality while advancing engineering innovation.</p>
        </div>
      </div>

      {/* Stores Title */}
      <div 
        ref={(el) => (sectionRefs.current['storesTitle'] = el)}
        className='text-4xl py-4 text-center'
      >
        <Title text1={'Our'} text2={'Stores'} />
      </div>

      {/* Stores Section - Pins while showing content */}
      <div 
        ref={(el) => (sectionRefs.current['stores'] = el)}
        className='my-10 flex flex-col items-center gap-8'
      >
        <div className='flex flex-col justify-center gap-6 text-gray-600 max-w-3xl px-4'>
          <p>Our company also runs two specialized stores:</p>

          <div className='flex flex-col gap-6'>
            {/* Lume Store */}
            <div className='border border-gray-300 rounded-xl p-6 bg-[#F1F5FD] drop-shadow-lg'>
              <h3 className='text-xl font-semibold text-gray-800 mb-3'>Lume</h3>
              <p className='mb-4'>Providing advanced lighting solutions for homes, offices, and commercial spaces. Lume combines design, functionality, and energy efficiency to deliver lighting that enhances any environment.</p>
              <Link to='/collection'>
                <button className='bg-[#2B457D] text-white px-8 py-3 text-sm sm:text-base hover:bg-gray-700 transition-colors rounded-md drop-shadow-lg'>
                  Visit the lume store
                </button>
              </Link>
            </div>

            {/* Tinkertronics Store */}
            <div className='border border-gray-300 rounded-xl p-6 bg-[#F1F5FD] drop-shadow-lg items-center'>
              <h3 className='text-xl font-semibold text-gray-800 mb-3'>Tinkertronics</h3>
              <p className='mb-4 items-center'>Producing a variety of 3D-printed products beyond lighting, ranging from functional tools and gadgets to custom prototypes. Tinkertronics allows our clients to bring creative concepts to life with precision and quality.</p>
              <Link to='/tinkertronics'>
                <button className='bg-[#2B457D] text-white px-8 py-3 text-sm sm:text-base hover:bg-gray-700 transition-colors rounded-md drop-shadow-lg'>
                  Visit the tinkertronics store
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Title */}
      <div 
        ref={(el) => (sectionRefs.current['whyChooseTitle'] = el)}
        className='text-4xl py-4 text-center'
      >
        <Title text1={'Why'} text2={'Choose Us'} />
      </div>

      {/* Features Section */}
      <div 
        ref={(el) => (sectionRefs.current['features'] = el)}
        className='flex flex-col md:flex-row text-sm mb-20 gap-4'
      >
        <div className='rounded-xl px-10 md:px-16 py-6 sm:py-20 flex flex-col gap-4 bg-[#F1F5FD] drop-shadow-lg'>
          <b>Quality Assurance</b>
          <p>We are dedicated to delivering superior solutions that exceed expectations and set industry benchmarks.</p>
        </div>

        <div className='rounded-xl px-10 md:px-16 py-6 sm:py-20 flex flex-col gap-4 bg-[#F1F5FD] drop-shadow-lg'>
          <b>Integrity</b>
          <p>We maintain transparency, accountability, and ethical practices in all our operations.</p>
        </div>

        <div className='rounded-xl px-10 md:px-16 py-6 sm:py-20 flex flex-col gap-4 bg-[#F1F5FD] drop-shadow-lg'>
          <b>Exceptional Customer Service</b>
          <p>Creativity and cutting-edge technologies drive everything we design and build.</p>
        </div>
      </div>
    </div>
  )
}

export default transition(About)