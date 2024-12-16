// axiosConfig.js
import axios from 'axios';
import https from 'https';

// Update this path to where your self-signed certificate is located


// Create an HTTPS agent with the certificate
const agent = new https.Agent({
    rejectUnauthorized: true,  // Set to false if you want to ignore SSL certificate errors (not recommended for production)
});

// Create an Axios instance with the HTTPS agent
const instance = axios.create({
    httpsAgent: agent,
});

export default instance;
