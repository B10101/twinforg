import React from 'react'
import { Hero, LatestCollection, OurPolicy } from '../components'
import transition from '../transition';

const Home = () => {
  return (
    <div>
      <Hero/>
      <LatestCollection/>            
    </div>
  )
}

export default transition(Home)