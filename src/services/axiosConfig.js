// pages/api/config/axiosInstance.js

import axios from 'axios';
import { parseCookies } from 'nookies'; // npm package for working with cookies in Next.js
import https from 'https';

// Update this path to where your self-signed certificate is located


// Create an HTTPS agent with the certificate
const agent = new https.Agent({
    rejectUnauthorized: true,  // Set to false if you want to ignore SSL certificate errors (not recommended for production)
});


const instance = axios.create({
  baseURL: 'https://api.topreview.expert',
  httpsAgent: agent, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an interceptor for requests
instance.interceptors.request.use(config => {
  const cookies = parseCookies();
  const sessionCookie = cookies.session;
  if (sessionCookie) {
    config.headers.Authorization = `Bearer ${sessionCookie}`; 
  }
  return config;
}, error => {
  console.error('Request Error:', error);
  return Promise.reject(error);
});

export default instance;
