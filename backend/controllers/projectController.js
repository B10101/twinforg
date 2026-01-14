import projectModel from "../models/projectModel.js";
import { v2 as cloudinary } from "cloudinary";

// Add a new project
const addProject = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      fullDescription,
      technologies,
      challenges,
      results,
      client,
      duration,
      featured,
      completionDate
    } = req.body;

    // Handle main images
    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];
    
    const mainImages = [image1, image2, image3, image4].filter((item) => item !== undefined);

    // Handle gallery images
    const galleryImages = req.files.gallery || [];

    // Upload main images to cloudinary
    let mainImageUrls = await Promise.all(
      mainImages.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
          folder: "portfolio/projects"
        });
        return result.secure_url;
      })
    );

    // Upload gallery images to cloudinary
    let galleryImageUrls = await Promise.all(
      galleryImages.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
          folder: "portfolio/gallery"
        });
        return result.secure_url;
      })
    );

    // Parse technologies if it's a string
    const techArray = typeof technologies === 'string' 
      ? JSON.parse(technologies) 
      : technologies;

    const projectData = {
      title,
      category,
      description,
      fullDescription,
      technologies: techArray,
      image: mainImageUrls,
      gallery: galleryImageUrls,
      challenges,
      results,
      client,
      duration,
      featured: featured === 'true' || featured === true,
      completionDate
    };

    console.log(projectData);

    const project = new projectModel(projectData);
    await project.save();

    res.status(200).json({ 
      success: true,
      message: "Project added successfully",
      project 
    });

  } catch (error) {
    console.log(error);
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};

// List all projects
const listProjects = async (req, res) => {
  try {
    const { category, featured } = req.query;
    
    let filter = {};
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (featured === 'true') {
      filter.featured = true;
    }

    const projects = await projectModel.find(filter).sort({ createdAt: -1 });
    
    res.status(200).json({ 
      success: true,
      projects 
    });

  } catch (error) {
    console.log(error);
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Get single project
const singleProject = async (req, res) => {
  try {
    const project = await projectModel.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ 
        success: false,
        message: "Project not found" 
      });
    }

    res.status(200).json({ 
      success: true,
      project 
    });

  } catch (error) {
    console.log(error);
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Update project
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Parse technologies if it's a string
    if (updateData.technologies && typeof updateData.technologies === 'string') {
      updateData.technologies = JSON.parse(updateData.technologies);
    }

    // Handle new image uploads if any
    if (req.files) {
      const newImages = Object.values(req.files).flat();
      
      if (newImages.length > 0) {
        let newImageUrls = await Promise.all(
          newImages.map(async (item) => {
            let result = await cloudinary.uploader.upload(item.path, {
              resource_type: "image",
              folder: "portfolio/projects"
            });
            return result.secure_url;
          })
        );
        
        updateData.image = newImageUrls;
      }
    }

    const updatedProject = await projectModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ 
        success: false,
        message: "Project not found" 
      });
    }

    res.status(200).json({ 
      success: true,
      message: "Project updated successfully",
      project: updatedProject 
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedProject = await projectModel.findByIdAndDelete(id);
    
    if (!deletedProject) {
      return res.status(404).json({ 
        success: false,
        message: "Project not found" 
      });
    }

    res.status(200).json({ 
      success: true,
      message: "Project deleted successfully" 
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

export { 
  addProject, 
  listProjects, 
  singleProject, 
  updateProject, 
  deleteProject 
};
