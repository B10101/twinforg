
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css'
import ShopContextProvider from './context/ShopContext'
import PortfolioContextProvider from './context/PortfolioContext'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')).render(

    <BrowserRouter>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <ShopContextProvider>
                <PortfolioContextProvider>
                    <App />
                </PortfolioContextProvider>
            </ShopContextProvider>
        </GoogleOAuthProvider>
    </BrowserRouter>
)
