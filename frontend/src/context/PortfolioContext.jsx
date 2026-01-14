import { createContext, useState, useEffect } from 'react'
import axios from 'axios'

export const PortfolioContext = createContext()

const PortfolioContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  // Categories for filtering
  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'embedded', label: 'Embedded Systems' },
    { id: 'hardware', label: 'Hardware' },
    { id: 'web', label: 'Web Development' },
    { id: 'automation', label: 'Automation' },
    { id: 'prototype', label: 'Prototyping' }
  ]

  // Fetch all projects from backend
  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${backendUrl}/api/project/list`)
      
      if (response.data.success) {
        setProjects(response.data.projects)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  // Get project by ID
  const getProjectById = async (id) => {
    try {
      const response = await axios.get(`${backendUrl}/api/project/${id}`)
      
      if (response.data.success) {
        return response.data.project
      }
    } catch (error) {
      console.error('Error fetching project:', error)
      return null
    }
  }

  // Get projects by category
  const getProjectsByCategory = (category) => {
    if (category === 'all') return projects
    return projects.filter(project => project.category === category)
  }

  // Get featured projects
  const getFeaturedProjects = async (count = 3) => {
    try {
      const response = await axios.get(`${backendUrl}/api/project/list?featured=true`)
      
      if (response.data.success) {
        return response.data.projects.slice(0, count)
      }
    } catch (error) {
      console.error('Error fetching featured projects:', error)
      return []
    }
  }

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects()
  }, [])

  const value = {
    projects,
    categories,
    loading,
    getProjectById,
    getProjectsByCategory,
    getFeaturedProjects,
    fetchProjects
  }

  return (
    <PortfolioContext.Provider value={value}>
      {props.children}
    </PortfolioContext.Provider>
  )
}

export default PortfolioContextProvider