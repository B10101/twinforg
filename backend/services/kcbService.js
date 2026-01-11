import axios from 'axios';

let accessToken = process.env.KCB_ACCESS_TOKEN || null;
let tokenExpiry = accessToken ? Date.now() + 50 * 60 * 1000 : null;

const clientId = process.env.KCB_CLIENT_ID;
const clientSecret = process.env.KCB_CLIENT_SECRET;
const tokenUrl = process.env.KCB_TOKEN_URL;
const baseUrl = process.env.KCB_BASE_URL;

if (!baseUrl || (!accessToken && (!clientId || !clientSecret || !tokenUrl))) {
    throw new Error('KCB API configuration incomplete');
}

// Get or refresh access token
async function getAccessToken() {
    if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
        return accessToken;
    }

    if (!clientId || !clientSecret || !tokenUrl) {
        if (!accessToken) throw new Error('No valid KCB access token available');
        return accessToken;
    }

    return refreshAccessToken();
}

// Refresh access token
async function refreshAccessToken() {
    try {
        const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        
        const response = await axios.post(
            tokenUrl,
            'grant_type=client_credentials',
            {
                headers: {
                    Authorization: `Basic ${credentials}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        accessToken = response.data.access_token;
        tokenExpiry = Date.now() + response.data.expires_in * 1000 * 0.9;
        
        console.log('✅ KCB Access token refreshed');
        return accessToken;
    } catch (error) {
        console.error('❌ Failed to refresh KCB token:', error);
        throw error;
    }
}

// Format phone number to KCB format
function formatPhoneNumber(phoneNumber) {
    let phone = phoneNumber.replace(/\D/g, '');
    
    if (phone.startsWith('0')) phone = '254' + phone.slice(1);
    if (!phone.startsWith('254')) phone = '254' + phone;
    
    if (phone.length !== 12) {
        throw new Error('Invalid phone number format');
    }
    
    return phone;
}

// Initiate STK Push
async function initiatePayment({ phoneNumber, amount, transactionDesc, callbackUrl }) {
    try {
        const token = await getAccessToken();
        const phone = formatPhoneNumber(phoneNumber);
        const messageId = `${Date.now()}${Math.random().toString(36).slice(2, 10)}`;

        const payload = {
            phoneNumber: phone,
            amount: Math.round(amount).toString(),
            invoiceNumber: '7969521',
            sharedShortCode: true,
            orgShortCode: '',
            orgPassKey: '',
            callbackUrl,
            transactionDescription: transactionDesc.slice(0, 13)
        };

        console.log('Initiating KCB payment:', { phone, amount: payload.amount });

        const response = await axios.post(
            `${baseUrl}/mm/api/request/1.0.0/stkpush`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    routeCode: '207',
                    operation: 'STKPush',
                    messageId: messageId.slice(0, 32)
                }
            }
        );

        console.log('✅ KCB payment initiated:', response.data);
        return response.data;
        
    } catch (err) {
        if (err.response?.status === 401) {
            console.log('Token expired, refreshing...');
            accessToken = null;
            tokenExpiry = null;
            return initiatePayment({ phoneNumber, amount, transactionDesc, callbackUrl });
        }
        
        console.error('❌ KCB payment error:', err.response?.data || err.message);
        throw err;
    }
}

// Test connection
async function testConnection() {
    try {
        const token = await getAccessToken();
        return {
            success: true,
            tokenPreview: token.slice(0, 20) + '...'
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

export { initiatePayment, testConnection, formatPhoneNumber };