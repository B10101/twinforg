import express from 'express';
import { 
  addProject, 
  listProjects, 
  singleProject, 
  updateProject, 
  deleteProject 
} from '../controllers/projectController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const projectRouter = express.Router();

// Add project (admin only)
projectRouter.post('/add', adminAuth, upload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
  { name: 'image4', maxCount: 1 },
  { name: 'gallery', maxCount: 10 }
]), addProject);

// List all projects (public)
projectRouter.get('/list', listProjects);

// Get single project (public)
projectRouter.get('/:id', singleProject);

// Update project (admin only)
projectRouter.put('/update/:id', adminAuth, upload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
  { name: 'image4', maxCount: 1 },
  { name: 'gallery', maxCount: 10 }
]), updateProject);

// Delete project (admin only)
projectRouter.delete('/delete/:id', adminAuth, deleteProject);

export default projectRouter;