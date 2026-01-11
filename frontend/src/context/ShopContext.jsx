import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";


export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
    const currency = 'KES ';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [all_product, setAllProducts] = useState([]);
    const [token, setToken] = useState('') 

    const navigate = useNavigate();

    const addToCart = async (id) => {
    setCartItems(prev => ({
        ...prev,
        [id]: (prev[id] || 0) + 1
    }));

    if (token) {
        try {
            const response = await axios.post(
                `${backendUrl}/api/cart/add`, 
                { productId: id },  
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(response.data.message); // Add success toast
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || error.message);
        }
    }
}; 

    const getCartCount = () =>
        Object.values(cartItems).reduce((a, b) => a + b, 0);

    const updateQuantity = async (id, quantity) => {
        setCartItems(prev => ({ ...prev, [id]: quantity }));

        if (token){
            try {
                await axios.post(
                `${backendUrl}/api/cart/update`, 
                { productId: id, quantity },  
                { headers: { Authorization: `Bearer ${token}` } }
            );
            } catch (error) {
                console.log(error);
                
            }
        }
    };

    const getCartAmount = () => {
        let total = 0;

        for (const id in cartItems) {
            const product = all_product.find(p => p._id === id);
            if (product) {
                total += product.price * cartItems[id];
            }
        }
        return total;
    };

    const getProductsData = async () => {
        try {
            const res = await axios.get(backendUrl + '/api/product/list');
            if (res.status === 200) {
                setAllProducts(res.data.products);
            }else{
                console.log();
                
            }
            
        } catch (err) {
            console.log(err);
        }
    };

    const getUsercart = async (token) => {
        try {
            const response = await axios.post(
                `${backendUrl}/api/cart/get`, {}, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if(response.status === 200){
                setCartItems(response.data.cartData);
            }
            
        }catch (err) {
            console.log(err);
            
        }
    };

    useEffect(() => {
        getProductsData();
    }, []);

    useEffect(() => {
      if(!token && localStorage.getItem('token')){
        setToken(localStorage.getItem('token'));
        getUsercart(localStorage.getItem('token'));
      }
    },[])

    const value = {
        all_product,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        setCartItems,
        addToCart,
        getCartCount,
        updateQuantity,
        getCartAmount,
        navigate,
        backendUrl,
        setToken,
        token
    };

    return (
        <ShopContext.Provider value={value}>
            {children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
