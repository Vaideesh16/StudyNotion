import axios from "axios";

export const axiosInstance = axios.create({
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
    }
    console.log("API Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.status, error.config?.url, error.response?.data);
    
    // Handle specific errors
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    
    if (error.code === 'ECONNABORTED') {
      console.error("Request timeout");
      error.message = "Request timeout. Please try again.";
    }
    
    if (error.code === 'ERR_NETWORK') {
      console.error("Network error");
      error.message = "Network error. Please check your connection and ensure the server is running.";
    }
    
    return Promise.reject(error);
  }
);

export const apiConnector = (method, url, bodyData, headers, params) => {
  return axiosInstance({
    method: `${method}`,
    url: `${url}`,
    data: bodyData ? bodyData : null,
    headers: headers ? { ...axiosInstance.defaults.headers, ...headers } : null,
    params: params ? params : null,
  });
};
