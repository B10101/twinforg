import React, { useState, useContext } from 'react'
import { Title } from '../components'
import { Link } from 'react-router-dom'
import { PortfolioContext } from '../context/PortfolioContext'
import transition from '../transition';

const Portfolio = () => {
  const { projects, categories, getProjectsByCategory, loading } = useContext(PortfolioContext)
  const [activeFilter, setActiveFilter] = useState('all')

  const filteredProjects = getProjectsByCategory(activeFilter)

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='text-xl text-gray-600'>Loading projects...</div>
      </div>
    )
  }

  return (
    <div className='px-4 sm:px-8 lg:px-16 py-8'>
      {/* Header Section */}
      <div className='text-center mb-12'>
        <div className='text-4xl mb-4'>
          <Title text1={'Our'} text2={'Portfolio'} />
        </div>
        <p className='text-gray-600 max-w-2xl mx-auto'>
          Explore our diverse range of projects spanning embedded systems, hardware development, 
          web technologies, and automation solutions.
        </p>
      </div>

      {/* Filter Buttons */}
      <div className='flex flex-wrap justify-center gap-3 mb-12'>
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveFilter(category.id)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeFilter === category.id
                ? 'bg-[#2B457D] text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16'>
        {filteredProjects.map(project => (
          <div 
            key={project.id}
            className='bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-200'
          >
            {/* Project Image */}
            <div className='h-48 bg-gray-200 overflow-hidden'>
              <img 
                src={project.image} 
                alt={project.title}
                className='w-full h-full object-cover hover:scale-110 transition-transform duration-300'
              />
            </div>

            {/* Project Details */}
            <div className='p-6'>
              <h3 className='text-xl font-semibold text-gray-800 mb-2'>
                {project.title}
              </h3>
              <p className='text-gray-600 text-sm mb-4'>
                {project.description}
              </p>

              {/* Technologies */}
              <div className='flex flex-wrap gap-2 mb-4'>
                {project.technologies.map((tech, index) => (
                  <span 
                    key={index}
                    className='px-3 py-1 bg-[#F1F5FD] text-[#2B457D] text-xs rounded-full'
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* View Project Button */}
              <Link to={`/portfolio/${project.id}`}>
                <button className='w-full bg-[#2B457D] text-white py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium'>
                  View Project Details
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className='bg-[#F1F5FD] rounded-xl p-8 md:p-12 text-center'>
        <h2 className='text-3xl font-bold text-gray-800 mb-4'>
          Have a Project in Mind?
        </h2>
        <p className='text-gray-600 mb-6 max-w-2xl mx-auto'>
          Let's collaborate to bring your ideas to life. Whether it's hardware, software, 
          or a complete system, we're ready to help.
        </p>
        <Link to='/contact'>
          <button className='bg-[#2B457D] text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium'>
            Get in Touch
          </button>
        </Link>
      </div>
    </div>
  )
}

export default transition(Portfolio)