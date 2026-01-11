import React, { useContext, useEffect, useState } from 'react'
import { dropdown } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import { ProductItem, Title } from '../components';

const Tinkertronics = () => {
  const { all_product, search, showSearch} = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [sortType, setSortType] = useState('all');
  const [category, setCategory] = useState([]);

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev=> prev.filter(item=> item !== e.target.value))
    }
    else{
      setCategory(prev=> [...prev, e.target.value])
    }
  }

  useEffect(() => {
    let productsCopy = all_product.slice();
    
    // Filter to show only Tinkertronics category
    productsCopy = productsCopy.filter(item => item.category === 'Tinkertronics');
    
    // Apply search filter
    if(showSearch && search){
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    }
    
    // Apply category filter (from checkboxes)
    if (category.length > 0){
      productsCopy = productsCopy.filter(item => category.includes(item.category));
    }
    
    // Apply sorting
    switch (sortType) {
      case 'Low to high':
        productsCopy.sort((a,b) => a.price - b.price);
        break;
      case 'High to low':
        productsCopy.sort((a,b) => b.price - a.price);
        break;
      default:
        break;
    }
    
    setFilterProducts(productsCopy);
  }, [category, search, showSearch, all_product, sortType])

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10'>
      <div className='flex-1'>
        <div className='flex flex-col sm:flex-row justify-between items-center text-base sm:text-2xl mb-4 gap-4'>
          <div className='flex-1 text-center'>
            <Title text1={'TINKERTRONICS'} text2={'COLLECTION'} />
          </div>
          <select onChange={(e) => setSortType(e.target.value)} className='border-2 border-gray-200 text-sm px-2 rounded-xl'>
            <option value="all">All</option>
            <option value="Low to high">Price: Low to high</option>
            <option value="High to low">Price: High to low</option>
          </select>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-6 gap-4'>
          {
            filterProducts.map((item,index) =>(
              <ProductItem key={item._id} id={item._id} image={item.image[0]} name={item.name} price={item.price} />
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Tinkertronics