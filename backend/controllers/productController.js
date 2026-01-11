import productModel from "../models/productModel.js";
import {v2 as cloudinary} from "cloudinary"

const addProduct = async (req, res) => {
    try{
        const {name,price,description,category} = req.body;
        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1,image2,image3,image4].filter((item) => item !== undefined)
        
        let imageUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, {resource_type:"image"})
                return result.secure_url
            })
        )
        
        const productData = {
            name,
            price,
            description,
            category,
            image:imageUrl 
        }
        console.log(productData);

        const product = new productModel(productData)

        await product.save()
        res.status(200).json({message:"Product added successfully"})

    }catch(error){
        console.log(error);
        res.status(400).json({message:error.message})
    }
}

const listProducts = async (req, res) => {
    try{
        
        const products = await productModel.find({})
        res.status(200).json({products})
    }catch(error){
        console.log(error);
        res.status(400).json({message:error.message})
    }
}

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await productModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });

  } catch (error) {
    
    res.status(500).json({ message: error.message });
  }
};


const singleProduct = async (req, res) => {
    try{
        const product = await productModel.findById(req.params.id)
        res.status(200).json({product})
    }catch(error){
        console.log(error);
        res.status(400).json({message:error.message})
    }
    
}


export {addProduct,listProducts,deleteProduct,singleProduct}