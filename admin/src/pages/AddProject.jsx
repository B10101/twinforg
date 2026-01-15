import React, { useState } from 'react';
import { backendUrl } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddProject = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('embedded');
  const [description, setDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [challenges, setChallenges] = useState('');
  const [results, setResults] = useState('');
  const [client, setClient] = useState('');
  const [duration, setDuration] = useState('');
  const [featured, setFeatured] = useState(false);
  const [completionDate, setCompletionDate] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append('title', title);
      formData.append('category', category);
      formData.append('description', description);
      formData.append('fullDescription', fullDescription);
      
      // Convert technologies string to array
      const techArray = technologies.split(',').map(tech => tech.trim());
      formData.append('technologies', JSON.stringify(techArray));
      
      formData.append('challenges', challenges);
      formData.append('results', results);
      formData.append('client', client);
      formData.append('duration', duration);
      formData.append('featured', featured);
      formData.append('completionDate', completionDate);

      image1 && formData.append('image1', image1);
      image2 && formData.append('image2', image2);
      image3 && formData.append('image3', image3);
      image4 && formData.append('image4', image4);

      // Add gallery images
      galleryImages.forEach((img, index) => {
        formData.append('gallery', img);
      });

      const response = await axios.post(backendUrl + '/api/project/add', formData, {
        headers: { token }
      });

      if (response.data.success) {
        toast.success(response.data.message);
        // Reset form
        setTitle('');
        setCategory('embedded');
        setDescription('');
        setFullDescription('');
        setTechnologies('');
        setChallenges('');
        setResults('');
        setClient('');
        setDuration('');
        setFeatured(false);
        setCompletionDate('');
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setGalleryImages([]);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleGalleryImages = (e) => {
    const files = Array.from(e.target.files);
    setGalleryImages(files);
  };

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
      <div>
        <p className='mb-2 text-lg font-semibold'>Upload Main Images</p>

        <div className='flex gap-2'>
          <label htmlFor="image1">
            <img className='w-20 cursor-pointer' src={!image1 ? '/upload_area.png' : URL.createObjectURL(image1)} alt="" />
            <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1" hidden />
          </label>
          <label htmlFor="image2">
            <img className='w-20 cursor-pointer' src={!image2 ? '/upload_area.png' : URL.createObjectURL(image2)} alt="" />
            <input onChange={(e) => setImage2(e.target.files[0])} type="file" id="image2" hidden />
          </label>
          <label htmlFor="image3">
            <img className='w-20 cursor-pointer' src={!image3 ? '/upload_area.png' : URL.createObjectURL(image3)} alt="" />
            <input onChange={(e) => setImage3(e.target.files[0])} type="file" id="image3" hidden />
          </label>
          <label htmlFor="image4">
            <img className='w-20 cursor-pointer' src={!image4 ? '/upload_area.png' : URL.createObjectURL(image4)} alt="" />
            <input onChange={(e) => setImage4(e.target.files[0])} type="file" id="image4" hidden />
          </label>
        </div>
      </div>

      <div className='w-full'>
        <p className='mb-2'>Gallery Images (Optional)</p>
        <input onChange={handleGalleryImages} type="file" multiple accept="image/*" className='w-full' />
        {galleryImages.length > 0 && (
          <p className='text-sm text-gray-500 mt-1'>{galleryImages.length} images selected</p>
        )}
        <hr />
      </div>

      <div className='w-full'>
        <p className='mb-2'>Project Title</p>
        <input onChange={(e) => setTitle(e.target.value)} value={title} className='w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded' type="text" placeholder='Type here' required />
      </div>

      <div className='w-full'>
        <p className='mb-2'>Short Description</p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded' placeholder='Brief project summary' required rows={3} />
      </div>

      <div className='w-full'>
        <p className='mb-2'>Full Description</p>
        <textarea onChange={(e) => setFullDescription(e.target.value)} value={fullDescription} className='w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded' placeholder='Detailed project description' required rows={5} />
      </div>

      <div className='w-full'>
        <p className='mb-2'>Technologies (comma-separated)</p>
        <input onChange={(e) => setTechnologies(e.target.value)} value={technologies} className='w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded' type="text" placeholder='React, Node.js, MongoDB' required />
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div>
          <p className='mb-2'>Project Category</p>
          <select onChange={(e) => setCategory(e.target.value)} className='w-full px-3 py-2 border border-gray-300 rounded'>
            <option value="embedded">Embedded Systems</option>
            <option value="hardware">Hardware</option>
            <option value="web">Web Development</option>
            <option value="automation">Automation</option>
            <option value="prototype">Prototyping</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Duration</p>
          <input onChange={(e) => setDuration(e.target.value)} value={duration} className='w-full px-3 py-2 border border-gray-300 rounded' type="text" placeholder='e.g., 3 months' />
        </div>

        <div>
          <p className='mb-2'>Completion Date</p>
          <input onChange={(e) => setCompletionDate(e.target.value)} value={completionDate} className='w-full px-3 py-2 border border-gray-300 rounded' type="date" />
        </div>
      </div>

      <div className='w-full'>
        <p className='mb-2'>Client Name (Optional)</p>
        <input onChange={(e) => setClient(e.target.value)} value={client} className='w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded' type="text" placeholder='Client or company name' />
      </div>

      <div className='w-full'>
        <p className='mb-2'>Challenges</p>
        <textarea onChange={(e) => setChallenges(e.target.value)} value={challenges} className='w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded' placeholder='Technical challenges faced' rows={3} />
      </div>

      <div className='w-full'>
        <p className='mb-2'>Results</p>
        <textarea onChange={(e) => setResults(e.target.value)} value={results} className='w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded' placeholder='Project outcomes and achievements' rows={3} />
      </div>

      <div className='flex items-center gap-2 mt-2'>
        <input onChange={() => setFeatured(prev => !prev)} checked={featured} type="checkbox" id='featured' />
        <label className='cursor-pointer' htmlFor="featured">Mark as Featured Project</label>
      </div>

      <button type='submit' className='w-28 py-3 mt-4 bg-black text-white rounded hover:bg-gray-800'>
        ADD PROJECT
      </button>
    </form>
  );
};

export default AddProject;