import React, { useState } from 'react'
import { upload } from '../assets/assets'
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';


const Add = ({token}) => {

  const [images, setImages] = useState([null,null,null,null]);  

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Tinkertronics");
  const [price, setPrice] = useState("");  

  const handleImageChange =(index, file) =>{
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);
  }

  const onSubmitHandler = async(e) =>{
    e.preventDefault();
    try{
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("price", price);

      images.forEach((image, index) => {
      if (image) {
        formData.append(`image${index + 1}`, image);
      }
    });
    toast.success("Adding product");  
    const response = await axios.post(backendUrl + '/api/product/add', formData, {
      headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data"}
    });
    if(response.status === 200){    
      
      setName("");
      setDescription("");
      setCategory("Tinkertronics");
      setPrice("");
      setImages([null, null, null, null]);
      toast.success(response.data.message);
    } else{
      toast.error(response.data.message);
    }

    }catch(err){
      toast.error(err.message);
    }
  }

  return (
    <div className="flex justify-center w-full">
      <form onSubmit={onSubmitHandler} className="flex flex-col items-center gap-4 w-full max-w-xl text-center">

        {/* Upload */}
        <div className="w-full">
          <p className="mb-2">Upload Images</p>
          <hr className="mb-2 border-gray-400" />
          <div className="flex justify-center gap-2">
            {[0,1,2,3].map((i) => (
              <label key={i} htmlFor={`image${i}`}>
                <img className="w-16 cursor-pointer" src={!images[i] ? upload : URL.createObjectURL(images[i])} alt="" />
                <input type="file" id={`image${i}`} hidden
                onChange={(e) => handleImageChange(i, e.target.files[0])}
                />
              </label>
            ))}
          </div>
        </div>

        {/* Name */}
        <div className="w-full">
          <p className="mb-2">Product Name</p>
          <input
            onChange={(e) => setName(e.target.value)} value={name}
            className="w-full border-b px-2 py-2 text-center"
            type="text"
            placeholder="Type Here"
            required
          />
        </div>

        {/* Description */}
        <div className="w-full">
          <p className="mb-2">Description</p>
          <textarea
            onChange={(e) => setDescription(e.target.value)} value={description}
            className="w-full border-b px-2 py-2 text-center"
            placeholder="Type Here"
            required
          />
        </div>

        {/* Category & Price */}
        <div className="flex justify-center gap-6 w-full">
          <div className="flex flex-col items-center">
            <p className="mb-2">Product Category</p>
            <select onChange={(e) => setCategory(e.target.value)} className="px-3 py-2 text-center">
              <option>Lume</option>
              <option>Tinkertronics</option>
              
            </select>
          </div>

          <div className="flex flex-col items-center">
            <p className="mb-2">Product Price</p>
            <input
              onChange={(e) => setPrice(e.target.value)} value={price}
              className="px-3 py-2 w-28 text-center"
              type="number"
              placeholder="1000"
            />
          </div>
        </div>
        <button className="w-32 bg-black text-white px-6 py-2 rounded-lg drop-shadow-lg cursor-pointer" type='submit'>ADD</button>
      </form>
    </div>
  );
};

export default Add